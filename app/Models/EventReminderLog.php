<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventReminderLog extends Model
{
    protected $fillable = [
        'event_reminder_id',
        'event_id',
        'recipient_email',
        'recipient_type',
        'status',
        'error_message',
        'sent_at',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function reminder()
    {
        return $this->belongsTo(EventReminder::class, 'event_reminder_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
