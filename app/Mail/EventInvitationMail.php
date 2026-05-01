<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\EventGuest;
use App\Models\EventInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EventInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Event $event;
    public EventGuest $guest;
    public EventInvitation $invitation;
    public string $inviteUrl;

    public function __construct(
        Event $event,
        EventGuest $guest,
        EventInvitation $invitation,
        string $inviteUrl
    ) {
        $this->event = $event;
        $this->guest = $guest;
        $this->invitation = $invitation;
        $this->inviteUrl = $inviteUrl;
    }

    public function build()
    {
        return $this
            ->subject('Invitation: ' . $this->event->title)
            ->view('emails.event-invitation');
    }
}
