<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventGuest;
use App\Models\EventInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventGuestController extends Controller
{
    public function index(Event $event)
    {
        $this->authorizeEventAccess($event);

        $guests = EventGuest::query()
            ->where('event_id', $event->id)
            ->with('invitation')
            ->latest()
            ->get();

        return Inertia::render('Guests/Index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
            ],
            'guests' => $guests,
        ]);
    }

    public function create(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        return Inertia::render('Guests/Create', [
            'event' => $event,
        ]);
    }

    public function store(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'guest_count' => ['nullable', 'integer', 'min:0', 'max:50'],
        ]);

        $guest = EventGuest::create([
            'event_id' => $event->id,
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'guest_count' => $validated['guest_count'] ?? 0,
            'status' => 'pending',
        ]);

        EventInvitation::create([
            'event_id' => $event->id,
            'guest_id' => $guest->id,
            'token' => $this->generateUniqueToken(),
        ]);

        return redirect()
            ->route('events.guests.index', $event)
            ->with('success', 'Guest added and invitation link generated.');
    }

    public function destroy(Event $event, EventGuest $guest): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        abort_unless($guest->event_id === $event->id, 403);

        $guest->delete();

        return redirect()
            ->route('events.guests.index', $event)
            ->with('success', 'Guest deleted successfully.');
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = auth()->user();

        if ($user->hasRole('Super Admin')) {
            return;
        }

        abort_unless($event->user_id === $user->id, 403);
    }

    private function generateUniqueToken(): string
    {
        do {
            $token = Str::random(32);
        } while (EventInvitation::where('token', $token)->exists());

        return $token;
    }
}
