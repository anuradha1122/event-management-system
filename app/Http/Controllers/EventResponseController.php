<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class EventResponseController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $event->load([
            'questions:id,event_id,question,type,options,is_required',
            'guests' => function ($query) {
                $query->with([
                    'invitation:id,event_id,guest_id,token,responded_at',
                    'invitation.answers:id,invitation_id,question_id,answer',
                    'invitation.answers.question:id,question,type',
                ])->latest();
            },
        ]);

        $summary = [
            'total_guests' => $event->guests->count(),
            'pending' => $event->guests->where('status', 'pending')->count(),
            'accepted' => $event->guests->where('status', 'accepted')->count(),
            'declined' => $event->guests->where('status', 'declined')->count(),
            'total_extra_guests' => $event->guests
                ->where('status', 'accepted')
                ->sum('guest_count'),
        ];

        return Inertia::render('Responses/Index', [
            'event' => $event,
            'questions' => $event->questions,
            'guests' => $event->guests,
            'summary' => $summary,
        ]);
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = auth()->user();

        if ($user->hasRole('Super Admin')) {
            return;
        }

        abort_unless($event->user_id === $user->id, 403);
    }
}
