<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventStaff;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventStaffController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $staff = EventStaff::query()
            ->where('event_id', $event->id)
            ->orderByRaw("
                CASE status
                    WHEN 'active' THEN 1
                    WHEN 'inactive' THEN 2
                    ELSE 3
                END
            ")
            ->orderBy('role')
            ->orderBy('name')
            ->get();

        $totalStaff = $staff->count();
        $activeStaff = $staff->where('status', 'active')->count();
        $inactiveStaff = $staff->where('status', 'inactive')->count();

        return Inertia::render('EventStaff/Index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'venue' => $event->venue,
                'status' => $event->status,
            ],
            'staff' => $staff->map(function (EventStaff $staffMember) {
                return [
                    'id' => $staffMember->id,
                    'name' => $staffMember->name,
                    'role' => $staffMember->role,
                    'phone' => $staffMember->phone,
                    'email' => $staffMember->email,
                    'notes' => $staffMember->notes,
                    'status' => $staffMember->status,
                ];
            }),
            'summary' => [
                'total' => $totalStaff,
                'active' => $activeStaff,
                'inactive' => $inactiveStaff,
            ],
            'statuses' => $this->statuses(),
        ]);
    }

    public function create(Event $event): Response|RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        return Inertia::render('EventStaff/Create', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'status' => $event->status,
            ],
            'statuses' => $this->statuses(),
        ]);
    }

    public function store(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $validated['event_id'] = $event->id;

        EventStaff::create($validated);

        return redirect()
            ->route('events.staff.index', $event->id)
            ->with('success', 'Staff member created successfully.');
    }

    public function edit(Event $event, EventStaff $staff): Response|RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureStaffBelongsToEvent($event, $staff);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        return Inertia::render('EventStaff/Edit', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'status' => $event->status,
            ],
            'staffMember' => [
                'id' => $staff->id,
                'name' => $staff->name,
                'role' => $staff->role,
                'phone' => $staff->phone,
                'email' => $staff->email,
                'notes' => $staff->notes,
                'status' => $staff->status,
            ],
            'statuses' => $this->statuses(),
        ]);
    }

    public function update(Request $request, Event $event, EventStaff $staff): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureStaffBelongsToEvent($event, $staff);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $staff->update($validated);

        return redirect()
            ->route('events.staff.index', $event->id)
            ->with('success', 'Staff member updated successfully.');
    }

    public function destroy(Event $event, EventStaff $staff): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureStaffBelongsToEvent($event, $staff);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $staff->delete();

        return redirect()
            ->route('events.staff.index', $event->id)
            ->with('success', 'Staff member deleted successfully.');
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
                ->route('events.staff.index', $event)
                ->with('error', 'This event is closed and staff assignments cannot be modified.');
        }

        return null;
    }

    private function ensureStaffBelongsToEvent(Event $event, EventStaff $staff): void
    {
        if ((int) $staff->event_id !== (int) $event->id) {
            abort(404);
        }
    }

    private function statuses(): array
    {
        return [
            ['value' => 'active', 'label' => 'Active'],
            ['value' => 'inactive', 'label' => 'Inactive'],
        ];
    }
}
