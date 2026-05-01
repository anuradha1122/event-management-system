<?php

namespace App\Http\Controllers;

use App\Mail\EventInvitationMail;
use App\Models\Event;
use App\Models\EventGuest;
use App\Models\EventInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class EventInvitationSendController extends Controller
{
    public function send(Event $event, EventGuest $guest): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ((int) $guest->event_id !== (int) $event->id) {
            abort(404);
        }

        if (empty($guest->email)) {
            return back()->with('error', 'This guest does not have an email address.');
        }

        $invitation = $this->getOrCreateInvitation($event, $guest);

        $inviteUrl = url('/invite/' . $invitation->token);

        Mail::to($guest->email)->send(
            new EventInvitationMail($event, $guest, $invitation, $inviteUrl)
        );

        $invitation->update([
            'sent_at' => now(),
            'sent_count' => ((int) $invitation->sent_count) + 1,
        ]);

        return back()->with('success', 'Invitation email sent to ' . $guest->name . '.');
    }

    public function sendAll(Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        $guests = EventGuest::query()
            ->where('event_id', $event->id)
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->with('invitation')
            ->get();

        $sentCount = 0;
        $skippedCount = 0;

        foreach ($guests as $guest) {
            $invitation = $this->getOrCreateInvitation($event, $guest);

            if ($guest->status !== 'pending') {
                $skippedCount++;
                continue;
            }

            $inviteUrl = url('/invite/' . $invitation->token);

            Mail::to($guest->email)->send(
                new EventInvitationMail($event, $guest, $invitation, $inviteUrl)
            );

            $invitation->update([
                'sent_at' => now(),
                'sent_count' => ((int) $invitation->sent_count) + 1,
            ]);

            $sentCount++;
        }

        return back()->with(
            'success',
            "{$sentCount} invitation emails sent. {$skippedCount} guests skipped."
        );
    }

    private function getOrCreateInvitation(Event $event, EventGuest $guest): EventInvitation
    {
        if ($guest->invitation) {
            return $guest->invitation;
        }

        return EventInvitation::create([
            'event_id' => $event->id,
            'guest_id' => $guest->id,
            'token' => Str::uuid()->toString(),
        ]);
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
