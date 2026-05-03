<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventReminder;
use App\Models\EventReminderLog;
use App\Services\EventActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationCenterController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | Event Access Rule
        |--------------------------------------------------------------------------
        | Super Admin sees everything.
        | Organizer sees only own event data.
        */
        $eventQuery = Event::query();

        if (! $user->hasRole('Super Admin')) {
            $eventQuery->where('user_id', $user->id);
        }

        $eventIds = (clone $eventQuery)->pluck('id');

        /*
        |--------------------------------------------------------------------------
        | Filters
        |--------------------------------------------------------------------------
        */
        $eventId = $request->input('event_id');
        $type = $request->input('type');

        if ($eventId && ! $eventIds->contains((int) $eventId)) {
            abort(403);
        }

        $allowedTypes = [
            null,
            '',
            'upcoming_reminders',
            'overdue_reminders',
            'failed_emails',
            'sent_emails',
            'cancelled_reminders',
        ];

        if (! in_array($type, $allowedTypes, true)) {
            $type = '';
        }

        /*
        |--------------------------------------------------------------------------
        | Event dropdown options
        |--------------------------------------------------------------------------
        */
        $events = Event::query()
            ->whereIn('id', $eventIds)
            ->orderBy('event_date')
            ->orderBy('title')
            ->get(['id', 'title', 'event_date'])
            ->map(function (Event $event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'event_date' => $event->event_date,
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | Summary Counts
        |--------------------------------------------------------------------------
        */
        $upcomingReminderCount = EventReminder::query()
            ->whereIn('event_id', $eventIds)
            ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
            ->where('status', 'pending')
            ->where('remind_at', '>=', now())
            ->count();

        $overdueReminderCount = EventReminder::query()
            ->whereIn('event_id', $eventIds)
            ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
            ->where('status', 'pending')
            ->where('remind_at', '<', now())
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Important:
        | Failed emails should only count as alerts while unreviewed.
        |--------------------------------------------------------------------------
        */
        $failedEmailCount = EventReminderLog::query()
            ->whereIn('event_id', $eventIds)
            ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
            ->where('status', 'failed')
            ->whereNull('reviewed_at')
            ->count();

        $sentEmailCount = EventReminderLog::query()
            ->whereIn('event_id', $eventIds)
            ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
            ->where('status', 'sent')
            ->count();

        $cancelledReminderCount = EventReminder::query()
            ->whereIn('event_id', $eventIds)
            ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
            ->where('status', 'cancelled')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Notification Items
        |--------------------------------------------------------------------------
        */
        $items = collect();

        if (! $type || $type === 'upcoming_reminders') {
            $upcomingReminders = EventReminder::query()
                ->with([
                    'event:id,title,event_date,event_time,venue',
                    'staff:id,event_id,name,role,email',
                    'task:id,event_id,title',
                    'schedule:id,event_id,title,schedule_date,start_time',
                ])
                ->whereIn('event_id', $eventIds)
                ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
                ->where('status', 'pending')
                ->where('remind_at', '>=', now())
                ->orderBy('remind_at')
                ->limit(20)
                ->get()
                ->map(function (EventReminder $reminder) {
                    return [
                        'id' => 'upcoming-reminder-' . $reminder->id,
                        'record_id' => $reminder->id,
                        'log_id' => null,
                        'event_id' => $reminder->event_id,
                        'event_title' => $reminder->event?->title ?? '-',
                        'title' => $reminder->title,
                        'message' => $reminder->message,
                        'type' => 'upcoming_reminders',
                        'type_label' => 'Upcoming Reminder',
                        'status' => $reminder->status,
                        'severity' => 'info',
                        'reminder_type' => $reminder->reminder_type,
                        'reminder_type_label' => $this->formatReminderType($reminder->reminder_type),
                        'recipient_email' => $reminder->staff?->email,
                        'recipient_type' => $reminder->staff ? 'staff' : null,
                        'staff_name' => $reminder->staff?->name,
                        'related_to' => $this->getRelatedTo($reminder),
                        'date_time' => optional($reminder->remind_at)->format('Y-m-d H:i'),
                        'created_at' => optional($reminder->created_at)->format('Y-m-d H:i'),
                        'reviewed_at' => null,
                        'reviewed_by' => null,
                        'reviewer_name' => null,
                    ];
                });

            $items = $items->merge($upcomingReminders);
        }

        if (! $type || $type === 'overdue_reminders') {
            $overdueReminders = EventReminder::query()
                ->with([
                    'event:id,title,event_date,event_time,venue',
                    'staff:id,event_id,name,role,email',
                    'task:id,event_id,title',
                    'schedule:id,event_id,title,schedule_date,start_time',
                ])
                ->whereIn('event_id', $eventIds)
                ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
                ->where('status', 'pending')
                ->where('remind_at', '<', now())
                ->orderBy('remind_at')
                ->limit(20)
                ->get()
                ->map(function (EventReminder $reminder) {
                    return [
                        'id' => 'overdue-reminder-' . $reminder->id,
                        'record_id' => $reminder->id,
                        'log_id' => null,
                        'event_id' => $reminder->event_id,
                        'event_title' => $reminder->event?->title ?? '-',
                        'title' => $reminder->title,
                        'message' => $reminder->message,
                        'type' => 'overdue_reminders',
                        'type_label' => 'Overdue Reminder',
                        'status' => $reminder->status,
                        'severity' => 'danger',
                        'reminder_type' => $reminder->reminder_type,
                        'reminder_type_label' => $this->formatReminderType($reminder->reminder_type),
                        'recipient_email' => $reminder->staff?->email,
                        'recipient_type' => $reminder->staff ? 'staff' : null,
                        'staff_name' => $reminder->staff?->name,
                        'related_to' => $this->getRelatedTo($reminder),
                        'date_time' => optional($reminder->remind_at)->format('Y-m-d H:i'),
                        'created_at' => optional($reminder->created_at)->format('Y-m-d H:i'),
                        'reviewed_at' => null,
                        'reviewed_by' => null,
                        'reviewer_name' => null,
                    ];
                });

            $items = $items->merge($overdueReminders);
        }

        if (! $type || $type === 'failed_emails') {
            $failedEmails = EventReminderLog::query()
                ->with([
                    'event:id,title,event_date,event_time,venue',
                    'reminder:id,event_id,title,message,reminder_type,status,remind_at,sent_at',
                    'reviewer:id,name',
                ])
                ->whereIn('event_id', $eventIds)
                ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
                ->where('status', 'failed')
                ->whereNull('reviewed_at')
                ->latest()
                ->limit(20)
                ->get()
                ->map(function (EventReminderLog $log) {
                    return [
                        'id' => 'failed-email-' . $log->id,
                        'record_id' => $log->event_reminder_id,
                        'log_id' => $log->id,
                        'event_id' => $log->event_id,
                        'event_title' => $log->event?->title ?? '-',
                        'title' => $log->reminder?->title ?? 'Reminder email failed',
                        'message' => $log->error_message,
                        'type' => 'failed_emails',
                        'type_label' => 'Failed Email',
                        'status' => $log->status,
                        'severity' => 'danger',
                        'reminder_type' => $log->reminder?->reminder_type,
                        'reminder_type_label' => $this->formatReminderType($log->reminder?->reminder_type),
                        'recipient_email' => $log->recipient_email,
                        'recipient_type' => $log->recipient_type,
                        'staff_name' => null,
                        'related_to' => 'Email delivery failed',
                        'date_time' => optional($log->created_at)->format('Y-m-d H:i'),
                        'created_at' => optional($log->created_at)->format('Y-m-d H:i'),
                        'reviewed_at' => optional($log->reviewed_at)->format('Y-m-d H:i'),
                        'reviewed_by' => $log->reviewed_by,
                        'reviewer_name' => $log->reviewer?->name,
                    ];
                });

            $items = $items->merge($failedEmails);
        }

        if (! $type || $type === 'sent_emails') {
            $sentEmails = EventReminderLog::query()
                ->with([
                    'event:id,title,event_date,event_time,venue',
                    'reminder:id,event_id,title,message,reminder_type,status,remind_at,sent_at',
                    'reviewer:id,name',
                ])
                ->whereIn('event_id', $eventIds)
                ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
                ->where('status', 'sent')
                ->latest()
                ->limit(20)
                ->get()
                ->map(function (EventReminderLog $log) {
                    return [
                        'id' => 'sent-email-' . $log->id,
                        'record_id' => $log->event_reminder_id,
                        'log_id' => $log->id,
                        'event_id' => $log->event_id,
                        'event_title' => $log->event?->title ?? '-',
                        'title' => $log->reminder?->title ?? 'Reminder email sent',
                        'message' => null,
                        'type' => 'sent_emails',
                        'type_label' => 'Sent Email',
                        'status' => $log->status,
                        'severity' => 'success',
                        'reminder_type' => $log->reminder?->reminder_type,
                        'reminder_type_label' => $this->formatReminderType($log->reminder?->reminder_type),
                        'recipient_email' => $log->recipient_email,
                        'recipient_type' => $log->recipient_type,
                        'staff_name' => null,
                        'related_to' => 'Email sent successfully',
                        'date_time' => optional($log->sent_at ?? $log->created_at)->format('Y-m-d H:i'),
                        'created_at' => optional($log->created_at)->format('Y-m-d H:i'),
                        'reviewed_at' => optional($log->reviewed_at)->format('Y-m-d H:i'),
                        'reviewed_by' => $log->reviewed_by,
                        'reviewer_name' => $log->reviewer?->name,
                    ];
                });

            $items = $items->merge($sentEmails);
        }

        if (! $type || $type === 'cancelled_reminders') {
            $cancelledReminders = EventReminder::query()
                ->with([
                    'event:id,title,event_date,event_time,venue',
                    'staff:id,event_id,name,role,email',
                    'task:id,event_id,title',
                    'schedule:id,event_id,title,schedule_date,start_time',
                ])
                ->whereIn('event_id', $eventIds)
                ->when($eventId, fn ($query) => $query->where('event_id', $eventId))
                ->where('status', 'cancelled')
                ->latest()
                ->limit(20)
                ->get()
                ->map(function (EventReminder $reminder) {
                    return [
                        'id' => 'cancelled-reminder-' . $reminder->id,
                        'record_id' => $reminder->id,
                        'log_id' => null,
                        'event_id' => $reminder->event_id,
                        'event_title' => $reminder->event?->title ?? '-',
                        'title' => $reminder->title,
                        'message' => $reminder->message,
                        'type' => 'cancelled_reminders',
                        'type_label' => 'Cancelled Reminder',
                        'status' => $reminder->status,
                        'severity' => 'warning',
                        'reminder_type' => $reminder->reminder_type,
                        'reminder_type_label' => $this->formatReminderType($reminder->reminder_type),
                        'recipient_email' => $reminder->staff?->email,
                        'recipient_type' => $reminder->staff ? 'staff' : null,
                        'staff_name' => $reminder->staff?->name,
                        'related_to' => $this->getRelatedTo($reminder),
                        'date_time' => optional($reminder->updated_at)->format('Y-m-d H:i'),
                        'created_at' => optional($reminder->created_at)->format('Y-m-d H:i'),
                        'reviewed_at' => null,
                        'reviewed_by' => null,
                        'reviewer_name' => null,
                    ];
                });

            $items = $items->merge($cancelledReminders);
        }

        $items = $items
            ->sortByDesc('date_time')
            ->values();

        return Inertia::render('NotificationCenter/Index', [
            'summary' => [
                'upcoming_reminders' => $upcomingReminderCount,
                'overdue_reminders' => $overdueReminderCount,
                'failed_emails' => $failedEmailCount,
                'sent_emails' => $sentEmailCount,
                'cancelled_reminders' => $cancelledReminderCount,
                'total_alerts' => $upcomingReminderCount
                    + $overdueReminderCount
                    + $failedEmailCount
                    + $cancelledReminderCount,
            ],

            'items' => $items,

            'events' => $events,

            'filters' => [
                'event_id' => $eventId,
                'type' => $type,
            ],

            'filterOptions' => [
                'types' => [
                    '' => 'All Notifications',
                    'upcoming_reminders' => 'Upcoming Reminders',
                    'overdue_reminders' => 'Overdue Reminders',
                    'failed_emails' => 'Failed Emails',
                    'sent_emails' => 'Sent Emails',
                    'cancelled_reminders' => 'Cancelled Reminders',
                ],
            ],
        ]);
    }

    public function markLogReviewed(Event $event, EventReminderLog $log): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ((int) $log->event_id !== (int) $event->id) {
            abort(404);
        }

        if ($log->status !== 'failed') {
            return back()->with('error', 'Only failed email logs can be marked as reviewed.');
        }

        if ($log->reviewed_at) {
            return back()->with('success', 'This failed email log is already reviewed.');
        }

        $log->update([
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        $log->refresh();

        EventActivityLogger::record(
            event: $event,
            action: 'reminder_reviewed',
            description: 'Failed reminder email log marked as reviewed.',
            subject: $log,
            properties: [
                'reminder_log_id' => $log->id,
                'event_reminder_id' => $log->event_reminder_id,
                'status' => $log->status,
                'recipient_email' => $log->recipient_email,
                'recipient_type' => $log->recipient_type,
                'error_message' => $log->error_message,
                'reviewed_at' => optional($log->reviewed_at)->format('Y-m-d H:i:s'),
                'reviewed_by' => $log->reviewed_by,
            ]
        );

        return back()->with('success', 'Failed email log marked as reviewed.');
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

    private function getRelatedTo(EventReminder $reminder): string
    {
        if ($reminder->task) {
            return 'Task: ' . $reminder->task->title;
        }

        if ($reminder->schedule) {
            return 'Schedule: ' . $reminder->schedule->title;
        }

        return '-';
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
            default => $type ? ucfirst((string) $type) : '-',
        };
    }
}
