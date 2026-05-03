<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        $filters = [
            'search' => $request->input('search'),
            'event_id' => $request->input('event_id'),
            'user_id' => $request->input('user_id'),
            'action' => $request->input('action'),
            'from_date' => $request->input('from_date'),
            'to_date' => $request->input('to_date'),
        ];

        $logs = EventActivityLog::query()
            ->with([
                'event:id,title,status,event_date',
                'user:id,name,email',
            ])
            ->when($filters['search'], function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('action', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($filters['event_id'], function ($query, $eventId) {
                $query->where('event_id', $eventId);
            })
            ->when($filters['user_id'], function ($query, $userId) {
                $query->where('user_id', $userId);
            })
            ->when($filters['action'], function ($query, $action) {
                $query->where('action', $action);
            })
            ->when($filters['from_date'], function ($query, $fromDate) {
                $query->whereDate('created_at', '>=', $fromDate);
            })
            ->when($filters['to_date'], function ($query, $toDate) {
                $query->whereDate('created_at', '<=', $toDate);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'created_at' => optional($log->created_at)->format('Y-m-d H:i'),
                'event' => [
                    'id' => $log->event?->id,
                    'title' => $log->event?->title,
                    'status' => $log->event?->status,
                    'event_date' => optional($log->event?->event_date)->format('Y-m-d'),
                ],
                'user' => [
                    'id' => $log->user?->id,
                    'name' => $log->user?->name,
                    'email' => $log->user?->email,
                ],
            ]);

        return Inertia::render('SuperAdminActivityLogs/Index', [
            'logs' => $logs,
            'filters' => $filters,
            'events' => $this->eventOptions(),
            'users' => $this->userOptions(),
            'actions' => $this->actionOptions(),
            'summary' => $this->summary(),
        ]);
    }

    private function eventOptions(): array
    {
        if (!Schema::hasTable('events')) {
            return [];
        }

        return Event::query()
            ->latest()
            ->limit(200)
            ->get(['id', 'title', 'status'])
            ->map(fn ($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'status' => $event->status ?? 'draft',
            ])
            ->toArray();
    }

    private function userOptions(): array
    {
        if (!Schema::hasTable('users')) {
            return [];
        }

        return User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ])
            ->toArray();
    }

    private function actionOptions(): array
    {
        if (!Schema::hasTable('event_activity_logs') || !Schema::hasColumn('event_activity_logs', 'action')) {
            return [];
        }

        return EventActivityLog::query()
            ->whereNotNull('action')
            ->where('action', '!=', '')
            ->select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action')
            ->map(fn ($action) => [
                'value' => $action,
                'label' => str_replace('_', ' ', ucfirst($action)),
            ])
            ->values()
            ->toArray();
    }

    private function summary(): array
    {
        if (!Schema::hasTable('event_activity_logs')) {
            return [
                'total_logs' => 0,
                'today_logs' => 0,
                'this_week_logs' => 0,
                'this_month_logs' => 0,
                'system_logs' => 0,
                'user_logs' => 0,
            ];
        }

        return [
            'total_logs' => EventActivityLog::query()->count(),
            'today_logs' => EventActivityLog::query()
                ->whereDate('created_at', today())
                ->count(),
            'this_week_logs' => EventActivityLog::query()
                ->where('created_at', '>=', now()->startOfWeek())
                ->count(),
            'this_month_logs' => EventActivityLog::query()
                ->where('created_at', '>=', now()->startOfMonth())
                ->count(),
            'system_logs' => EventActivityLog::query()
                ->whereNull('user_id')
                ->count(),
            'user_logs' => EventActivityLog::query()
                ->whereNotNull('user_id')
                ->count(),
        ];
    }
}
