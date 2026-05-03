<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\EventActivityLog;
use App\Models\User;
use App\Models\EventQaCheck;

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

        // Event status lifecycle fields
        'status',
        'completed_at',
        'completed_by',
        'cancelled_at',
        'cancelled_by',
    ];

    protected $casts = [
        'event_date' => 'date',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function completedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function cancelledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
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

    public function tasks(): HasMany
    {
        return $this->hasMany(\App\Models\EventTask::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(\App\Models\EventExpense::class);
    }

    public function vendors(): HasMany
    {
        return $this->hasMany(\App\Models\EventVendor::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(\App\Models\EventSchedule::class);
    }

    public function staff(): HasMany
    {
        return $this->hasMany(\App\Models\EventStaff::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(\App\Models\EventReminder::class);
    }

    public function reminderLogs(): HasMany
    {
        return $this->hasMany(\App\Models\EventReminderLog::class);
    }

    public function guestInteractions(): HasMany
    {
        return $this->hasMany(\App\Models\EventGuestInteraction::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(EventActivityLog::class);
    }

    public function isDraft(): bool
    {
        return ($this->status ?? 'draft') === 'draft';
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function isClosed(): bool
    {
        return in_array($this->status, ['completed', 'cancelled'], true);
    }

    public function qaChecks(): HasMany
    {
        return $this->hasMany(EventQaCheck::class);
    }
}
