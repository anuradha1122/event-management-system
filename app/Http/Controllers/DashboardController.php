<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventGuest;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $eventQuery = Event::query();

        if (! $user->hasRole('Super Admin')) {
            $eventQuery->where('user_id', $user->id);
        }

        $eventIds = (clone $eventQuery)->pluck('id');

        $guestQuery = EventGuest::query()
            ->whereIn('event_id', $eventIds);

        $summary = [
            'total_events' => (clone $eventQuery)->count(),
            'total_guests' => (clone $guestQuery)->count(),
            'accepted' => (clone $guestQuery)->where('status', 'accepted')->count(),
            'declined' => (clone $guestQuery)->where('status', 'declined')->count(),
            'pending' => (clone $guestQuery)->where('status', 'pending')->count(),
            'extra_guests' => (clone $guestQuery)
                ->where('status', 'accepted')
                ->sum('guest_count'),
        ];

        $recentEvents = (clone $eventQuery)
            ->withCount([
                'guests',
                'invitations',
                'questions',
            ])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'summary' => $summary,
            'recentEvents' => $recentEvents,
        ]);
    }
}
