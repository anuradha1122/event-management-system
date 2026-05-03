<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventSchedule;
use App\Models\EventStaff;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventScheduleController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $schedules = EventSchedule::query()
            ->with('staff:id,event_id,name,role,phone,email')
            ->where('event_id', $event->id)
            ->orderBy('schedule_date')
            ->orderBy('sort_order')
            ->orderBy('start_time')
            ->latest()
            ->get();

        $totalSchedules = $schedules->count();
        $pendingSchedules = $schedules->where('status', 'pending')->count();
        $ongoingSchedules = $schedules->where('status', 'ongoing')->count();
        $completedSchedules = $schedules->where('status', 'completed')->count();
        $cancelledSchedules = $schedules->where('status', 'cancelled')->count();

        return Inertia::render('EventSchedules/Index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'status' => $event->status,
            ],
            'schedules' => $schedules->map(function (EventSchedule $schedule) {
                return [
                    'id' => $schedule->id,
                    'staff_id' => $schedule->staff_id,
                    'staff' => $schedule->staff ? [
                        'id' => $schedule->staff->id,
                        'name' => $schedule->staff->name,
                        'role' => $schedule->staff->role,
                        'phone' => $schedule->staff->phone,
                        'email' => $schedule->staff->email,
                    ] : null,
                    'title' => $schedule->title,
                    'description' => $schedule->description,
                    'schedule_date' => $schedule->schedule_date?->format('Y-m-d'),
                    'start_time' => $schedule->start_time,
                    'end_time' => $schedule->end_time,
                    'location' => $schedule->location,
                    'assigned_to' => $schedule->assigned_to,
                    'status' => $schedule->status,
                    'sort_order' => $schedule->sort_order,
                ];
            }),
            'summary' => [
                'total' => $totalSchedules,
                'pending' => $pendingSchedules,
                'ongoing' => $ongoingSchedules,
                'completed' => $completedSchedules,
                'cancelled' => $cancelledSchedules,
            ],
        ]);
    }

    public function create(Event $event): Response|RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        return Inertia::render('EventSchedules/Create', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'venue' => $event->venue,
                'status' => $event->status,
            ],
            'statuses' => $this->statuses(),
            'staffMembers' => $this->activeStaffMembers($event),
        ]);
    }

    public function store(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'staff_id' => ['nullable', 'integer', 'exists:event_staff,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'schedule_date' => ['nullable', 'date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'location' => ['nullable', 'string', 'max:255'],
            'assigned_to' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:pending,ongoing,completed,cancelled'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $this->ensureStaffBelongsToEventIfSelected($event, $validated['staff_id'] ?? null);

        $validated['event_id'] = $event->id;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        EventSchedule::create($validated);

        return redirect()
            ->route('events.schedules.index', $event->id)
            ->with('success', 'Schedule item created successfully.');
    }

    public function edit(Event $event, EventSchedule $schedule): Response|RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureScheduleBelongsToEvent($event, $schedule);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        return Inertia::render('EventSchedules/Edit', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'venue' => $event->venue,
                'status' => $event->status,
            ],
            'schedule' => [
                'id' => $schedule->id,
                'staff_id' => $schedule->staff_id,
                'title' => $schedule->title,
                'description' => $schedule->description,
                'schedule_date' => $schedule->schedule_date?->format('Y-m-d'),
                'start_time' => $this->formatTimeForInput($schedule->start_time),
                'end_time' => $this->formatTimeForInput($schedule->end_time),
                'location' => $schedule->location,
                'assigned_to' => $schedule->assigned_to,
                'status' => $schedule->status,
                'sort_order' => $schedule->sort_order,
            ],
            'statuses' => $this->statuses(),
            'staffMembers' => $this->activeStaffMembers($event),
        ]);
    }

    public function update(Request $request, Event $event, EventSchedule $schedule): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureScheduleBelongsToEvent($event, $schedule);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'staff_id' => ['nullable', 'integer', 'exists:event_staff,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'schedule_date' => ['nullable', 'date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'location' => ['nullable', 'string', 'max:255'],
            'assigned_to' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:pending,ongoing,completed,cancelled'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $this->ensureStaffBelongsToEventIfSelected($event, $validated['staff_id'] ?? null);

        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        $schedule->update($validated);

        return redirect()
            ->route('events.schedules.index', $event->id)
            ->with('success', 'Schedule item updated successfully.');
    }

    public function complete(Event $event, EventSchedule $schedule): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureScheduleBelongsToEvent($event, $schedule);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $schedule->update([
            'status' => 'completed',
        ]);

        return redirect()
            ->route('events.schedules.index', $event->id)
            ->with('success', 'Schedule item marked as completed.');
    }

    public function destroy(Event $event, EventSchedule $schedule): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureScheduleBelongsToEvent($event, $schedule);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $schedule->delete();

        return redirect()
            ->route('events.schedules.index', $event->id)
            ->with('success', 'Schedule item deleted successfully.');
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = auth()->user();

        if (! $user) {
            abort(403);
        }

        if ($user->hasRole('Super Admin')) {
            return;
        }

        if ((int) $event->user_id !== (int) $user->id) {
            abort(403);
        }
    }

    private function preventClosedEventModification(Event $event): ?RedirectResponse
    {
        if (in_array($event->status, ['completed', 'cancelled'], true)) {
            return redirect()
                ->route('events.schedules.index', $event)
                ->with('error', 'This event is closed and schedules cannot be modified.');
        }

        return null;
    }

    private function ensureScheduleBelongsToEvent(Event $event, EventSchedule $schedule): void
    {
        if ((int) $schedule->event_id !== (int) $event->id) {
            abort(404);
        }
    }

    private function ensureStaffBelongsToEventIfSelected(Event $event, mixed $staffId): void
    {
        if (! $staffId) {
            return;
        }

        $staffExists = EventStaff::query()
            ->where('id', $staffId)
            ->where('event_id', $event->id)
            ->exists();

        if (! $staffExists) {
            abort(404);
        }
    }

    private function activeStaffMembers(Event $event): array
    {
        return EventStaff::query()
            ->where('event_id', $event->id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'role', 'phone', 'email'])
            ->map(function (EventStaff $staff) {
                return [
                    'id' => $staff->id,
                    'name' => $staff->name,
                    'role' => $staff->role,
                    'phone' => $staff->phone,
                    'email' => $staff->email,
                ];
            })
            ->toArray();
    }

    private function statuses(): array
    {
        return [
            ['value' => 'pending', 'label' => 'Pending'],
            ['value' => 'ongoing', 'label' => 'Ongoing'],
            ['value' => 'completed', 'label' => 'Completed'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
        ];
    }

    private function formatTimeForInput(?string $time): ?string
    {
        if (! $time) {
            return null;
        }

        return substr($time, 0, 5);
    }
}
