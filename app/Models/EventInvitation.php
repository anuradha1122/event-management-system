<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventInvitation extends Model
{
    protected $fillable = [
        'event_id',
        'guest_id',
        'token',
        'responded_at',
        'sent_at',
        'sent_count',
    ];

    protected $casts = [
        'responded_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function guest()
    {
        return $this->belongsTo(EventGuest::class, 'guest_id');
    }

    public function answers()
    {
        return $this->hasMany(EventAnswer::class, 'invitation_id');
    }
}
