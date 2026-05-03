<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventGuest;
use App\Models\EventInvitation;
use App\Services\EventActivityLogger;
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
                'status' => $event->status,
            ],
            'guests' => $guests,
        ]);
    }

    public function create(Event $event): Response|RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        return Inertia::render('Guests/Create', [
            'event' => $event,
        ]);
    }

    public function store(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

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

        EventActivityLogger::record(
            event: $event,
            action: 'guest_added',
            description: "Guest {$guest->name} added.",
            subject: $guest,
            properties: [
                'guest_id' => $guest->id,
                'guest_name' => $guest->name,
                'guest_email' => $guest->email,
                'guest_phone' => $guest->phone,
                'guest_count' => $guest->guest_count,
                'status' => $guest->status,
            ]
        );

        $invitation = EventInvitation::create([
            'event_id' => $event->id,
            'guest_id' => $guest->id,
            'token' => $this->generateUniqueToken(),
        ]);

        EventActivityLogger::record(
            event: $event,
            action: 'invitation_link_generated',
            description: "Invitation link generated for guest {$guest->name}.",
            subject: $invitation,
            properties: [
                'guest_id' => $guest->id,
                'guest_name' => $guest->name,
                'invitation_id' => $invitation->id,
                'token' => $invitation->token,
                'invite_url' => url('/invite/' . $invitation->token),
            ]
        );

        return redirect()
            ->route('events.guests.index', $event)
            ->with('success', 'Guest added and invitation link generated.');
    }

    public function destroy(Event $event, EventGuest $guest): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        abort_unless((int) $guest->event_id === (int) $event->id, 403);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $guestData = [
            'guest_id' => $guest->id,
            'guest_name' => $guest->name,
            'guest_email' => $guest->email,
            'guest_phone' => $guest->phone,
            'guest_count' => $guest->guest_count,
            'status' => $guest->status,
            'checked_in_at' => optional($guest->checked_in_at)->format('Y-m-d H:i:s'),
            'followup_sent_at' => optional($guest->followup_sent_at)->format('Y-m-d H:i:s'),
            'followup_count' => $guest->followup_count,
        ];

        $guest->delete();

        EventActivityLogger::record(
            event: $event,
            action: 'guest_deleted',
            description: "Guest {$guestData['guest_name']} deleted.",
            subject: $event,
            properties: $guestData
        );

        return redirect()
            ->route('events.guests.index', $event)
            ->with('success', 'Guest deleted successfully.');
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = auth()->user();

        if (! $user) {
            abort(403);
        }

        if ($user->hasRole('Super Admin')) {
            return;
        }

        abort_unless((int) $event->user_id === (int) $user->id, 403);
    }

    private function preventClosedEventModification(Event $event): ?RedirectResponse
    {
        if (in_array($event->status, ['completed', 'cancelled'], true)) {
            return redirect()
                ->route('events.guests.index', $event)
                ->with('error', 'This event is closed and guests cannot be modified.');
        }

        return null;
    }

    private function generateUniqueToken(): string
    {
        do {
            $token = Str::random(32);
        } while (EventInvitation::where('token', $token)->exists());

        return $token;
    }
}
