<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EventStaff extends Model
{
    protected $table = 'event_staff';

    protected $fillable = [
        'event_id',
        'name',
        'role',
        'phone',
        'email',
        'notes',
        'status',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(EventTask::class, 'staff_id');
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(EventSchedule::class, 'staff_id');
    }
}
