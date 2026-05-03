<?php

namespace App\Http\Controllers;

use App\Mail\EventReminderDueMail;
use App\Models\Event;
use App\Models\EventReminder;
use App\Models\EventReminderLog;
use App\Models\EventSchedule;
use App\Models\EventStaff;
use App\Models\EventTask;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class EventReminderController extends Controller
{
    private array $reminderTypes = [
        'general' => 'General',
        'task' => 'Task',
        'schedule' => 'Schedule',
        'payment' => 'Payment',
        'guest_followup' => 'Guest Follow-up',
        'vendor' => 'Vendor',
    ];

    private array $statuses = [
        'pending' => 'Pending',
        'sent' => 'Sent',
        'cancelled' => 'Cancelled',
    ];

    public function index(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $reminders = EventReminder::query()
            ->with([
                'task:id,event_id,title',
                'schedule:id,event_id,title,schedule_date,start_time',
                'staff:id,event_id,name,role',
            ])
            ->where('event_id', $event->id)
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->orderBy('remind_at')
            ->get()
            ->map(function (EventReminder $reminder) {
                return [
                    'id' => $reminder->id,
                    'event_id' => $reminder->event_id,
                    'title' => $reminder->title,
                    'message' => $reminder->message,
                    'reminder_type' => $reminder->reminder_type,
                    'reminder_type_label' => $this->reminderTypes[$reminder->reminder_type] ?? ucfirst($reminder->reminder_type),
                    'remind_at' => optional($reminder->remind_at)->format('Y-m-d H:i'),
                    'status' => $reminder->status,
                    'sent_at' => optional($reminder->sent_at)->format('Y-m-d H:i'),
                    'task' => $reminder->task ? [
                        'id' => $reminder->task->id,
                        'title' => $reminder->task->title,
                    ] : null,
                    'schedule' => $reminder->schedule ? [
                        'id' => $reminder->schedule->id,
                        'title' => $reminder->schedule->title,
                        'schedule_date' => optional($reminder->schedule->schedule_date)->format('Y-m-d'),
                        'start_time' => $reminder->schedule->start_time,
                    ] : null,
                    'staff' => $reminder->staff ? [
                        'id' => $reminder->staff->id,
                        'name' => $reminder->staff->name,
                        'role' => $reminder->staff->role,
                    ] : null,
                ];
            });

        $total = $reminders->count();
        $pending = $reminders->where('status', 'pending')->count();
        $sent = $reminders->where('status', 'sent')->count();
        $cancelled = $reminders->where('status', 'cancelled')->count();

        $upcoming = EventReminder::query()
            ->where('event_id', $event->id)
            ->where('status', 'pending')
            ->where('remind_at', '>=', now())
            ->count();

        return Inertia::render('EventReminders/Index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'status' => $event->status,
            ],
            'reminders' => $reminders,
            'summary' => [
                'total' => $total,
                'pending' => $pending,
                'sent' => $sent,
                'cancelled' => $cancelled,
                'upcoming' => $upcoming,
            ],
        ]);
    }

    public function create(Event $event): Response|RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        return Inertia::render('EventReminders/Create', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'status' => $event->status,
            ],
            'tasks' => $this->getTasks($event),
            'schedules' => $this->getSchedules($event),
            'staffMembers' => $this->getStaff($event),
            'reminderTypes' => $this->reminderTypes,
            'statuses' => $this->statuses,
        ]);
    }

    public function store(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'message' => ['nullable', 'string'],
            'reminder_type' => ['required', 'in:general,task,schedule,payment,guest_followup,vendor'],
            'task_id' => ['nullable', 'integer', 'exists:event_tasks,id'],
            'schedule_id' => ['nullable', 'integer', 'exists:event_schedules,id'],
            'staff_id' => ['nullable', 'integer', 'exists:event_staff,id'],
            'remind_at' => ['required', 'date'],
            'status' => ['required', 'in:pending,sent,cancelled'],
        ]);

        $this->ensureRelatedRecordsBelongToEvent($event, $validated);

        EventReminder::create([
            'event_id' => $event->id,
            'task_id' => $validated['task_id'] ?? null,
            'schedule_id' => $validated['schedule_id'] ?? null,
            'staff_id' => $validated['staff_id'] ?? null,
            'title' => $validated['title'],
            'message' => $validated['message'] ?? null,
            'reminder_type' => $validated['reminder_type'],
            'remind_at' => $validated['remind_at'],
            'status' => $validated['status'],
            'sent_at' => $validated['status'] === 'sent' ? now() : null,
        ]);

        return redirect()
            ->route('events.reminders.index', $event->id)
            ->with('success', 'Reminder created successfully.');
    }

    public function edit(Event $event, EventReminder $reminder): Response|RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureReminderBelongsToEvent($event, $reminder);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        return Inertia::render('EventReminders/Edit', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'status' => $event->status,
            ],
            'reminder' => [
                'id' => $reminder->id,
                'title' => $reminder->title,
                'message' => $reminder->message,
                'reminder_type' => $reminder->reminder_type,
                'task_id' => $reminder->task_id,
                'schedule_id' => $reminder->schedule_id,
                'staff_id' => $reminder->staff_id,
                'remind_at' => optional($reminder->remind_at)->format('Y-m-d\TH:i'),
                'status' => $reminder->status,
            ],
            'tasks' => $this->getTasks($event),
            'schedules' => $this->getSchedules($event),
            'staffMembers' => $this->getStaff($event),
            'reminderTypes' => $this->reminderTypes,
            'statuses' => $this->statuses,
        ]);
    }

    public function update(Request $request, Event $event, EventReminder $reminder): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureReminderBelongsToEvent($event, $reminder);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'message' => ['nullable', 'string'],
            'reminder_type' => ['required', 'in:general,task,schedule,payment,guest_followup,vendor'],
            'task_id' => ['nullable', 'integer', 'exists:event_tasks,id'],
            'schedule_id' => ['nullable', 'integer', 'exists:event_schedules,id'],
            'staff_id' => ['nullable', 'integer', 'exists:event_staff,id'],
            'remind_at' => ['required', 'date'],
            'status' => ['required', 'in:pending,sent,cancelled'],
        ]);

        $this->ensureRelatedRecordsBelongToEvent($event, $validated);

        $sentAt = $reminder->sent_at;

        if ($validated['status'] === 'sent' && ! $sentAt) {
            $sentAt = now();
        }

        if ($validated['status'] !== 'sent') {
            $sentAt = null;
        }

        $reminder->update([
            'task_id' => $validated['task_id'] ?? null,
            'schedule_id' => $validated['schedule_id'] ?? null,
            'staff_id' => $validated['staff_id'] ?? null,
            'title' => $validated['title'],
            'message' => $validated['message'] ?? null,
            'reminder_type' => $validated['reminder_type'],
            'remind_at' => $validated['remind_at'],
            'status' => $validated['status'],
            'sent_at' => $sentAt,
        ]);

        return redirect()
            ->route('events.reminders.index', $event->id)
            ->with('success', 'Reminder updated successfully.');
    }

    public function logs(Request $request, Event $event, EventReminder $reminder): Response
    {
        $this->authorizeEventAccess($event);
        $this->ensureReminderBelongsToEvent($event, $reminder);

        $reminder->load([
            'task:id,event_id,title',
            'schedule:id,event_id,title,schedule_date,start_time',
            'staff:id,event_id,name,role,email',
        ]);

        $status = $request->input('status');
        $recipientType = $request->input('recipient_type');
        $search = $request->input('search');

        $baseLogsQuery = $reminder->logs();

        $filteredLogsQuery = $reminder->logs()
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($recipientType, function ($query) use ($recipientType) {
                $query->where('recipient_type', $recipientType);
            })
            ->when($search, function ($query) use ($search) {
                $query->where('recipient_email', 'like', '%' . $search . '%');
            });

        $logSummary = [
            'total' => (clone $baseLogsQuery)->count(),
            'sent' => (clone $baseLogsQuery)->where('status', 'sent')->count(),
            'failed' => (clone $baseLogsQuery)->where('status', 'failed')->count(),
            'skipped' => (clone $baseLogsQuery)->where('status', 'skipped')->count(),
            'filtered_total' => (clone $filteredLogsQuery)->count(),
        ];

        $logs = $filteredLogsQuery
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(function ($log) {
                return [
                    'id' => $log->id,
                    'event_reminder_id' => $log->event_reminder_id,
                    'event_id' => $log->event_id,
                    'recipient_email' => $log->recipient_email,
                    'recipient_type' => $log->recipient_type,
                    'status' => $log->status,
                    'error_message' => $log->error_message,
                    'sent_at' => optional($log->sent_at)->format('Y-m-d H:i'),
                    'created_at' => optional($log->created_at)->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('EventReminders/Logs', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'status' => $event->status,
            ],

            'reminder' => [
                'id' => $reminder->id,
                'title' => $reminder->title,
                'message' => $reminder->message,
                'reminder_type' => $reminder->reminder_type,
                'remind_at' => optional($reminder->remind_at)->format('Y-m-d H:i'),
                'status' => $reminder->status,
                'sent_at' => optional($reminder->sent_at)->format('Y-m-d H:i'),

                'task' => $reminder->task ? [
                    'id' => $reminder->task->id,
                    'title' => $reminder->task->title,
                ] : null,

                'schedule' => $reminder->schedule ? [
                    'id' => $reminder->schedule->id,
                    'title' => $reminder->schedule->title,
                    'schedule_date' => $reminder->schedule->schedule_date,
                    'start_time' => $reminder->schedule->start_time,
                ] : null,

                'staff' => $reminder->staff ? [
                    'id' => $reminder->staff->id,
                    'name' => $reminder->staff->name,
                    'role' => $reminder->staff->role,
                    'email' => $reminder->staff->email,
                ] : null,
            ],

            'logs' => $logs,
            'logSummary' => $logSummary,

            'filters' => [
                'status' => $status,
                'recipient_type' => $recipientType,
                'search' => $search,
            ],

            'filterOptions' => [
                'statuses' => [
                    '' => 'All Statuses',
                    'sent' => 'Sent',
                    'failed' => 'Failed',
                    'skipped' => 'Skipped',
                ],
                'recipientTypes' => [
                    '' => 'All Recipients',
                    'organizer' => 'Organizer',
                    'staff' => 'Staff',
                    'none' => 'No Recipient',
                    'unknown' => 'Unknown',
                ],
            ],
        ]);
    }

    public function exportLogs(Request $request, Event $event, EventReminder $reminder): StreamedResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureReminderBelongsToEvent($event, $reminder);

        $status = $request->input('status');
        $recipientType = $request->input('recipient_type');
        $search = $request->input('search');

        $logs = $reminder->logs()
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($recipientType, function ($query) use ($recipientType) {
                $query->where('recipient_type', $recipientType);
            })
            ->when($search, function ($query) use ($search) {
                $query->where('recipient_email', 'like', '%' . $search . '%');
            })
            ->latest()
            ->get();

        $fileName = 'reminder-logs-event-' . $event->id . '-reminder-' . $reminder->id . '-' . now()->format('Ymd-His') . '.csv';

        return response()->streamDownload(function () use ($logs, $event, $reminder) {
            $handle = fopen('php://output', 'w');

            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'Event ID',
                'Event Title',
                'Reminder ID',
                'Reminder Title',
                'Reminder Type',
                'Reminder Status',
                'Reminder At',
                'Reminder Sent At',
                'Log ID',
                'Recipient Email',
                'Recipient Type',
                'Log Status',
                'Error Message',
                'Email Sent At',
                'Logged At',
            ]);

            foreach ($logs as $log) {
                fputcsv($handle, [
                    $event->id,
                    $event->title,
                    $reminder->id,
                    $reminder->title,
                    $this->formatReminderType($reminder->reminder_type),
                    $reminder->status,
                    optional($reminder->remind_at)->format('Y-m-d H:i:s'),
                    optional($reminder->sent_at)->format('Y-m-d H:i:s'),
                    $log->id,
                    $log->recipient_email ?: '-',
                    $this->formatRecipientType($log->recipient_type),
                    $log->status,
                    $log->error_message ?: '-',
                    optional($log->sent_at)->format('Y-m-d H:i:s'),
                    optional($log->created_at)->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function eventLogs(Request $request, Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $status = $request->input('status');
        $recipientType = $request->input('recipient_type');
        $recipientSearch = $request->input('recipient_search');
        $reminderSearch = $request->input('reminder_search');

        $baseLogsQuery = EventReminderLog::query()
            ->where('event_id', $event->id);

        $filteredLogsQuery = EventReminderLog::query()
            ->with([
                'reminder:id,event_id,title,reminder_type,status,remind_at,sent_at',
            ])
            ->where('event_id', $event->id)
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($recipientType, function ($query) use ($recipientType) {
                $query->where('recipient_type', $recipientType);
            })
            ->when($recipientSearch, function ($query) use ($recipientSearch) {
                $query->where('recipient_email', 'like', '%' . $recipientSearch . '%');
            })
            ->when($reminderSearch, function ($query) use ($reminderSearch) {
                $query->whereHas('reminder', function ($reminderQuery) use ($reminderSearch) {
                    $reminderQuery->where('title', 'like', '%' . $reminderSearch . '%');
                });
            });

        $summary = [
            'total' => (clone $baseLogsQuery)->count(),
            'sent' => (clone $baseLogsQuery)->where('status', 'sent')->count(),
            'failed' => (clone $baseLogsQuery)->where('status', 'failed')->count(),
            'skipped' => (clone $baseLogsQuery)->where('status', 'skipped')->count(),
            'filtered_total' => (clone $filteredLogsQuery)->count(),
        ];

        $logs = $filteredLogsQuery
            ->latest()
            ->paginate(25)
            ->withQueryString()
            ->through(function (EventReminderLog $log) {
                return [
                    'id' => $log->id,
                    'event_reminder_id' => $log->event_reminder_id,
                    'event_id' => $log->event_id,
                    'recipient_email' => $log->recipient_email,
                    'recipient_type' => $log->recipient_type,
                    'status' => $log->status,
                    'error_message' => $log->error_message,
                    'sent_at' => optional($log->sent_at)->format('Y-m-d H:i'),
                    'created_at' => optional($log->created_at)->format('Y-m-d H:i'),

                    'reminder' => $log->reminder ? [
                        'id' => $log->reminder->id,
                        'title' => $log->reminder->title,
                        'reminder_type' => $log->reminder->reminder_type,
                        'reminder_type_label' => $this->formatReminderType($log->reminder->reminder_type),
                        'status' => $log->reminder->status,
                        'remind_at' => optional($log->reminder->remind_at)->format('Y-m-d H:i'),
                        'sent_at' => optional($log->reminder->sent_at)->format('Y-m-d H:i'),
                    ] : null,
                ];
            });

        return Inertia::render('EventReminders/EventLogs', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'status' => $event->status,
            ],

            'logs' => $logs,
            'summary' => $summary,

            'filters' => [
                'status' => $status,
                'recipient_type' => $recipientType,
                'recipient_search' => $recipientSearch,
                'reminder_search' => $reminderSearch,
            ],

            'filterOptions' => [
                'statuses' => [
                    '' => 'All Statuses',
                    'sent' => 'Sent',
                    'failed' => 'Failed',
                    'skipped' => 'Skipped',
                ],
                'recipientTypes' => [
                    '' => 'All Recipients',
                    'organizer' => 'Organizer',
                    'staff' => 'Staff',
                    'none' => 'No Recipient',
                    'unknown' => 'Unknown',
                ],
            ],
        ]);
    }

    public function exportEventLogs(Request $request, Event $event): StreamedResponse
    {
        $this->authorizeEventAccess($event);

        $status = $request->input('status');
        $recipientType = $request->input('recipient_type');
        $recipientSearch = $request->input('recipient_search');
        $reminderSearch = $request->input('reminder_search');

        $logs = EventReminderLog::query()
            ->with([
                'reminder:id,event_id,title,reminder_type,status,remind_at,sent_at',
            ])
            ->where('event_id', $event->id)
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($recipientType, function ($query) use ($recipientType) {
                $query->where('recipient_type', $recipientType);
            })
            ->when($recipientSearch, function ($query) use ($recipientSearch) {
                $query->where('recipient_email', 'like', '%' . $recipientSearch . '%');
            })
            ->when($reminderSearch, function ($query) use ($reminderSearch) {
                $query->whereHas('reminder', function ($reminderQuery) use ($reminderSearch) {
                    $reminderQuery->where('title', 'like', '%' . $reminderSearch . '%');
                });
            })
            ->latest()
            ->get();

        $fileName = 'event-reminder-logs-event-' . $event->id . '-' . now()->format('Ymd-His') . '.csv';

        return response()->streamDownload(function () use ($logs, $event) {
            $handle = fopen('php://output', 'w');

            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'Event ID',
                'Event Title',
                'Event Date',
                'Event Time',
                'Venue',
                'Reminder ID',
                'Reminder Title',
                'Reminder Type',
                'Reminder Status',
                'Reminder At',
                'Reminder Sent At',
                'Log ID',
                'Recipient Email',
                'Recipient Type',
                'Log Status',
                'Error Message',
                'Email Sent At',
                'Logged At',
            ]);

            foreach ($logs as $log) {
                fputcsv($handle, [
                    $event->id,
                    $event->title,
                    $event->event_date,
                    $event->event_time,
                    $event->venue,
                    $log->reminder?->id ?? '-',
                    $log->reminder?->title ?? '-',
                    $this->formatReminderType($log->reminder?->reminder_type),
                    $log->reminder?->status ?? '-',
                    optional($log->reminder?->remind_at)->format('Y-m-d H:i:s'),
                    optional($log->reminder?->sent_at)->format('Y-m-d H:i:s'),
                    $log->id,
                    $log->recipient_email ?: '-',
                    $this->formatRecipientType($log->recipient_type),
                    $log->status,
                    $log->error_message ?: '-',
                    optional($log->sent_at)->format('Y-m-d H:i:s'),
                    optional($log->created_at)->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function markLogReviewed(Event $event, EventReminderLog $log): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ((int) $log->event_id !== (int) $event->id) {
            abort(404);
        }

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        if ($log->status !== 'failed') {
            return back()->with('error', 'Only failed reminder logs can be marked as reviewed.');
        }

        if ($log->reviewed_at) {
            return back()->with('success', 'This failed email log is already reviewed.');
        }

        $log->update([
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        return back()->with('success', 'Failed email log marked as reviewed.');
    }

    public function markSent(Event $event, EventReminder $reminder): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureReminderBelongsToEvent($event, $reminder);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $reminder->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        return redirect()
            ->route('events.reminders.index', $event->id)
            ->with('success', 'Reminder marked as sent.');
    }

    public function retryFailedLogs(Event $event, EventReminder $reminder): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureReminderBelongsToEvent($event, $reminder);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $reminder->load([
            'event:id,user_id,title,event_date,event_time,venue',
            'event.user:id,name,email',
            'task:id,event_id,title',
            'schedule:id,event_id,title,schedule_date,start_time',
            'staff:id,event_id,name,email,phone,role',
        ]);

        $failedLogs = $reminder->logs()
            ->where('status', 'failed')
            ->whereNotNull('recipient_email')
            ->latest()
            ->get();

        if ($failedLogs->isEmpty()) {
            return redirect()
                ->route('events.reminders.logs', [$event->id, $reminder->id])
                ->with('success', 'No failed email logs found to retry.');
        }

        $uniqueRecipients = $failedLogs
            ->map(function ($log) {
                return [
                    'email' => $log->recipient_email,
                    'type' => $log->recipient_type ?: 'unknown',
                ];
            })
            ->filter(fn ($recipient) => ! empty($recipient['email']))
            ->unique('email')
            ->values();

        $sentCount = 0;
        $failedCount = 0;

        foreach ($uniqueRecipients as $recipient) {
            try {
                Mail::to($recipient['email'])->send(new EventReminderDueMail($reminder));

                EventReminderLog::create([
                    'event_reminder_id' => $reminder->id,
                    'event_id' => $event->id,
                    'recipient_email' => $recipient['email'],
                    'recipient_type' => $recipient['type'],
                    'status' => 'sent',
                    'error_message' => null,
                    'sent_at' => now(),
                ]);

                $sentCount++;
            } catch (Throwable $e) {
                EventReminderLog::create([
                    'event_reminder_id' => $reminder->id,
                    'event_id' => $event->id,
                    'recipient_email' => $recipient['email'],
                    'recipient_type' => $recipient['type'],
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                    'sent_at' => null,
                ]);

                $failedCount++;

                report($e);
            }
        }

        if ($sentCount > 0) {
            $reminder->update([
                'status' => 'sent',
                'sent_at' => $reminder->sent_at ?? now(),
            ]);
        }

        $message = "Retry completed. Sent: {$sentCount}. Failed: {$failedCount}.";

        return redirect()
            ->route('events.reminders.logs', [$event->id, $reminder->id])
            ->with('success', $message);
    }

    public function cancel(Event $event, EventReminder $reminder): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureReminderBelongsToEvent($event, $reminder);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $reminder->update([
            'status' => 'cancelled',
            'sent_at' => null,
        ]);

        return redirect()
            ->route('events.reminders.index', $event->id)
            ->with('success', 'Reminder cancelled successfully.');
    }

    public function destroy(Event $event, EventReminder $reminder): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureReminderBelongsToEvent($event, $reminder);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $reminder->delete();

        return redirect()
            ->route('events.reminders.index', $event->id)
            ->with('success', 'Reminder deleted successfully.');
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
                ->route('events.reminders.index', $event)
                ->with('error', 'This event is closed and reminders cannot be modified.');
        }

        return null;
    }

    private function ensureReminderBelongsToEvent(Event $event, EventReminder $reminder): void
    {
        if ((int) $reminder->event_id !== (int) $event->id) {
            abort(404);
        }
    }

    private function ensureRelatedRecordsBelongToEvent(Event $event, array $data): void
    {
        if (! empty($data['task_id'])) {
            $exists = EventTask::query()
                ->where('id', $data['task_id'])
                ->where('event_id', $event->id)
                ->exists();

            if (! $exists) {
                abort(404);
            }
        }

        if (! empty($data['schedule_id'])) {
            $exists = EventSchedule::query()
                ->where('id', $data['schedule_id'])
                ->where('event_id', $event->id)
                ->exists();

            if (! $exists) {
                abort(404);
            }
        }

        if (! empty($data['staff_id'])) {
            $exists = EventStaff::query()
                ->where('id', $data['staff_id'])
                ->where('event_id', $event->id)
                ->exists();

            if (! $exists) {
                abort(404);
            }
        }
    }

    private function getTasks(Event $event)
    {
        return EventTask::query()
            ->where('event_id', $event->id)
            ->orderBy('title')
            ->get(['id', 'title', 'status']);
    }

    private function getSchedules(Event $event)
    {
        return EventSchedule::query()
            ->where('event_id', $event->id)
            ->orderBy('schedule_date')
            ->orderBy('start_time')
            ->get(['id', 'title', 'schedule_date', 'start_time', 'status']);
    }

    private function getStaff(Event $event)
    {
        return EventStaff::query()
            ->where('event_id', $event->id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'role']);
    }

    private function formatReminderType(?string $type): string
    {
        return match ($type) {
            'general' => 'General',
            'task' => 'Task',
            'schedule' => 'Schedule',
            'payment' => 'Payment',
            'guest_followup' => 'Guest Follow-up',
            'vendor' => 'Vendor',
            default => ucfirst((string) $type),
        };
    }

    private function formatRecipientType(?string $type): string
    {
        return match ($type) {
            'organizer' => 'Organizer',
            'staff' => 'Staff',
            'none' => 'No Recipient',
            'unknown' => 'Unknown',
            default => $type ? ucfirst((string) $type) : '-',
        };
    }
}
