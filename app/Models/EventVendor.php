<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EventVendor extends Model
{
    protected $fillable = [
        'event_id',
        'name',
        'category',
        'contact_person',
        'phone',
        'email',
        'address',
        'notes',
        'status',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(EventExpense::class, 'vendor_id');
    }
}
