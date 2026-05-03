<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventGuestInteraction extends Model
{
    protected $fillable = [
        'event_id',
        'guest_id',
        'user_id',
        'type',
        'channel',
        'title',
        'message',
        'note',
        'interaction_at',
    ];

    protected $casts = [
        'interaction_at' => 'datetime',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(EventGuest::class, 'guest_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
