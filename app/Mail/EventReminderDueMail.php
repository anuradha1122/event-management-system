<?php

namespace App\Mail;

use App\Models\EventReminder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventReminderDueMail extends Mailable
{
    use Queueable, SerializesModels;

    public EventReminder $reminder;

    public function __construct(EventReminder $reminder)
    {
        $this->reminder = $reminder;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Event Reminder: ' . $this->reminder->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.event-reminder-due',
            with: [
                'reminder' => $this->reminder,
                'event' => $this->reminder->event,
                'task' => $this->reminder->task,
                'schedule' => $this->reminder->schedule,
                'staff' => $this->reminder->staff,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
