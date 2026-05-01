<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventAnswer;
use App\Models\EventGuest;
use App\Models\EventInvitation;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class EventAnalyticsController extends Controller
{
    public function show(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $guests = EventGuest::query()
            ->where('event_id', $event->id)
            ->with('invitation')
            ->get();

        $totalGuests = $guests->count();

        $acceptedGuests = $guests
            ->where('status', 'accepted')
            ->count();

        $declinedGuests = $guests
            ->where('status', 'declined')
            ->count();

        $pendingGuests = $guests
            ->where('status', 'pending')
            ->count();

        $totalAttending = $guests
            ->where('status', 'accepted')
            ->sum('guest_count');

        $sentInvitations = EventInvitation::query()
            ->where('event_id', $event->id)
            ->whereNotNull('sent_at')
            ->count();

        $notSentInvitations = max($totalGuests - $sentInvitations, 0);

        $questions = $event->questions()
            ->orderBy('id')
            ->get();

        $questionSummaries = $this->buildQuestionSummaries($event, $questions);

        return Inertia::render('Events/Analytics', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'event_time' => $event->event_time,
                'venue' => $event->venue,
            ],
            'summary' => [
                'total_guests' => $totalGuests,
                'accepted_guests' => $acceptedGuests,
                'declined_guests' => $declinedGuests,
                'pending_guests' => $pendingGuests,
                'total_attending' => $totalAttending,
                'sent_invitations' => $sentInvitations,
                'not_sent_invitations' => $notSentInvitations,
            ],
            'questionSummaries' => $questionSummaries,
        ]);
    }

    private function buildQuestionSummaries(Event $event, Collection $questions): array
    {
        $summaries = [];

        foreach ($questions as $question) {
            $answers = EventAnswer::query()
                ->whereHas('invitation', function ($query) use ($event) {
                    $query->where('event_id', $event->id);
                })
                ->where('question_id', $question->id)
                ->whereNotNull('answer')
                ->pluck('answer')
                ->filter(function ($answer) {
                    return trim((string) $answer) !== '';
                })
                ->values();

            $counts = $answers
                ->countBy()
                ->map(function ($count, $answer) {
                    return [
                        'answer' => $answer,
                        'count' => $count,
                    ];
                })
                ->values()
                ->sortByDesc('count')
                ->values()
                ->toArray();

            $summaries[] = [
                'id' => $question->id,
                'question' => $question->question,
                'type' => $question->type,
                'total_answers' => $answers->count(),
                'answers' => $counts,
            ];
        }

        return $summaries;
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = auth()->user();

        if ($user->hasRole('Super Admin')) {
            return;
        }

        if ((int) $event->user_id !== (int) $user->id) {
            abort(403);
        }
    }
}
