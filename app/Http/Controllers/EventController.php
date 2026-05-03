<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\EventActivityLogger;
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

        $event = Event::create([
            ...$validated,
            'user_id' => auth()->id(),
            'status' => 'draft',
        ]);

        EventActivityLogger::record(
            event: $event,
            action: 'event_created',
            description: "Event {$event->title} created.",
            subject: $event,
            properties: [
                'event_id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'event_date' => $event->event_date,
                'event_time' => $event->event_time,
                'venue' => $event->venue,
                'event_type' => $event->event_type,
                'theme_color' => $event->theme_color,
                'cover_image' => $event->cover_image,
                'dress_code' => $event->dress_code,
                'contact_name' => $event->contact_name,
                'contact_phone' => $event->contact_phone,
                'map_link' => $event->map_link,
                'user_id' => $event->user_id,
                'status' => $event->status,
            ]
        );

        return redirect()
            ->route('events.index')
            ->with('success', 'Event created successfully.');
    }

    public function show(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $event->loadMissing([
            'completedBy:id,name',
            'cancelledBy:id,name',
        ]);

        $event->loadCount([
            'guests',
            'invitations',
            'questions',
        ]);

        return Inertia::render('Events/Show', [
            'event' => $event,
        ]);
    }

    public function edit(Event $event): Response|RedirectResponse
    {
        $this->authorizeEventAccess($event);

        abort_unless(auth()->user()->can('update own events'), 403);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        return Inertia::render('Events/Edit', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        abort_unless(auth()->user()->can('update own events'), 403);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

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

        $oldData = [
            'title' => $event->title,
            'description' => $event->description,
            'event_date' => $event->event_date,
            'event_time' => $event->event_time,
            'venue' => $event->venue,
            'event_type' => $event->event_type,
            'theme_color' => $event->theme_color,
            'cover_image' => $event->cover_image,
            'dress_code' => $event->dress_code,
            'contact_name' => $event->contact_name,
            'contact_phone' => $event->contact_phone,
            'map_link' => $event->map_link,
            'status' => $event->status,
        ];

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
        $event->refresh();

        EventActivityLogger::record(
            event: $event,
            action: 'event_updated',
            description: "Event {$event->title} updated.",
            subject: $event,
            properties: [
                'event_id' => $event->id,
                'old' => $oldData,
                'new' => [
                    'title' => $event->title,
                    'description' => $event->description,
                    'event_date' => $event->event_date,
                    'event_time' => $event->event_time,
                    'venue' => $event->venue,
                    'event_type' => $event->event_type,
                    'theme_color' => $event->theme_color,
                    'cover_image' => $event->cover_image,
                    'dress_code' => $event->dress_code,
                    'contact_name' => $event->contact_name,
                    'contact_phone' => $event->contact_phone,
                    'map_link' => $event->map_link,
                    'status' => $event->status,
                ],
                'changed' => array_keys($event->getChanges()),
            ]
        );

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

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $eventData = [
            'event_id' => $event->id,
            'title' => $event->title,
            'description' => $event->description,
            'event_date' => $event->event_date,
            'event_time' => $event->event_time,
            'venue' => $event->venue,
            'event_type' => $event->event_type,
            'theme_color' => $event->theme_color,
            'cover_image' => $event->cover_image,
            'dress_code' => $event->dress_code,
            'contact_name' => $event->contact_name,
            'contact_phone' => $event->contact_phone,
            'map_link' => $event->map_link,
            'user_id' => $event->user_id,
            'status' => $event->status,
        ];

        EventActivityLogger::record(
            event: $event,
            action: 'event_deleted',
            description: "Event {$event->title} deleted.",
            subject: $event,
            properties: $eventData
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

        abort_unless($user, 403);

        if ($user->hasRole('Super Admin')) {
            return;
        }

        abort_unless((int) $event->user_id === (int) $user->id, 403);
    }

    private function preventClosedEventModification(Event $event): ?RedirectResponse
    {
        if (in_array($event->status, ['completed', 'cancelled'], true)) {
            return redirect()
                ->route('events.show', $event)
                ->with('error', 'This event is closed and cannot be modified.');
        }

        return null;
    }
}
