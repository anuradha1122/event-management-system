<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class EventProjectSummaryController extends Controller
{
    public function show(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $event->loadMissing([
            'user:id,name,email',
            'completedBy:id,name',
            'cancelledBy:id,name',
        ]);

        $event->loadCount([
            'guests',
            'invitations',
            'questions',
            'tasks',
            'expenses',
            'vendors',
            'schedules',
            'staff',
            'reminders',
            'reminderLogs',
            'activityLogs',
            'qaChecks',
        ]);

        $guestSummary = $this->buildGuestSummary($event);
        $rsvpSummary = $this->buildRsvpSummary($event);
        $checkInSummary = $this->buildCheckInSummary($event);
        $followUpSummary = $this->buildFollowUpSummary($event);
        $budgetSummary = $this->buildBudgetSummary($event);
        $qaSummary = $this->buildQaSummary($event);
        $activitySummary = $this->buildActivitySummary($event);

        return Inertia::render('EventProjectSummary/Show', [
            'event' => $event,
            'guestSummary' => $guestSummary,
            'rsvpSummary' => $rsvpSummary,
            'checkInSummary' => $checkInSummary,
            'followUpSummary' => $followUpSummary,
            'budgetSummary' => $budgetSummary,
            'qaSummary' => $qaSummary,
            'activitySummary' => $activitySummary,
        ]);
    }

    private function authorizeEventAccess(Event $event): void
    {
        if (auth()->user()?->hasRole('Super Admin')) {
            return;
        }

        abort_if($event->user_id !== auth()->id(), 403);
    }

    private function buildGuestSummary(Event $event): array
    {
        $guests = $event->guests();

        return [
            'total' => (clone $guests)->count(),
            'accepted' => (clone $guests)->where('status', 'accepted')->count(),
            'declined' => (clone $guests)->where('status', 'declined')->count(),
            'pending' => (clone $guests)->where(function ($query) {
                $query->whereNull('status')
                    ->orWhere('status', 'pending');
            })->count(),
            'total_guest_count' => (int) (clone $guests)->sum('guest_count'),
        ];
    }

    private function buildRsvpSummary(Event $event): array
    {
        $totalInvitations = $event->invitations()->count();

        $answeredInvitations = $event->invitations()
            ->whereHas('answers')
            ->count();

        return [
            'questions' => $event->questions()->count(),
            'invitations' => $totalInvitations,
            'answered_invitations' => $answeredInvitations,
            'not_answered_invitations' => max($totalInvitations - $answeredInvitations, 0),
        ];
    }

    private function buildCheckInSummary(Event $event): array
    {
        $totalGuests = $event->guests()->count();

        $checkedIn = $event->guests()
            ->whereNotNull('checked_in_at')
            ->count();

        return [
            'total_guests' => $totalGuests,
            'checked_in' => $checkedIn,
            'not_checked_in' => max($totalGuests - $checkedIn, 0),
            'percentage' => $totalGuests > 0 ? round(($checkedIn / $totalGuests) * 100, 2) : 0,
        ];
    }

    private function buildFollowUpSummary(Event $event): array
    {
        $totalGuests = $event->guests()->count();

        $followedUp = $event->guests()
            ->whereNotNull('followup_sent_at')
            ->count();

        $totalFollowUps = (int) $event->guests()->sum('followup_count');

        return [
            'total_guests' => $totalGuests,
            'followed_up' => $followedUp,
            'not_followed_up' => max($totalGuests - $followedUp, 0),
            'total_followup_count' => $totalFollowUps,
            'percentage' => $totalGuests > 0 ? round(($followedUp / $totalGuests) * 100, 2) : 0,
        ];
    }

    private function buildBudgetSummary(Event $event): array
    {
        if (!Schema::hasTable('event_expenses')) {
            return [
                'expense_count' => 0,
                'total_amount' => 0,
                'amount_column' => null,
            ];
        }

        $possibleColumns = [
            'amount',
            'total_amount',
            'cost',
            'price',
            'estimated_amount',
            'actual_amount',
        ];

        $amountColumn = collect($possibleColumns)
            ->first(fn ($column) => Schema::hasColumn('event_expenses', $column));

        if (!$amountColumn) {
            return [
                'expense_count' => $event->expenses()->count(),
                'total_amount' => 0,
                'amount_column' => null,
            ];
        }

        return [
            'expense_count' => $event->expenses()->count(),
            'total_amount' => (float) $event->expenses()->sum($amountColumn),
            'amount_column' => $amountColumn,
        ];
    }

    private function buildQaSummary(Event $event): array
    {
        $total = $event->qaChecks()->count();
        $passed = $event->qaChecks()->where('status', 'passed')->count();
        $failed = $event->qaChecks()->where('status', 'failed')->count();
        $pending = $event->qaChecks()->where('status', 'pending')->count();

        return [
            'total' => $total,
            'passed' => $passed,
            'failed' => $failed,
            'pending' => $pending,
            'percentage' => $total > 0 ? round(($passed / $total) * 100, 2) : 0,
        ];
    }

    private function buildActivitySummary(Event $event): array
    {
        $latestLogs = $event->activityLogs()
            ->latest()
            ->limit(10)
            ->get([
                'id',
                'action',
                'description',
                'created_at',
                'user_id',
            ]);

        return [
            'total' => $event->activityLogs()->count(),
            'latest' => $latestLogs,
        ];
    }
}
