<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\EventGuest;
use App\Models\EventInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GuestFollowUpMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public Event $event,
        public EventGuest $guest,
        public ?EventInvitation $invitation = null,
        public ?string $messageText = null
    ) {
    }

    public function build(): self
    {
        return $this
            ->subject('Reminder: ' . $this->event->title)
            ->view('emails.guest-follow-up')
            ->with([
                'event' => $this->event,
                'guest' => $this->guest,
                'invitation' => $this->invitation,
                'messageText' => $this->messageText,
                'inviteUrl' => $this->invitation
                    ? url('/invite/' . $this->invitation->token)
                    : null,
            ]);
    }
}
