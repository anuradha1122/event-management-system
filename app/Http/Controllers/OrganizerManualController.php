<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class OrganizerManualController extends Controller
{
    public function show(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $event->loadMissing([
            'user:id,name,email',
        ]);

        $event->loadCount([
            'guests',
            'invitations',
            'questions',
            'tasks',
            'expenses',
            'vendors',
            'schedules',
            'staff',
            'reminders',
            'activityLogs',
            'qaChecks',
        ]);

        return Inertia::render('OrganizerManual/Show', [
            'event' => $event,
        ]);
    }

    private function authorizeEventAccess(Event $event): void
    {
        if (auth()->user()?->hasRole('Super Admin')) {
            return;
        }

        abort_if($event->user_id !== auth()->id(), 403);
    }
}
