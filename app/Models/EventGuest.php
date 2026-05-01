<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class EventGuest extends Model
{
    protected $fillable = [
        'event_id',
        'name',
        'email',
        'phone',
        'status',
        'guest_count',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function invitation(): HasOne
    {
        return $this->hasOne(EventInvitation::class, 'guest_id');
    }

    public function answers()
    {
        return $this->hasMany(EventAnswer::class, 'guest_id');
    }
}
