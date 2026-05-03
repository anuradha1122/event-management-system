<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventActivityLogController extends Controller
{
    public function index(Request $request, Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $filters = [
            'search' => $request->input('search'),
            'action' => $request->input('action'),
            'user_id' => $request->input('user_id'),
            'subject_type' => $request->input('subject_type'),
            'from' => $request->input('from'),
            'to' => $request->input('to'),
        ];

        $logs = EventActivityLog::query()
            ->with(['user:id,name'])
            ->where('event_id', $event->id)
            ->when($filters['search'], function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('action', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('subject_type', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%");
                });
            })
            ->when($filters['action'], function ($query, $action) {
                $query->where('action', $action);
            })
            ->when($filters['user_id'], function ($query, $userId) {
                $query->where('user_id', $userId);
            })
            ->when($filters['subject_type'], function ($query, $subjectType) {
                $query->where('subject_type', $subjectType);
            })
            ->when($filters['from'], function ($query, $from) {
                $query->whereDate('created_at', '>=', $from);
            })
            ->when($filters['to'], function ($query, $to) {
                $query->whereDate('created_at', '<=', $to);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(function (EventActivityLog $log) {
                return [
                    'id' => $log->id,
                    'event_id' => $log->event_id,
                    'user' => $log->user ? [
                        'id' => $log->user->id,
                        'name' => $log->user->name,
                    ] : null,
                    'subject_type' => $log->subject_type,
                    'subject_name' => $this->formatSubjectName($log->subject_type),
                    'subject_id' => $log->subject_id,
                    'action' => $log->action,
                    'action_label' => $this->formatActionLabel($log->action),
                    'description' => $log->description,
                    'properties' => $log->properties,
                    'ip_address' => $log->ip_address,
                    'user_agent' => $log->user_agent,
                    'created_at' => $log->created_at?->format('Y-m-d H:i:s'),
                    'created_at_human' => $log->created_at?->diffForHumans(),
                ];
            });

        $baseQuery = EventActivityLog::query()
            ->where('event_id', $event->id);

        $summary = [
            'total' => (clone $baseQuery)->count(),
            'today' => (clone $baseQuery)->whereDate('created_at', today())->count(),
            'guest_actions' => (clone $baseQuery)->where('subject_type', 'like', '%EventGuest')->count(),
            'followups' => (clone $baseQuery)->whereIn('action', [
                'followup_email_sent',
                'followup_manual_marked',
                'bulk_followup_email_sent',
                'bulk_followup_manual_marked',
            ])->count(),
            'checkins' => (clone $baseQuery)->whereIn('action', [
                'guest_checked_in',
                'guest_checkin_undone',
            ])->count(),
            'reminders' => (clone $baseQuery)->where('action', 'like', 'reminder_%')->count(),
        ];

        $actions = EventActivityLog::query()
            ->where('event_id', $event->id)
            ->select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action')
            ->map(fn ($action) => [
                'value' => $action,
                'label' => $this->formatActionLabel($action),
            ])
            ->values();

        $users = EventActivityLog::query()
            ->with('user:id,name')
            ->where('event_id', $event->id)
            ->whereNotNull('user_id')
            ->get()
            ->pluck('user')
            ->filter()
            ->unique('id')
            ->values()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
            ]);

        $subjectTypes = EventActivityLog::query()
            ->where('event_id', $event->id)
            ->whereNotNull('subject_type')
            ->select('subject_type')
            ->distinct()
            ->orderBy('subject_type')
            ->pluck('subject_type')
            ->map(fn ($type) => [
                'value' => $type,
                'label' => $this->formatSubjectName($type),
            ])
            ->values();

        return Inertia::render('EventActivityLogs/Index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date ?? null,
                'venue' => $event->venue ?? null,
            ],
            'logs' => $logs,
            'filters' => $filters,
            'summary' => $summary,
            'actions' => $actions,
            'users' => $users,
            'subjectTypes' => $subjectTypes,
        ]);
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

        $ownerId = $event->user_id
            ?? $event->created_by
            ?? $event->organizer_id
            ?? null;

        if ($ownerId && (int) $ownerId === (int) $user->id) {
            return;
        }

        abort(403);
    }

    private function formatActionLabel(string $action): string
    {
        return str($action)
            ->replace('_', ' ')
            ->title()
            ->toString();
    }

    private function formatSubjectName(?string $subjectType): ?string
    {
        if (! $subjectType) {
            return null;
        }

        return class_basename($subjectType);
    }
}
