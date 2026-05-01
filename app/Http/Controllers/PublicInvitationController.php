<?php

namespace App\Http\Controllers;

use App\Models\EventAnswer;
use App\Models\EventInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicInvitationController extends Controller
{
    public function show(string $token): Response
    {
        $invitation = EventInvitation::query()
            ->where('token', $token)
            ->with([
                'event:id,title,description,event_date,event_time,venue,event_type,theme_color,cover_image,dress_code,contact_name,contact_phone,map_link',
                'event.questions:id,event_id,question,type,options,is_required',
                'guest:id,event_id,name,email,phone,status,guest_count',
                'answers:id,invitation_id,question_id,answer',
            ])
            ->firstOrFail();

        $existingAnswers = $invitation->answers
            ->pluck('answer', 'question_id')
            ->toArray();

        return Inertia::render('Invite/Show', [
            'invitation' => $invitation,
            'event' => $invitation->event,
            'guest' => $invitation->guest,
            'questions' => $invitation->event->questions,
            'existingAnswers' => $existingAnswers,
        ]);
    }

    public function submit(Request $request, string $token): RedirectResponse
    {
        $invitation = EventInvitation::query()
            ->where('token', $token)
            ->with([
                'guest',
                'event.questions',
            ])
            ->firstOrFail();

        $rules = [
            'status' => ['required', 'in:accepted,declined'],
            'guest_count' => ['nullable', 'integer', 'min:0', 'max:50'],
            'answers' => ['nullable', 'array'],
        ];

        foreach ($invitation->event->questions as $question) {
            $field = 'answers.' . $question->id;

            if ($question->is_required) {
                $rules[$field] = ['required'];
            } else {
                $rules[$field] = ['nullable'];
            }

            if ($question->type === 'number') {
                $rules[$field][] = 'numeric';
            }
        }

        $validated = $request->validate($rules);

        $invitation->guest->update([
            'status' => $validated['status'],
            'guest_count' => $validated['status'] === 'accepted'
                ? ($validated['guest_count'] ?? 0)
                : 0,
        ]);

        foreach ($invitation->event->questions as $question) {
            $answer = $validated['answers'][$question->id] ?? null;

            EventAnswer::updateOrCreate(
                [
                    'invitation_id' => $invitation->id,
                    'question_id' => $question->id,
                ],
                [
                    'answer' => $answer,
                ]
            );
        }

        $invitation->update([
            'responded_at' => now(),
        ]);

        return redirect()
            ->route('invite.show', $token)
            ->with('success', 'Your RSVP has been submitted successfully.');
    }
}
