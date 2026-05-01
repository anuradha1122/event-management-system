<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'event_date',
        'event_time',
        'venue',
        'event_type',
        'theme_color',
        'cover_image',
        'dress_code',
        'contact_name',
        'contact_phone',
        'map_link',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function guests(): HasMany
    {
        return $this->hasMany(EventGuest::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(EventInvitation::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(EventQuestion::class);
    }

    public function tasks()
    {
        return $this->hasMany(\App\Models\EventTask::class);
    }

    public function expenses()
    {
        return $this->hasMany(\App\Models\EventExpense::class);
    }

    public function vendors()
    {
        return $this->hasMany(\App\Models\EventVendor::class);
    }

    public function schedules()
    {
        return $this->hasMany(\App\Models\EventSchedule::class);
    }
}
