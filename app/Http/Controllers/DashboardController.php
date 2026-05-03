<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventGuest;
use App\Models\EventReminder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | Event Access Rule
        |--------------------------------------------------------------------------
        | Super Admin sees all events.
        | Organizer sees only their own events.
        */
        $eventQuery = Event::query();

        if (!$user->hasRole('Super Admin')) {
            $eventQuery->where('user_id', $user->id);
        }

        $eventIds = (clone $eventQuery)->pluck('id');

        /*
        |--------------------------------------------------------------------------
        | Event / Guest Summary
        |--------------------------------------------------------------------------
        */
        $totalEvents = (clone $eventQuery)->count();

        $totalGuests = EventGuest::query()
            ->whereIn('event_id', $eventIds)
            ->count();

        $accepted = EventGuest::query()
            ->whereIn('event_id', $eventIds)
            ->where('status', 'accepted')
            ->count();

        $declined = EventGuest::query()
            ->whereIn('event_id', $eventIds)
            ->where('status', 'declined')
            ->count();

        $pending = EventGuest::query()
            ->whereIn('event_id', $eventIds)
            ->where(function ($query) {
                $query->where('status', 'pending')
                    ->orWhereNull('status');
            })
            ->count();

        $extraGuests = EventGuest::query()
            ->whereIn('event_id', $eventIds)
            ->sum('guest_count');

        /*
        |--------------------------------------------------------------------------
        | Reminder Summary
        |--------------------------------------------------------------------------
        */
        $pendingReminderCount = EventReminder::query()
            ->whereIn('event_id', $eventIds)
            ->where('status', 'pending')
            ->count();

        $upcomingReminderCount = EventReminder::query()
            ->whereIn('event_id', $eventIds)
            ->where('status', 'pending')
            ->where('remind_at', '>=', now())
            ->count();

        $sentReminderCount = EventReminder::query()
            ->whereIn('event_id', $eventIds)
            ->where('status', 'sent')
            ->count();

        $cancelledReminderCount = EventReminder::query()
            ->whereIn('event_id', $eventIds)
            ->where('status', 'cancelled')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Recent Events
        |--------------------------------------------------------------------------
        */
        $recentEvents = Event::query()
            ->withCount([
                'guests',
                'invitations',
                'questions',
            ])
            ->whereIn('id', $eventIds)
            ->latest()
            ->limit(5)
            ->get([
                'id',
                'title',
                'event_date',
                'event_time',
                'venue',
                'event_type',
                'created_at',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Upcoming Pending Reminders
        |--------------------------------------------------------------------------
        */
        $upcomingReminders = EventReminder::query()
            ->with([
                'event:id,title,event_date,event_time,venue,user_id',
                'task:id,event_id,title',
                'schedule:id,event_id,title,schedule_date,start_time',
                'staff:id,event_id,name,role',
            ])
            ->whereIn('event_id', $eventIds)
            ->where('status', 'pending')
            ->where('remind_at', '>=', now())
            ->orderBy('remind_at')
            ->limit(10)
            ->get()
            ->map(function (EventReminder $reminder) {
                return [
                    'id' => $reminder->id,
                    'event_id' => $reminder->event_id,
                    'title' => $reminder->title,
                    'message' => $reminder->message,
                    'reminder_type' => $reminder->reminder_type,
                    'reminder_type_label' => $this->formatReminderType($reminder->reminder_type),
                    'remind_at' => optional($reminder->remind_at)->format('Y-m-d H:i'),
                    'status' => $reminder->status,

                    'event' => $reminder->event ? [
                        'id' => $reminder->event->id,
                        'title' => $reminder->event->title,
                        'event_date' => $reminder->event->event_date,
                        'event_time' => $reminder->event->event_time,
                        'venue' => $reminder->event->venue,
                    ] : null,

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
                    ] : null,
                ];
            });

        return Inertia::render('Dashboard', [
            'summary' => [
                'total_events' => $totalEvents,
                'total_guests' => $totalGuests,
                'accepted' => $accepted,
                'declined' => $declined,
                'pending' => $pending,
                'extra_guests' => $extraGuests,

                'pending_reminders' => $pendingReminderCount,
                'upcoming_reminders' => $upcomingReminderCount,
                'sent_reminders' => $sentReminderCount,
                'cancelled_reminders' => $cancelledReminderCount,
            ],

            'recentEvents' => $recentEvents,
            'upcomingReminders' => $upcomingReminders,
        ]);
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
}
