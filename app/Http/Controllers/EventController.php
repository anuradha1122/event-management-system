<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $events = Event::query()
            ->when(! $user->hasRole('Super Admin'), function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->get();

        return Inertia::render('Events/Index', [
            'events' => $events,
        ]);
    }

    public function create(): Response
    {
        abort_unless(auth()->user()->can('create events'), 403);

        return Inertia::render('Events/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless(auth()->user()->can('create events'), 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_date' => ['nullable', 'date'],
            'event_time' => ['nullable', 'date_format:H:i'],
            'venue' => ['nullable', 'string', 'max:255'],

            'event_type' => ['nullable', 'string', 'max:100'],
            'theme_color' => ['nullable', 'string', 'max:30'],
            'cover_image' => ['nullable', 'image', 'max:2048'],
            'dress_code' => ['nullable', 'string', 'max:255'],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'map_link' => ['nullable', 'url', 'max:1000'],
        ]);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request
                ->file('cover_image')
                ->store('event-covers', 'public');
        }

        Event::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return redirect()
            ->route('events.index')
            ->with('success', 'Event created successfully.');
    }

    public function show(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $event->loadCount([
            'guests',
            'invitations',
            'questions',
        ]);

        return Inertia::render('Events/Show', [
            'event' => $event,
        ]);
    }

    public function edit(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        abort_unless(auth()->user()->can('update own events'), 403);

        return Inertia::render('Events/Edit', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        abort_unless(auth()->user()->can('update own events'), 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_date' => ['nullable', 'date'],
            'event_time' => ['nullable', 'date_format:H:i'],
            'venue' => ['nullable', 'string', 'max:255'],

            'event_type' => ['nullable', 'string', 'max:100'],
            'theme_color' => ['nullable', 'string', 'max:30'],
            'cover_image' => ['nullable', 'image', 'max:2048'],
            'dress_code' => ['nullable', 'string', 'max:255'],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'map_link' => ['nullable', 'url', 'max:1000'],
        ]);

        if ($request->hasFile('cover_image')) {
            if ($event->cover_image) {
                Storage::disk('public')->delete($event->cover_image);
            }

            $validated['cover_image'] = $request
                ->file('cover_image')
                ->store('event-covers', 'public');
        } else {
            unset($validated['cover_image']);
        }

        $event->update($validated);

        return redirect()
            ->route('events.show', $event)
            ->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        abort_unless(
            auth()->user()->can('delete own events') || auth()->user()->can('delete all events'),
            403
        );

        if ($event->cover_image) {
            Storage::disk('public')->delete($event->cover_image);
        }

        $event->delete();

        return redirect()
            ->route('events.index')
            ->with('success', 'Event deleted successfully.');
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = auth()->user();

        if ($user->hasRole('Super Admin')) {
            return;
        }

        abort_unless($event->user_id === $user->id, 403);
    }
}
