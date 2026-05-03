<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventActivityLog;
use App\Models\EventGuest;
use App\Models\EventInvitation;
use App\Models\EventQuestion;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class SuperAdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        $filters = [
            'search' => $request->input('search'),
            'role' => $request->input('role'),
        ];

        $users = User::query()
            ->with('roles:id,name')
            ->withCount('events')
            ->when($filters['search'], function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($filters['role'], function ($query, $role) {
                $query->whereHas('roles', function ($roleQuery) use ($role) {
                    $roleQuery->where('name', $role);
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => optional($user->created_at)->format('Y-m-d H:i'),
                'roles' => $user->roles->pluck('name')->values()->toArray(),
                'events_count' => $user->events_count ?? 0,
                'guest_count' => $this->guestCountForUser($user->id),
                'invitation_count' => $this->invitationCountForUser($user->id),
                'question_count' => $this->questionCountForUser($user->id),
                'activity_log_count' => $this->activityLogCountForUser($user->id),
                'latest_event' => $this->latestEventForUser($user->id),
            ]);

        return Inertia::render('SuperAdminUsers/Index', [
            'users' => $users,
            'filters' => $filters,
            'roleOptions' => $this->roleOptions(),
            'summary' => $this->summary(),
        ]);
    }

    public function create(): Response
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        $roles = Role::query()
            ->whereIn('name', [
                'Organizer',
                'Event Staff',
            ])
            ->orderBy('name')
            ->pluck('name')
            ->values();

        return Inertia::render('SuperAdminUsers/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
            'role' => [
                'required',
                'string',
                Rule::exists('roles', 'name'),
            ],
        ]);

        $allowedRoles = [
            'Organizer',
            'Event Staff',
        ];

        abort_unless(in_array($validated['role'], $allowedRoles, true), 403);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        $user->syncRoles([$validated['role']]);

        return redirect()
            ->route('super-admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        $roles = Role::query()
            ->whereIn('name', [
                'Super Admin',
                'Organizer',
                'Event Staff',
            ])
            ->orderBy('name')
            ->pluck('name')
            ->values();

        return Inertia::render('SuperAdminUsers/Edit', [
            'selectedUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles()->pluck('name')->first(),
            ],
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'role' => [
                'required',
                'string',
                Rule::exists('roles', 'name'),
            ],
        ]);

        $allowedRoles = [
            'Super Admin',
            'Organizer',
            'Event Staff',
        ];

        abort_unless(in_array($validated['role'], $allowedRoles, true), 403);

        if ($user->id === auth()->id() && $validated['role'] !== 'Super Admin') {
            return back()->with('error', 'You cannot remove your own Super Admin role.');
        }

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $user->syncRoles([$validated['role']]);

        return redirect()
            ->route('super-admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function editPassword(User $user): Response
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        return Inertia::render('SuperAdminUsers/ChangePassword', [
            'selectedUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function updatePassword(Request $request, User $user): RedirectResponse
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        $validated = $request->validate([
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()
            ->route('super-admin.users.index')
            ->with('success', 'Password changed successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_unless(auth()->user()?->hasRole('Super Admin'), 403);

        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        if ($user->hasRole('Super Admin')) {
            $superAdminCount = User::role('Super Admin')->count();

            if ($superAdminCount <= 1) {
                return back()->with('error', 'You cannot delete the last Super Admin.');
            }
        }

        $user->delete();

        return redirect()
            ->route('super-admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    private function roleOptions(): array
    {
        if (!Schema::hasTable('roles')) {
            return [];
        }

        return Role::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($role) => [
                'id' => $role->id,
                'name' => $role->name,
            ])
            ->toArray();
    }

    private function summary(): array
    {
        return [
            'total_users' => Schema::hasTable('users') ? User::query()->count() : 0,
            'super_admins' => $this->roleUserCount('Super Admin'),
            'organizers' => Schema::hasTable('users') && Schema::hasTable('events')
                ? User::query()->whereHas('events')->count()
                : 0,
            'users_without_events' => Schema::hasTable('users') && Schema::hasTable('events')
                ? User::query()->whereDoesntHave('events')->count()
                : 0,
            'total_events' => Schema::hasTable('events') ? Event::query()->count() : 0,
            'total_guests' => Schema::hasTable('event_guests') ? EventGuest::query()->count() : 0,
            'total_invitations' => Schema::hasTable('event_invitations') ? EventInvitation::query()->count() : 0,
            'total_questions' => Schema::hasTable('event_questions') ? EventQuestion::query()->count() : 0,
        ];
    }

    private function roleUserCount(string $roleName): int
    {
        try {
            if (!Schema::hasTable('users') || !Schema::hasTable('roles')) {
                return 0;
            }

            return User::role($roleName)->count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function guestCountForUser(int $userId): int
    {
        try {
            if (!Schema::hasTable('events') || !Schema::hasTable('event_guests')) {
                return 0;
            }

            return EventGuest::query()
                ->whereIn(
                    'event_id',
                    Event::query()
                        ->where('user_id', $userId)
                        ->select('id')
                )
                ->count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function invitationCountForUser(int $userId): int
    {
        try {
            if (!Schema::hasTable('events') || !Schema::hasTable('event_invitations')) {
                return 0;
            }

            return EventInvitation::query()
                ->whereIn(
                    'event_id',
                    Event::query()
                        ->where('user_id', $userId)
                        ->select('id')
                )
                ->count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function questionCountForUser(int $userId): int
    {
        try {
            if (!Schema::hasTable('events') || !Schema::hasTable('event_questions')) {
                return 0;
            }

            return EventQuestion::query()
                ->whereIn(
                    'event_id',
                    Event::query()
                        ->where('user_id', $userId)
                        ->select('id')
                )
                ->count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function activityLogCountForUser(int $userId): int
    {
        try {
            if (!Schema::hasTable('event_activity_logs')) {
                return 0;
            }

            return EventActivityLog::query()
                ->where('user_id', $userId)
                ->count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function latestEventForUser(int $userId): ?array
    {
        try {
            if (!Schema::hasTable('events')) {
                return null;
            }

            $event = Event::query()
                ->where('user_id', $userId)
                ->latest()
                ->first([
                    'id',
                    'title',
                    'status',
                    'event_date',
                    'created_at',
                ]);

            if (!$event) {
                return null;
            }

            return [
                'id' => $event->id,
                'title' => $event->title,
                'status' => $event->status ?? 'draft',
                'event_date' => optional($event->event_date)->format('Y-m-d'),
                'created_at' => optional($event->created_at)->format('Y-m-d H:i'),
            ];
        } catch (\Throwable) {
            return null;
        }
    }
}
