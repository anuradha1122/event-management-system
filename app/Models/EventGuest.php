<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'checked_in_at',
        'checked_in_by',
        'checkin_note',
        'followup_sent_at',
        'followup_sent_by',
        'followup_count',
        'followup_note',
    ];

    protected $casts = [
        'checked_in_at' => 'datetime',
        'followup_sent_at' => 'datetime',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function invitation(): HasOne
    {
        return $this->hasOne(EventInvitation::class, 'guest_id');
    }

    public function checkedInBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_in_by');
    }

    public function followupSentBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'followup_sent_by');
    }

    public function interactions(): HasMany
    {
        return $this->hasMany(EventGuestInteraction::class, 'guest_id');
    }
}
