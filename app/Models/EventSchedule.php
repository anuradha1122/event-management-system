<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventSchedule extends Model
{
    protected $fillable = [
        'event_id',
        'title',
        'description',
        'schedule_date',
        'start_time',
        'end_time',
        'location',
        'assigned_to',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'schedule_date' => 'date',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
