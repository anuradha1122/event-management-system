<?php

namespace App\Services;

use App\Models\Event;
use App\Models\EventActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class EventActivityLogger
{
    public function log(
        Event|int $event,
        string $action,
        ?string $description = null,
        ?Model $subject = null,
        array $properties = [],
        ?int $userId = null
    ): ?EventActivityLog {
        $eventId = $event instanceof Event ? $event->id : $event;

        if (! $eventId) {
            return null;
        }

        return EventActivityLog::create([
            'event_id' => $eventId,
            'user_id' => $userId ?? Auth::id(),
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject?->getKey(),
            'action' => $action,
            'description' => $description,
            'properties' => $properties ?: null,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    public static function record(
        Event|int $event,
        string $action,
        ?string $description = null,
        ?Model $subject = null,
        array $properties = [],
        ?int $userId = null
    ): ?EventActivityLog {
        return app(self::class)->log(
            event: $event,
            action: $action,
            description: $description,
            subject: $subject,
            properties: $properties,
            userId: $userId
        );
    }
}
