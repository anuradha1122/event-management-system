<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventTask;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventTaskController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        $tasks = EventTask::query()
            ->where('event_id', $event->id)
            ->orderByRaw("
                CASE priority
                    WHEN 'high' THEN 1
                    WHEN 'medium' THEN 2
                    WHEN 'low' THEN 3
                    ELSE 4
                END
            ")
            ->orderByRaw("
                CASE status
                    WHEN 'pending' THEN 1
                    WHEN 'in_progress' THEN 2
                    WHEN 'done' THEN 3
                    ELSE 4
                END
            ")
            ->orderBy('due_date')
            ->latest()
            ->get();

        $totalTasks = $tasks->count();
        $pendingTasks = $tasks->where('status', 'pending')->count();
        $inProgressTasks = $tasks->where('status', 'in_progress')->count();
        $doneTasks = $tasks->where('status', 'done')->count();

        $completionPercentage = $totalTasks > 0
            ? round(($doneTasks / $totalTasks) * 100)
            : 0;

        return Inertia::render('EventTasks/Index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'event_date' => $event->event_date,
                'venue' => $event->venue,
            ],
            'tasks' => $tasks->map(function (EventTask $task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'due_date' => $task->due_date?->format('Y-m-d'),
                    'assigned_to' => $task->assigned_to,
                    'completed_at' => $task->completed_at?->format('Y-m-d H:i'),
                ];
            }),
            'summary' => [
                'total' => $totalTasks,
                'pending' => $pendingTasks,
                'in_progress' => $inProgressTasks,
                'done' => $doneTasks,
                'completion_percentage' => $completionPercentage,
            ],
        ]);
    }

    public function create(Event $event): Response
    {
        $this->authorizeEventAccess($event);

        return Inertia::render('EventTasks/Create', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
            ],
        ]);
    }

    public function store(Request $request, Event $event): RedirectResponse
    {
        $this->authorizeEventAccess($event);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,done'],
            'priority' => ['required', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date'],
            'assigned_to' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['event_id'] = $event->id;

        if ($validated['status'] === 'done') {
            $validated['completed_at'] = now();
        }

        EventTask::create($validated);

        return redirect()
            ->route('events.tasks.index', $event->id)
            ->with('success', 'Task created successfully.');
    }

    public function edit(Event $event, EventTask $task): Response
    {
        $this->authorizeEventAccess($event);
        $this->ensureTaskBelongsToEvent($event, $task);

        return Inertia::render('EventTasks/Edit', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
            ],
            'task' => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'priority' => $task->priority,
                'due_date' => $task->due_date?->format('Y-m-d'),
                'assigned_to' => $task->assigned_to,
            ],
        ]);
    }

    public function update(Request $request, Event $event, EventTask $task): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureTaskBelongsToEvent($event, $task);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,done'],
            'priority' => ['required', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date'],
            'assigned_to' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validated['status'] === 'done' && $task->status !== 'done') {
            $validated['completed_at'] = now();
        }

        if ($validated['status'] !== 'done') {
            $validated['completed_at'] = null;
        }

        $task->update($validated);

        return redirect()
            ->route('events.tasks.index', $event->id)
            ->with('success', 'Task updated successfully.');
    }

    public function markDone(Event $event, EventTask $task): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureTaskBelongsToEvent($event, $task);

        $task->update([
            'status' => 'done',
            'completed_at' => now(),
        ]);

        return redirect()
            ->route('events.tasks.index', $event->id)
            ->with('success', 'Task marked as done.');
    }

    public function destroy(Event $event, EventTask $task): RedirectResponse
    {
        $this->authorizeEventAccess($event);
        $this->ensureTaskBelongsToEvent($event, $task);

        $task->delete();

        return redirect()
            ->route('events.tasks.index', $event->id)
            ->with('success', 'Task deleted successfully.');
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = auth()->user();

        if ($user->hasRole('Super Admin')) {
            return;
        }

        if ((int) $event->user_id !== (int) $user->id) {
            abort(403);
        }
    }

    private function ensureTaskBelongsToEvent(Event $event, EventTask $task): void
    {
        if ((int) $task->event_id !== (int) $event->id) {
            abort(404);
        }
    }
}
