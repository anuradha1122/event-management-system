<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\EventActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EventStatusController extends Controller
{
    public function activate(Request $request, Event $event): RedirectResponse
    {
        if ($event->status === 'active') {
            return back()->with('info', 'Event is already active.');
        }

        $oldStatus = $event->status;

        $event->update([
            'status' => 'active',
            'completed_at' => null,
            'completed_by' => null,
            'cancelled_at' => null,
            'cancelled_by' => null,
        ]);

        $this->logActivity(
            event: $event,
            action: 'event_activated',
            description: 'Event status changed to active.',
            oldStatus: $oldStatus,
            newStatus: 'active'
        );

        return back()->with('success', 'Event marked as active successfully.');
    }

    public function complete(Request $request, Event $event): RedirectResponse
    {
        if ($event->status === 'completed') {
            return back()->with('info', 'Event is already completed.');
        }

        $oldStatus = $event->status;

        $event->update([
            'status' => 'completed',
            'completed_at' => now(),
            'completed_by' => auth()->id(),
            'cancelled_at' => null,
            'cancelled_by' => null,
        ]);

        $this->logActivity(
            event: $event,
            action: 'event_completed',
            description: 'Event was marked as completed.',
            oldStatus: $oldStatus,
            newStatus: 'completed'
        );

        return back()->with('success', 'Event completed successfully.');
    }

    public function cancel(Request $request, Event $event): RedirectResponse
    {
        if ($event->status === 'cancelled') {
            return back()->with('info', 'Event is already cancelled.');
        }

        $oldStatus = $event->status;

        $event->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancelled_by' => auth()->id(),
            'completed_at' => null,
            'completed_by' => null,
        ]);

        $this->logActivity(
            event: $event,
            action: 'event_cancelled',
            description: 'Event was cancelled.',
            oldStatus: $oldStatus,
            newStatus: 'cancelled'
        );

        return back()->with('success', 'Event cancelled successfully.');
    }

    public function reopen(Request $request, Event $event): RedirectResponse
    {
        if (!in_array($event->status, ['completed', 'cancelled'], true)) {
            return back()->with('info', 'Only completed or cancelled events can be reopened.');
        }

        $oldStatus = $event->status;

        $event->update([
            'status' => 'active',
            'completed_at' => null,
            'completed_by' => null,
            'cancelled_at' => null,
            'cancelled_by' => null,
        ]);

        $this->logActivity(
            event: $event,
            action: 'event_reopened',
            description: 'Event was reopened and marked as active.',
            oldStatus: $oldStatus,
            newStatus: 'active'
        );

        return back()->with('success', 'Event reopened successfully.');
    }

    private function logActivity(
        Event $event,
        string $action,
        string $description,
        ?string $oldStatus,
        string $newStatus
    ): void {
        if (!class_exists(EventActivityLogger::class)) {
            return;
        }

        app(EventActivityLogger::class)->record(
            event: $event,
            action: $action,
            description: $description,
            subject: $event,
            properties: [
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
            ],
            userId: auth()->id()
        );
    }
}
