<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventReminder extends Model
{
    protected $fillable = [
        'event_id',
        'task_id',
        'schedule_id',
        'staff_id',
        'title',
        'message',
        'reminder_type',
        'remind_at',
        'status',
        'sent_at',
    ];

    protected $casts = [
        'remind_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function task()
    {
        return $this->belongsTo(EventTask::class, 'task_id');
    }

    public function schedule()
    {
        return $this->belongsTo(EventSchedule::class, 'schedule_id');
    }

    public function staff()
    {
        return $this->belongsTo(EventStaff::class, 'staff_id');
    }

    public function logs()
    {
        return $this->hasMany(EventReminderLog::class, 'event_reminder_id');
    }
}
