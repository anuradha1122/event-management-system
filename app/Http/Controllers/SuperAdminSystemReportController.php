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
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SuperAdminSystemReportController extends Controller
{
    public function pdf(): Response
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        $pdf = Pdf::loadView('reports.super-admin-system-report', [
            'generatedAt' => now(),
            'generatedBy' => auth()->user(),
            'summary' => $this->summary(),
            'eventsByStatus' => $this->eventsByStatus(),
            'topOrganizers' => $this->topOrganizers(),
            'recentEvents' => $this->recentEvents(),
            'recentActivityLogs' => $this->recentActivityLogs(),
            'monthlyEvents' => $this->monthlyEvents(),
        ])->setPaper('a4', 'portrait');

        return $pdf->stream('super-admin-system-report.pdf');
    }

    private function summary(): array
    {
        return [
            'total_events' => $this->safeCount(Event::class),
            'draft_events' => $this->eventStatusCount('draft'),
            'active_events' => $this->eventStatusCount('active'),
            'completed_events' => $this->eventStatusCount('completed'),
            'cancelled_events' => $this->eventStatusCount('cancelled'),

            'total_users' => $this->safeCount(User::class),
            'super_admins' => $this->roleUserCount('Super Admin'),
            'organizers' => $this->organizerCount(),
            'users_without_events' => $this->usersWithoutEventsCount(),

            'total_guests' => $this->safeCount(EventGuest::class),
            'total_invitations' => $this->safeCount(EventInvitation::class),
            'total_questions' => $this->safeCount(EventQuestion::class),
            'total_answers' => $this->safeCount(EventAnswer::class),
            'total_qa_checks' => $this->safeCount(EventQaCheck::class),
            'total_activity_logs' => $this->safeCount(EventActivityLog::class),

            'today_logs' => $this->activityLogsFrom(today()),
            'this_week_logs' => $this->activityLogsFrom(now()->startOfWeek()),
            'this_month_logs' => $this->activityLogsFrom(now()->startOfMonth()),
        ];
    }

    private function eventsByStatus(): array
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
                'count' => $this->eventStatusCount($status),
            ])
            ->values()
            ->toArray();
    }

    private function topOrganizers(): array
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

    private function recentEvents(): array
    {
        if (!Schema::hasTable('events')) {
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
                'event_type',
                'status',
                'created_at',
            ])
            ->map(fn ($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => optional($event->event_date)->format('Y-m-d'),
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'event_type' => $event->event_type,
                'status' => $event->status ?? 'draft',
                'created_at' => optional($event->created_at)->format('Y-m-d H:i'),
                'organizer_name' => $event->user?->name,
                'organizer_email' => $event->user?->email,
            ])
            ->toArray();
    }

    private function recentActivityLogs(): array
    {
        if (!Schema::hasTable('event_activity_logs')) {
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
                'event_title' => $log->event?->title,
                'event_status' => $log->event?->status,
                'user_name' => $log->user?->name,
                'user_email' => $log->user?->email,
            ])
            ->toArray();
    }

    private function monthlyEvents(): array
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

    private function eventStatusCount(string $status): int
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

    private function roleUserCount(string $roleName): int
    {
        try {
            if (!Schema::hasTable('users') || !Schema::hasTable('roles')) {
                return 0;
            }

            return User::role($roleName)->count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function organizerCount(): int
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

    private function usersWithoutEventsCount(): int
    {
        try {
            if (!Schema::hasTable('users') || !Schema::hasTable('events')) {
                return 0;
            }

            return User::query()
                ->whereDoesntHave('events')
                ->count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function activityLogsFrom($dateTime): int
    {
        try {
            if (!Schema::hasTable('event_activity_logs')) {
                return 0;
            }

            return EventActivityLog::query()
                ->where('created_at', '>=', $dateTime)
                ->count();
        } catch (\Throwable) {
            return 0;
        }
    }
}
