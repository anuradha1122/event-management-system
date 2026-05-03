<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventQuestionController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $questions = $event->questions()
            ->latest()
            ->get();

        return Inertia::render('Questions/Index', [
            'event' => $event,
            'questions' => $questions,
        ]);
    }

    public function create(Event $event): Response|RedirectResponse
    {
        $this->authorizeEventAccess($event);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        return Inertia::render('Questions/Create', [
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
            'question' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:text,textarea,number,select,radio'],
            'options' => ['nullable', 'string'],
            'is_required' => ['nullable', 'boolean'],
        ]);

        $options = null;

        if (in_array($validated['type'], ['select', 'radio'], true)) {
            $options = collect(explode("\n", $validated['options'] ?? ''))
                ->map(fn ($option) => trim($option))
                ->filter()
                ->values()
                ->toArray();

            if (count($options) === 0) {
                return back()
                    ->withErrors([
                        'options' => 'Options are required for select or radio questions.',
                    ])
                    ->withInput();
            }
        }

        EventQuestion::create([
            'event_id' => $event->id,
            'question' => $validated['question'],
            'type' => $validated['type'],
            'options' => $options,
            'is_required' => $request->boolean('is_required'),
        ]);

        return redirect()
            ->route('events.questions.index', $event)
            ->with('success', 'Question created successfully.');
    }

    public function destroy(Event $event, EventQuestion $question): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        abort_unless((int) $question->event_id === (int) $event->id, 403);

        if ($response = $this->preventClosedEventModification($event)) {
            return $response;
        }

        $question->delete();

        return redirect()
            ->route('events.questions.index', $event)
            ->with('success', 'Question deleted successfully.');
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
                ->route('events.questions.index', $event)
                ->with('error', 'This event is closed and RSVP questions cannot be modified.');
        }

        return null;
    }
}
