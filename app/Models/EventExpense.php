<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventExpense extends Model
{
    protected $fillable = [
        'event_id',
        'vendor_id',
        'title',
        'category',
        'description',
        'estimated_amount',
        'actual_amount',
        'paid_amount',
        'payment_status',
        'expense_date',
        'vendor_name',
        'notes',
    ];

    protected $casts = [
        'estimated_amount' => 'decimal:2',
        'actual_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'expense_date' => 'date',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(EventVendor::class, 'vendor_id');
    }
}
