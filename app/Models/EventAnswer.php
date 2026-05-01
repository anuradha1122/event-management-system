<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventAnswer extends Model
{
    protected $fillable = [
        'invitation_id',
        'question_id',
        'answer',
    ];

    public function invitation()
    {
        return $this->belongsTo(EventInvitation::class, 'invitation_id');
    }

    public function question()
    {
        return $this->belongsTo(EventQuestion::class, 'question_id');
    }
}
