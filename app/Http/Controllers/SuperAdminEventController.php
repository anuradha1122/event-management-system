<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminEventController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'event_type' => $request->input('event_type'),
            'organizer_id' => $request->input('organizer_id'),
            'from_date' => $request->input('from_date'),
            'to_date' => $request->input('to_date'),
        ];

        $events = Event::query()
            ->with('user:id,name,email')
            ->withCount([
                'guests',
                'invitations',
                'questions',
                'qaChecks',
                'activityLogs',
            ])
            ->when($filters['search'], function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('venue', 'like', "%{$search}%")
                        ->orWhere('event_type', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($filters['status'], function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($filters['event_type'], function ($query, $eventType) {
                $query->where('event_type', $eventType);
            })
            ->when($filters['organizer_id'], function ($query, $organizerId) {
                $query->where('user_id', $organizerId);
            })
            ->when($filters['from_date'], function ($query, $fromDate) {
                $query->whereDate('event_date', '>=', $fromDate);
            })
            ->when($filters['to_date'], function ($query, $toDate) {
                $query->whereDate('event_date', '<=', $toDate);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'event_date' => optional($event->event_date)->format('Y-m-d'),
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'event_type' => $event->event_type,
                'status' => $event->status ?? 'draft',
                'created_at' => optional($event->created_at)->format('Y-m-d H:i'),
                'updated_at' => optional($event->updated_at)->format('Y-m-d H:i'),
                'organizer' => [
                    'id' => $event->user?->id,
                    'name' => $event->user?->name,
                    'email' => $event->user?->email,
                ],
                'counts' => [
                    'guests' => $event->guests_count ?? 0,
                    'invitations' => $event->invitations_count ?? 0,
                    'questions' => $event->questions_count ?? 0,
                    'qa_checks' => $event->qa_checks_count ?? 0,
                    'activity_logs' => $event->activity_logs_count ?? 0,
                ],
            ]);

        return Inertia::render('SuperAdminEvents/Index', [
            'events' => $events,
            'filters' => $filters,
            'statusOptions' => $this->statusOptions(),
            'eventTypeOptions' => $this->eventTypeOptions(),
            'organizers' => $this->organizerOptions(),
            'summary' => $this->summary(),
        ]);
    }

    private function statusOptions(): array
    {
        return [
            ['value' => 'draft', 'label' => 'Draft'],
            ['value' => 'active', 'label' => 'Active'],
            ['value' => 'completed', 'label' => 'Completed'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
        ];
    }

    private function eventTypeOptions(): array
    {
        if (!Schema::hasTable('events') || !Schema::hasColumn('events', 'event_type')) {
            return [];
        }

        return Event::query()
            ->whereNotNull('event_type')
            ->where('event_type', '!=', '')
            ->select('event_type')
            ->distinct()
            ->orderBy('event_type')
            ->pluck('event_type')
            ->map(fn ($type) => [
                'value' => $type,
                'label' => $type,
            ])
            ->values()
            ->toArray();
    }

    private function organizerOptions(): array
    {
        if (!Schema::hasTable('users') || !Schema::hasTable('events')) {
            return [];
        }

        return User::query()
            ->whereHas('events')
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ])
            ->toArray();
    }

    private function summary(): array
    {
        if (!Schema::hasTable('events')) {
            return [
                'total' => 0,
                'draft' => 0,
                'active' => 0,
                'completed' => 0,
                'cancelled' => 0,
            ];
        }

        return [
            'total' => Event::query()->count(),
            'draft' => $this->statusCount('draft'),
            'active' => $this->statusCount('active'),
            'completed' => $this->statusCount('completed'),
            'cancelled' => $this->statusCount('cancelled'),
        ];
    }

    private function statusCount(string $status): int
    {
        if (!Schema::hasColumn('events', 'status')) {
            return 0;
        }

        return Event::query()
            ->where('status', $status)
            ->count();
    }
}
