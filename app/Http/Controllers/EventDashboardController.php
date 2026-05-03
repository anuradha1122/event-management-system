<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventActivityLog;
use App\Models\EventExpense;
use App\Models\EventGuest;
use App\Models\EventReminder;
use App\Models\EventReminderLog;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;


class EventDashboardController extends Controller
{
    public function show(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $guestSummary = $this->buildGuestSummary($event);
        $invitationSummary = $this->buildInvitationSummary($event);
        $checkInSummary = $this->buildCheckInSummary($event);
        $followUpSummary = $this->buildFollowUpSummary($event);
        $reminderSummary = $this->buildReminderSummary($event);
        $expenseSummary = $this->buildExpenseSummary($event);
        $recentActivities = $this->buildRecentActivities($event);

        return Inertia::render('EventDashboard/Show', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'event_date' => $event->event_date,
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'event_type' => $event->event_type ?? null,
                'theme_color' => $event->theme_color ?? null,
            ],

            'guestSummary' => $guestSummary,
            'invitationSummary' => $invitationSummary,
            'checkInSummary' => $checkInSummary,
            'followUpSummary' => $followUpSummary,
            'reminderSummary' => $reminderSummary,
            'expenseSummary' => $expenseSummary,
            'recentActivities' => $recentActivities,

            'charts' => [
                'rsvp' => $this->buildRsvpChart($guestSummary),
                'response' => $this->buildResponseChart($invitationSummary),
                'checkIn' => $this->buildCheckInChart($checkInSummary),
                'followUp' => $this->buildFollowUpChart($followUpSummary),
                'reminders' => $this->buildReminderChart($reminderSummary),
                'expenses' => $expenseSummary['category_breakdown'],
            ],
        ]);
    }

    private function buildGuestSummary(Event $event): array
    {
        $total = EventGuest::query()
            ->where('event_id', $event->id)
            ->count();

        $accepted = EventGuest::query()
            ->where('event_id', $event->id)
            ->where('status', 'accepted')
            ->count();

        $declined = EventGuest::query()
            ->where('event_id', $event->id)
            ->where('status', 'declined')
            ->count();

        $pending = EventGuest::query()
            ->where('event_id', $event->id)
            ->where(function ($query) {
                $query->whereNull('status')
                    ->orWhere('status', 'pending');
            })
            ->count();

        $totalGuestCount = EventGuest::query()
            ->where('event_id', $event->id)
            ->sum('guest_count');

        $acceptedGuestCount = EventGuest::query()
            ->where('event_id', $event->id)
            ->where('status', 'accepted')
            ->sum('guest_count');

        return [
            'total' => $total,
            'accepted' => $accepted,
            'declined' => $declined,
            'pending' => $pending,
            'total_guest_count' => $totalGuestCount,
            'accepted_guest_count' => $acceptedGuestCount,
            'acceptance_rate' => $total > 0 ? round(($accepted / $total) * 100, 2) : 0,
            'decline_rate' => $total > 0 ? round(($declined / $total) * 100, 2) : 0,
            'pending_rate' => $total > 0 ? round(($pending / $total) * 100, 2) : 0,
        ];
    }

    private function buildInvitationSummary(Event $event): array
    {
        $totalInvitations = $event->invitations()->count();

        $sent = $event->invitations()
            ->whereNotNull('sent_at')
            ->count();

        $responded = $event->invitations()
            ->whereNotNull('responded_at')
            ->count();

        $notResponded = $totalInvitations - $responded;

        return [
            'total' => $totalInvitations,
            'sent' => $sent,
            'not_sent' => max($totalInvitations - $sent, 0),
            'responded' => $responded,
            'not_responded' => max($notResponded, 0),
            'response_rate' => $totalInvitations > 0 ? round(($responded / $totalInvitations) * 100, 2) : 0,
            'sent_rate' => $totalInvitations > 0 ? round(($sent / $totalInvitations) * 100, 2) : 0,
        ];
    }

    private function buildCheckInSummary(Event $event): array
    {
        $totalGuests = EventGuest::query()
            ->where('event_id', $event->id)
            ->count();

        $checkedIn = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereNotNull('checked_in_at')
            ->count();

        $notArrived = $totalGuests - $checkedIn;

        $expectedPeople = EventGuest::query()
            ->where('event_id', $event->id)
            ->where('status', 'accepted')
            ->sum('guest_count');

        $arrivedPeople = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereNotNull('checked_in_at')
            ->sum('guest_count');

        return [
            'checked_in' => $checkedIn,
            'not_arrived' => max($notArrived, 0),
            'expected_people' => $expectedPeople,
            'arrived_people' => $arrivedPeople,
            'guest_check_in_rate' => $totalGuests > 0 ? round(($checkedIn / $totalGuests) * 100, 2) : 0,
            'people_attendance_rate' => $expectedPeople > 0 ? round(($arrivedPeople / $expectedPeople) * 100, 2) : 0,
        ];
    }

    private function buildFollowUpSummary(Event $event): array
    {
        $totalGuests = EventGuest::query()
            ->where('event_id', $event->id)
            ->count();

        $followedUp = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereNotNull('followup_sent_at')
            ->count();

        $notFollowedUp = $totalGuests - $followedUp;

        $totalAttempts = EventGuest::query()
            ->where('event_id', $event->id)
            ->sum('followup_count');

        $multipleFollowUps = EventGuest::query()
            ->where('event_id', $event->id)
            ->where('followup_count', '>', 1)
            ->count();

        return [
            'followed_up' => $followedUp,
            'not_followed_up' => max($notFollowedUp, 0),
            'total_attempts' => $totalAttempts,
            'multiple_followups' => $multipleFollowUps,
            'followup_rate' => $totalGuests > 0 ? round(($followedUp / $totalGuests) * 100, 2) : 0,
        ];
    }

    private function buildReminderSummary(Event $event): array
    {
        if (! class_exists(EventReminder::class) || ! Schema::hasTable('event_reminders')) {
            return [
                'total' => 0,
                'pending' => 0,
                'sent' => 0,
                'failed' => 0,
                'cancelled' => 0,
                'reviewed_failed' => 0,
                'unreviewed_failed' => 0,
                'success_rate' => 0,
            ];
        }

        $total = EventReminder::query()
            ->where('event_id', $event->id)
            ->count();

        $pending = EventReminder::query()
            ->where('event_id', $event->id)
            ->where('status', 'pending')
            ->count();

        $cancelled = EventReminder::query()
            ->where('event_id', $event->id)
            ->where('status', 'cancelled')
            ->count();

        $sentLogs = Schema::hasTable('event_reminder_logs')
            ? EventReminderLog::query()
                ->where('event_id', $event->id)
                ->where('status', 'sent')
                ->count()
            : 0;

        $failedLogs = Schema::hasTable('event_reminder_logs')
            ? EventReminderLog::query()
                ->where('event_id', $event->id)
                ->where('status', 'failed')
                ->count()
            : 0;

        $reviewedFailed = Schema::hasTable('event_reminder_logs')
            ? EventReminderLog::query()
                ->where('event_id', $event->id)
                ->where('status', 'failed')
                ->whereNotNull('reviewed_at')
                ->count()
            : 0;

        $unreviewedFailed = Schema::hasTable('event_reminder_logs')
            ? EventReminderLog::query()
                ->where('event_id', $event->id)
                ->where('status', 'failed')
                ->whereNull('reviewed_at')
                ->count()
            : 0;

        $totalDeliveryLogs = $sentLogs + $failedLogs;

        return [
            'total' => $total,
            'pending' => $pending,
            'sent' => $sentLogs,
            'failed' => $failedLogs,
            'cancelled' => $cancelled,
            'reviewed_failed' => $reviewedFailed,
            'unreviewed_failed' => $unreviewedFailed,
            'success_rate' => $totalDeliveryLogs > 0 ? round(($sentLogs / $totalDeliveryLogs) * 100, 2) : 0,
        ];
    }

    private function buildExpenseSummary(Event $event): array
    {
        if (! Schema::hasTable('event_expenses')) {
            return [
                'total_amount' => 0,
                'paid_amount' => 0,
                'pending_amount' => 0,
                'expense_count' => 0,
                'category_breakdown' => [],
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Your event_expenses table does not have an "amount" column.
        | So we detect the real amount column safely.
        |--------------------------------------------------------------------------
        */
        $amountColumn = null;

        foreach (['amount', 'total_amount', 'cost', 'price', 'estimated_amount', 'actual_amount'] as $column) {
            if (Schema::hasColumn('event_expenses', $column)) {
                $amountColumn = $column;
                break;
            }
        }

        if (! $amountColumn) {
            return [
                'total_amount' => 0,
                'paid_amount' => 0,
                'pending_amount' => 0,
                'expense_count' => DB::table('event_expenses')
                    ->where('event_id', $event->id)
                    ->count(),
                'category_breakdown' => [],
            ];
        }

        $baseQuery = DB::table('event_expenses')
            ->where('event_id', $event->id);

        $totalAmount = (clone $baseQuery)->sum($amountColumn);

        $paidAmount = 0;

        if (Schema::hasColumn('event_expenses', 'status')) {
            $paidAmount = (clone $baseQuery)
                ->where('status', 'paid')
                ->sum($amountColumn);
        } elseif (Schema::hasColumn('event_expenses', 'payment_status')) {
            $paidAmount = (clone $baseQuery)
                ->where('payment_status', 'paid')
                ->sum($amountColumn);
        }

        $pendingAmount = max($totalAmount - $paidAmount, 0);

        $categoryBreakdown = collect();

        if (Schema::hasColumn('event_expenses', 'category')) {
            $categoryBreakdown = (clone $baseQuery)
                ->selectRaw('COALESCE(category, "Uncategorized") as category_name, SUM(' . $amountColumn . ') as total')
                ->groupBy('category_name')
                ->orderByDesc('total')
                ->get()
                ->map(fn ($row) => [
                    'label' => $row->category_name,
                    'value' => (float) $row->total,
                ])
                ->values();
        }

        return [
            'total_amount' => round((float) $totalAmount, 2),
            'paid_amount' => round((float) $paidAmount, 2),
            'pending_amount' => round((float) $pendingAmount, 2),
            'expense_count' => (clone $baseQuery)->count(),
            'category_breakdown' => $categoryBreakdown,
        ];
    }

    private function buildRecentActivities(Event $event): array
    {
        if (! class_exists(EventActivityLog::class) || ! Schema::hasTable('event_activity_logs')) {
            return [];
        }

        return EventActivityLog::query()
            ->with('user:id,name')
            ->where('event_id', $event->id)
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (EventActivityLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'action_label' => str($log->action)->replace('_', ' ')->title()->toString(),
                'description' => $log->description,
                'user_name' => $log->user?->name ?? 'Guest/System',
                'created_at' => optional($log->created_at)->format('Y-m-d H:i'),
                'created_at_human' => optional($log->created_at)->diffForHumans(),
            ])
            ->toArray();
    }

    private function buildRsvpChart(array $summary): array
    {
        return [
            [
                'label' => 'Accepted',
                'value' => $summary['accepted'],
            ],
            [
                'label' => 'Declined',
                'value' => $summary['declined'],
            ],
            [
                'label' => 'Pending',
                'value' => $summary['pending'],
            ],
        ];
    }

    private function buildResponseChart(array $summary): array
    {
        return [
            [
                'label' => 'Responded',
                'value' => $summary['responded'],
            ],
            [
                'label' => 'Not Responded',
                'value' => $summary['not_responded'],
            ],
        ];
    }

    private function buildCheckInChart(array $summary): array
    {
        return [
            [
                'label' => 'Checked In',
                'value' => $summary['checked_in'],
            ],
            [
                'label' => 'Not Arrived',
                'value' => $summary['not_arrived'],
            ],
        ];
    }

    private function buildFollowUpChart(array $summary): array
    {
        return [
            [
                'label' => 'Followed Up',
                'value' => $summary['followed_up'],
            ],
            [
                'label' => 'Not Followed Up',
                'value' => $summary['not_followed_up'],
            ],
        ];
    }

    private function buildReminderChart(array $summary): array
    {
        return [
            [
                'label' => 'Pending',
                'value' => $summary['pending'],
            ],
            [
                'label' => 'Sent',
                'value' => $summary['sent'],
            ],
            [
                'label' => 'Failed',
                'value' => $summary['failed'],
            ],
            [
                'label' => 'Cancelled',
                'value' => $summary['cancelled'],
            ],
        ];
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

        abort_unless((int) $event->user_id === (int) $user->id, 403);
    }
}
