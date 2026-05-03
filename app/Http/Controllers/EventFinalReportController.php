<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventGuest;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EventFinalReportController extends Controller
{
    public function pdf(Event $event): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Optional ownership / permission check
        |--------------------------------------------------------------------------
        | If you already use policies or permissions, add your authorization here.
        | Example:
        | $this->authorize('view', $event);
        */

        $guestSummary = $this->buildGuestSummary($event);
        $invitationSummary = $this->buildInvitationSummary($event);
        $followUpSummary = $this->buildFollowUpSummary($event);
        $reminderSummary = $this->buildReminderSummary($event);
        $expenseSummary = $this->buildExpenseSummary($event);
        $guestList = $this->buildGuestList($event);
        $recentActivityLogs = $this->buildRecentActivityLogs($event);

        $pdf = Pdf::loadView('reports.event-final-report', [
            'event' => $event,
            'guestSummary' => $guestSummary,
            'invitationSummary' => $invitationSummary,
            'followUpSummary' => $followUpSummary,
            'reminderSummary' => $reminderSummary,
            'expenseSummary' => $expenseSummary,
            'guestList' => $guestList,
            'recentActivityLogs' => $recentActivityLogs,
            'generatedAt' => now(),
            'organizer' => auth()->user(),
        ])->setPaper('a4', 'portrait');

        $fileName = 'event-final-report-' . $event->id . '.pdf';

        return $pdf->download($fileName);
    }

    private function buildGuestSummary(Event $event): array
    {
        if (!Schema::hasTable('event_guests')) {
            return [
                'total' => 0,
                'accepted' => 0,
                'declined' => 0,
                'pending' => 0,
                'checked_in' => 0,
                'total_guest_count' => 0,
            ];
        }

        $query = EventGuest::query()
            ->where('event_id', $event->id);

        return [
            'total' => (clone $query)->count(),
            'accepted' => (clone $query)->where('status', 'accepted')->count(),
            'declined' => (clone $query)->where('status', 'declined')->count(),
            'pending' => (clone $query)->where('status', 'pending')->count(),
            'checked_in' => Schema::hasColumn('event_guests', 'checked_in_at')
                ? (clone $query)->whereNotNull('checked_in_at')->count()
                : 0,
            'total_guest_count' => Schema::hasColumn('event_guests', 'guest_count')
                ? (clone $query)->sum('guest_count')
                : (clone $query)->count(),
        ];
    }

    private function buildInvitationSummary(Event $event): array
    {
        if (!Schema::hasTable('event_invitations')) {
            return [
                'total' => 0,
                'submitted' => 0,
                'not_submitted' => 0,
            ];
        }

        $query = DB::table('event_invitations')
            ->where('event_id', $event->id);

        $total = (clone $query)->count();

        $submitted = 0;

        if (Schema::hasColumn('event_invitations', 'submitted_at')) {
            $submitted = (clone $query)->whereNotNull('submitted_at')->count();
        } elseif (Schema::hasColumn('event_invitations', 'responded_at')) {
            $submitted = (clone $query)->whereNotNull('responded_at')->count();
        } elseif (Schema::hasColumn('event_invitations', 'status')) {
            $submitted = (clone $query)
                ->whereIn('status', ['submitted', 'responded', 'accepted', 'declined'])
                ->count();
        }

        return [
            'total' => $total,
            'submitted' => $submitted,
            'not_submitted' => max($total - $submitted, 0),
        ];
    }

    private function buildFollowUpSummary(Event $event): array
    {
        if (!Schema::hasTable('event_guests')) {
            return [
                'sent' => 0,
                'not_sent' => 0,
                'total_followup_count' => 0,
            ];
        }

        $query = EventGuest::query()
            ->where('event_id', $event->id);

        $total = (clone $query)->count();

        $sent = Schema::hasColumn('event_guests', 'followup_sent_at')
            ? (clone $query)->whereNotNull('followup_sent_at')->count()
            : 0;

        $totalFollowupCount = Schema::hasColumn('event_guests', 'followup_count')
            ? (clone $query)->sum('followup_count')
            : 0;

        return [
            'sent' => $sent,
            'not_sent' => max($total - $sent, 0),
            'total_followup_count' => $totalFollowupCount,
        ];
    }

    private function buildReminderSummary(Event $event): array
    {
        $reminders = 0;
        $logs = 0;
        $reviewed = 0;

        if (Schema::hasTable('event_reminders')) {
            $reminders = DB::table('event_reminders')
                ->where('event_id', $event->id)
                ->count();
        }

        if (Schema::hasTable('event_reminder_logs')) {
            $logQuery = DB::table('event_reminder_logs')
                ->where('event_id', $event->id);

            $logs = (clone $logQuery)->count();

            if (Schema::hasColumn('event_reminder_logs', 'reviewed_at')) {
                $reviewed = (clone $logQuery)->whereNotNull('reviewed_at')->count();
            } elseif (Schema::hasColumn('event_reminder_logs', 'is_reviewed')) {
                $reviewed = (clone $logQuery)->where('is_reviewed', true)->count();
            }
        }

        return [
            'reminders' => $reminders,
            'logs' => $logs,
            'reviewed' => $reviewed,
        ];
    }

    private function buildExpenseSummary(Event $event): array
    {
        if (!Schema::hasTable('event_expenses')) {
            return [
                'total_records' => 0,
                'total_amount' => 0,
                'amount_column' => null,
            ];
        }

        $amountColumn = $this->detectExpenseAmountColumn();

        $query = DB::table('event_expenses')
            ->where('event_id', $event->id);

        return [
            'total_records' => (clone $query)->count(),
            'total_amount' => $amountColumn
                ? (float) (clone $query)->sum($amountColumn)
                : 0,
            'amount_column' => $amountColumn,
        ];
    }

    private function detectExpenseAmountColumn(): ?string
    {
        $possibleColumns = [
            'amount',
            'total_amount',
            'cost',
            'price',
            'estimated_amount',
            'actual_amount',
        ];

        foreach ($possibleColumns as $column) {
            if (Schema::hasColumn('event_expenses', $column)) {
                return $column;
            }
        }

        return null;
    }

    private function buildGuestList(Event $event)
    {
        if (!Schema::hasTable('event_guests')) {
            return collect();
        }

        $columns = ['id', 'event_id'];

        foreach ([
            'name',
            'email',
            'phone',
            'status',
            'guest_count',
            'checked_in_at',
            'followup_sent_at',
            'followup_count',
            'checkin_note',
            'followup_note',
            'created_at',
        ] as $column) {
            if (Schema::hasColumn('event_guests', $column)) {
                $columns[] = $column;
            }
        }

        return DB::table('event_guests')
            ->select($columns)
            ->where('event_id', $event->id)
            ->orderBy('id')
            ->get();
    }

    private function buildRecentActivityLogs(Event $event)
    {
        if (!Schema::hasTable('event_activity_logs')) {
            return collect();
        }

        return DB::table('event_activity_logs')
            ->leftJoin('users', 'event_activity_logs.user_id', '=', 'users.id')
            ->where('event_activity_logs.event_id', $event->id)
            ->select([
                'event_activity_logs.id',
                'event_activity_logs.action',
                'event_activity_logs.description',
                'event_activity_logs.created_at',
                'users.name as user_name',
            ])
            ->orderByDesc('event_activity_logs.created_at')
            ->limit(20)
            ->get();
    }
}
