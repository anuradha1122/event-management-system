<?php

namespace App\Http\Controllers;

use App\Models\EventAnswer;
use App\Models\EventInvitation;
use App\Services\EventActivityLogger;
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
                'answers',
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

        $guest = $invitation->guest;
        $event = $invitation->event;

        $oldGuestData = [
            'status' => $guest->status,
            'guest_count' => $guest->guest_count,
        ];

        $newGuestCount = $validated['status'] === 'accepted'
            ? ($validated['guest_count'] ?? 0)
            : 0;

        $guest->update([
            'status' => $validated['status'],
            'guest_count' => $newGuestCount,
        ]);

        $savedAnswers = [];

        foreach ($event->questions as $question) {
            $answer = $validated['answers'][$question->id] ?? null;

            $eventAnswer = EventAnswer::updateOrCreate(
                [
                    'invitation_id' => $invitation->id,
                    'question_id' => $question->id,
                ],
                [
                    'answer' => $answer,
                ]
            );

            $savedAnswers[] = [
                'answer_id' => $eventAnswer->id,
                'question_id' => $question->id,
                'question' => $question->question,
                'question_type' => $question->type,
                'answer' => $answer,
            ];
        }

        $invitation->update([
            'responded_at' => now(),
        ]);

        $guest->refresh();
        $invitation->refresh();

        EventActivityLogger::record(
            event: $event,
            action: 'rsvp_received',
            description: "RSVP received from guest {$guest->name}.",
            subject: $guest,
            properties: [
                'guest_id' => $guest->id,
                'guest_name' => $guest->name,
                'guest_email' => $guest->email,
                'guest_phone' => $guest->phone,
                'old_status' => $oldGuestData['status'],
                'new_status' => $guest->status,
                'old_guest_count' => $oldGuestData['guest_count'],
                'new_guest_count' => $guest->guest_count,
                'invitation_id' => $invitation->id,
                'token' => $invitation->token,
                'responded_at' => optional($invitation->responded_at)->format('Y-m-d H:i:s'),
            ],
            userId: null
        );

        EventActivityLogger::record(
            event: $event,
            action: 'rsvp_answers_saved',
            description: "RSVP answers saved for guest {$guest->name}.",
            subject: $invitation,
            properties: [
                'guest_id' => $guest->id,
                'guest_name' => $guest->name,
                'invitation_id' => $invitation->id,
                'answers' => $savedAnswers,
                'answers_count' => count($savedAnswers),
            ],
            userId: null
        );

        return redirect()
            ->route('invite.show', $token)
            ->with('success', 'Your RSVP has been submitted successfully.');
    }
}
