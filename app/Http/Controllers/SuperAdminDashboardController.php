<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventActivityLog;
use App\Models\EventAnswer;
use App\Models\EventGuest;
use App\Models\EventInvitation;
use App\Models\EventQaCheck;
use App\Models\EventQuestion;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminDashboardController extends Controller
{
    public function index(): Response
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        return Inertia::render('SuperAdminDashboard/Index', [
            'summary' => $this->buildSummary(),
            'eventsByStatus' => $this->buildEventsByStatus(),
            'recentEvents' => $this->buildRecentEvents(),
            'recentActivityLogs' => $this->buildRecentActivityLogs(),
            'topOrganizers' => $this->buildTopOrganizers(),
            'monthlyEvents' => $this->buildMonthlyEvents(),
        ]);
    }

    private function buildSummary(): array
    {
        return [
            'total_events' => $this->safeCount(Event::class),
            'draft_events' => $this->safeEventStatusCount('draft'),
            'active_events' => $this->safeEventStatusCount('active'),
            'completed_events' => $this->safeEventStatusCount('completed'),
            'cancelled_events' => $this->safeEventStatusCount('cancelled'),

            'total_organizers' => $this->safeOrganizerCount(),
            'total_users' => $this->safeCount(User::class),
            'total_guests' => $this->safeCount(EventGuest::class),
            'total_invitations' => $this->safeCount(EventInvitation::class),
            'total_questions' => $this->safeCount(EventQuestion::class),
            'total_answers' => $this->safeCount(EventAnswer::class),
            'total_qa_checks' => $this->safeCount(EventQaCheck::class),
            'total_activity_logs' => $this->safeCount(EventActivityLog::class),
        ];
    }

    private function buildEventsByStatus(): array
    {
        $statuses = [
            'draft',
            'active',
            'completed',
            'cancelled',
        ];

        return collect($statuses)
            ->map(fn ($status) => [
                'status' => $status,
                'label' => ucfirst($status),
                'count' => $this->safeEventStatusCount($status),
            ])
            ->values()
            ->toArray();
    }

    private function buildRecentEvents(): array
    {
        if (!class_exists(Event::class) || !Schema::hasTable('events')) {
            return [];
        }

        return Event::query()
            ->with('user:id,name,email')
            ->latest()
            ->limit(10)
            ->get([
                'id',
                'user_id',
                'title',
                'event_date',
                'event_time',
                'venue',
                'status',
                'created_at',
            ])
            ->map(fn ($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => optional($event->event_date)->format('Y-m-d'),
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'status' => $event->status ?? 'draft',
                'created_at' => optional($event->created_at)->format('Y-m-d H:i'),
                'organizer' => [
                    'name' => $event->user?->name,
                    'email' => $event->user?->email,
                ],
            ])
            ->toArray();
    }

    private function buildRecentActivityLogs(): array
    {
        if (!class_exists(EventActivityLog::class) || !Schema::hasTable('event_activity_logs')) {
            return [];
        }

        return EventActivityLog::query()
            ->with([
                'event:id,title,status',
                'user:id,name,email',
            ])
            ->latest()
            ->limit(15)
            ->get([
                'id',
                'event_id',
                'user_id',
                'action',
                'description',
                'created_at',
            ])
            ->map(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'created_at' => optional($log->created_at)->format('Y-m-d H:i'),
                'event' => [
                    'id' => $log->event?->id,
                    'title' => $log->event?->title,
                    'status' => $log->event?->status,
                ],
                'user' => [
                    'name' => $log->user?->name,
                    'email' => $log->user?->email,
                ],
            ])
            ->toArray();
    }

    private function buildTopOrganizers(): array
    {
        if (!Schema::hasTable('users') || !Schema::hasTable('events')) {
            return [];
        }

        return User::query()
            ->select([
                'users.id',
                'users.name',
                'users.email',
                DB::raw('COUNT(events.id) as events_count'),
            ])
            ->leftJoin('events', 'events.user_id', '=', 'users.id')
            ->groupBy('users.id', 'users.name', 'users.email')
            ->having('events_count', '>', 0)
            ->orderByDesc('events_count')
            ->limit(10)
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'events_count' => (int) $user->events_count,
            ])
            ->toArray();
    }

    private function buildMonthlyEvents(): array
    {
        if (!Schema::hasTable('events')) {
            return [];
        }

        return Event::query()
            ->select([
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('COUNT(*) as count'),
            ])
            ->whereNotNull('created_at')
            ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"))
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => $row->month,
                'count' => (int) $row->count,
            ])
            ->toArray();
    }

    private function safeCount(string $modelClass): int
    {
        try {
            if (!class_exists($modelClass)) {
                return 0;
            }

            $model = new $modelClass();

            if (!Schema::hasTable($model->getTable())) {
                return 0;
            }

            return $modelClass::query()->count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function safeEventStatusCount(string $status): int
    {
        try {
            if (!Schema::hasTable('events') || !Schema::hasColumn('events', 'status')) {
                return 0;
            }

            return Event::query()
                ->where('status', $status)
                ->count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function safeOrganizerCount(): int
    {
        try {
            if (!Schema::hasTable('users') || !Schema::hasTable('events')) {
                return 0;
            }

            return User::query()
                ->whereHas('events')
                ->count();
        } catch (\Throwable) {
            return 0;
        }
    }
}
