import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { can } from '@/Utils/permissions';

export default function Show({ event }) {
    const { auth, flash } = usePage().props;

    const currentStatus = event.status || 'draft';
    const isClosed = currentStatus === 'completed' || currentStatus === 'cancelled';

    const buttonClass =
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold text-white shadow transition hover:opacity-90';

    const secondaryButtonClass =
        'inline-flex items-center justify-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-900 transition hover:bg-gray-300';

    const dangerButtonClass =
        'inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-red-700';

    const statusStyle = (status) => {
        const styles = {
            draft: {
                backgroundColor: '#fef3c7',
                color: '#92400e',
                border: '1px solid #f59e0b',
            },
            active: {
                backgroundColor: '#dcfce7',
                color: '#166534',
                border: '1px solid #22c55e',
            },
            completed: {
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                border: '1px solid #3b82f6',
            },
            cancelled: {
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                border: '1px solid #ef4444',
            },
        };

        return {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: '800',
            textTransform: 'capitalize',
            ...(styles[status] || styles.draft),
        };
    };

    const formatDateTime = (value) => {
        if (!value) {
            return '';
        }

        return new Date(value).toLocaleString();
    };

    const deleteEvent = () => {
        if (confirm('Delete this event?')) {
            router.delete(route('events.destroy', event.id));
        }
    };

    const changeEventStatus = (url, message) => {
        if (!confirm(message)) {
            return;
        }

        router.patch(
            url,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const ActionLink = ({ href, children, color = 'bg-blue-600', external = false }) => {
        if (external) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${buttonClass} ${color}`}
                >
                    {children}
                </a>
            );
        }

        return (
            <Link href={href} className={`${buttonClass} ${color}`}>
                {children}
            </Link>
        );
    };

    const ActionSection = ({ title, description, children }) => (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-extrabold text-gray-900">{title}</h3>
                {description && (
                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                )}
            </div>

            <div className="flex flex-wrap gap-3">{children}</div>
        </div>
    );

    const InfoItem = ({ label, value, wide = false }) => (
        <div className={wide ? 'md:col-span-2' : ''}>
            <p className="text-sm font-semibold text-gray-500">{label}</p>
            <p className="whitespace-pre-line text-gray-900">{value || '-'}</p>
        </div>
    );

    const StatCard = ({ label, value }) => (
        <div className="rounded-xl bg-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-extrabold text-gray-900">
                {value ?? 0}
            </p>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title={event.title} />

            <div className="py-10">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded-lg bg-green-100 p-4 text-sm font-semibold text-green-800">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm font-semibold text-red-800">
                            {flash.error}
                        </div>
                    )}

                    {flash?.info && (
                        <div className="mb-4 rounded-lg bg-blue-100 p-4 text-sm font-semibold text-blue-800">
                            {flash.info}
                        </div>
                    )}

                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-extrabold text-gray-900">
                                    {event.title}
                                </h1>

                                <span style={statusStyle(currentStatus)}>
                                    {currentStatus}
                                </span>
                            </div>

                            <p className="text-sm text-gray-500">
                                Event details, guest management, planning, reports, and lifecycle controls.
                            </p>
                        </div>

                        <Link
                            href={route('events.index')}
                            className={secondaryButtonClass}
                        >
                            Back to Events
                        </Link>
                    </div>

                    {isClosed && (
                        <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
                            <strong>This event is closed.</strong> You can still view pages and generate reports,
                            but modification actions should be blocked by the system.
                        </div>
                    )}

                    <div className="mb-6 grid gap-6 lg:grid-cols-3">
                        <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">
                            <h2 className="mb-4 text-xl font-extrabold text-gray-900">
                                Event Information
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <InfoItem label="Date" value={event.event_date} />
                                <InfoItem label="Time" value={event.event_time} />
                                <InfoItem label="Venue" value={event.venue} wide />
                                <InfoItem label="Description" value={event.description} wide />
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <h2 className="mb-4 text-xl font-extrabold text-gray-900">
                                Status Details
                            </h2>

                            <div className="space-y-3 text-sm text-gray-700">
                                <div>
                                    <p className="font-semibold text-gray-500">Current Status</p>
                                    <div className="mt-1">
                                        <span style={statusStyle(currentStatus)}>
                                            {currentStatus}
                                        </span>
                                    </div>
                                </div>

                                {event.completed_at && (
                                    <div>
                                        <p className="font-semibold text-gray-500">Completed</p>
                                        <p>
                                            {formatDateTime(event.completed_at)}
                                            {event.completed_by?.name
                                                ? ` by ${event.completed_by.name}`
                                                : ''}
                                        </p>
                                    </div>
                                )}

                                {event.cancelled_at && (
                                    <div>
                                        <p className="font-semibold text-gray-500">Cancelled</p>
                                        <p>
                                            {formatDateTime(event.cancelled_at)}
                                            {event.cancelled_by?.name
                                                ? ` by ${event.cancelled_by.name}`
                                                : ''}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        <StatCard label="Guests" value={event.guests_count} />
                        <StatCard label="Invitations" value={event.invitations_count} />
                        <StatCard label="Questions" value={event.questions_count} />
                    </div>

                    <div className="space-y-6">
                        <ActionSection
                            title="Main Event Actions"
                            description="Basic event details and analytics."
                        >
                            {can(auth, 'update own events') && !isClosed && (
                                <ActionLink
                                    href={route('events.edit', event.id)}
                                    color="bg-gray-900"
                                >
                                    Edit Event
                                </ActionLink>
                            )}

                            <ActionLink
                                href={route('events.dashboard', event.id)}
                                color="bg-orange-600"
                            >
                                Event Dashboard
                            </ActionLink>

                            <ActionLink
                                href={route('events.analytics', event.id)}
                                color="bg-indigo-600"
                            >
                                Analytics
                            </ActionLink>
                        </ActionSection>

                        <ActionSection
                            title="Guest & RSVP"
                            description="Manage invitees, RSVP questions, guest answers, and event attendance."
                        >
                            <ActionLink
                                href={route('events.guests.index', event.id)}
                                color="bg-blue-600"
                            >
                                Manage Guests
                            </ActionLink>

                            <ActionLink
                                href={route('events.questions.index', event.id)}
                                color="bg-indigo-600"
                            >
                                RSVP Questions
                            </ActionLink>

                            <ActionLink
                                href={route('events.responses.index', event.id)}
                                color="bg-emerald-600"
                            >
                                View Responses
                            </ActionLink>

                            <ActionLink
                                href={route('events.check-in.index', event.id)}
                                color="bg-green-600"
                            >
                                Guest Check-In
                            </ActionLink>
                        </ActionSection>

                        <ActionSection
                            title="Planning"
                            description="Manage the operational side of the event."
                        >
                            <ActionLink
                                href={route('events.tasks.index', event.id)}
                                color="bg-teal-700"
                            >
                                Planning Tasks
                            </ActionLink>

                            <ActionLink
                                href={route('events.expenses.index', event.id)}
                                color="bg-purple-700"
                            >
                                Budget / Expenses
                            </ActionLink>

                            <ActionLink
                                href={route('events.vendors.index', event.id)}
                                color="bg-cyan-700"
                            >
                                Vendors / Suppliers
                            </ActionLink>

                            <ActionLink
                                href={route('events.schedules.index', event.id)}
                                color="bg-fuchsia-700"
                            >
                                Schedule / Timeline
                            </ActionLink>

                            <ActionLink
                                href={route('events.staff.index', event.id)}
                                color="bg-teal-600"
                            >
                                Staff Assignment
                            </ActionLink>
                        </ActionSection>

                        <ActionSection
                            title="Communication"
                            description="Follow-ups, reminders, notifications, and guest interaction records."
                        >
                            <ActionLink
                                href={route('events.guest-follow-ups.index', event.id)}
                                color="bg-cyan-600"
                            >
                                Guest Follow-Ups
                            </ActionLink>

                            <ActionLink
                                href={route('events.reminders.index', event.id)}
                                color="bg-purple-600"
                            >
                                Reminders
                            </ActionLink>

                            <ActionLink
                                href={route('events.reminder-logs.index', event.id)}
                                color="bg-fuchsia-600"
                            >
                                Reminder Logs
                            </ActionLink>

                            <ActionLink
                                href={route('notifications.index', { event_id: event.id })}
                                color="bg-violet-600"
                            >
                                Event Notifications
                            </ActionLink>
                        </ActionSection>

                        <ActionSection
                            title="Reports & Documentation"
                            description="Final reports, manuals, and project summary documents."
                        >
                            <ActionLink
                                href={route('events.final-report.pdf', event.id)}
                                color="bg-green-600"
                                external
                            >
                                Final Report PDF
                            </ActionLink>

                            <ActionLink
                                href={route('events.project-summary', event.id)}
                                color="bg-slate-900"
                            >
                                Project Summary
                            </ActionLink>

                            <ActionLink
                                href={route('events.organizer-manual', event.id)}
                                color="bg-indigo-700"
                            >
                                Organizer Manual
                            </ActionLink>

                            <ActionLink
                                href={route('events.organizer-manual.pdf', event.id)}
                                color="bg-cyan-700"
                                external
                            >
                                Manual PDF
                            </ActionLink>
                        </ActionSection>

                        <ActionSection
                            title="Audit & Testing"
                            description="Quality checks and activity tracking."
                        >
                            <ActionLink
                                href={route('events.qa-checklist.index', event.id)}
                                color="bg-rose-700"
                            >
                                QA Checklist
                            </ActionLink>

                            <ActionLink
                                href={route('events.activity-logs.index', event.id)}
                                color="bg-gray-900"
                            >
                                Activity Logs
                            </ActionLink>
                        </ActionSection>

                        <ActionSection
                            title="Event Lifecycle"
                            description="Change the event status. Use carefully, because yes, status buttons are tiny chaos levers."
                        >
                            {(currentStatus === 'draft' || !event.status) && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        changeEventStatus(
                                            route('events.activate', event.id),
                                            'Mark this event as active?',
                                        )
                                    }
                                    className={`${buttonClass} bg-green-600`}
                                >
                                    Mark Active
                                </button>
                            )}

                            {!isClosed && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeEventStatus(
                                                route('events.complete', event.id),
                                                'Mark this event as completed?',
                                            )
                                        }
                                        className={`${buttonClass} bg-blue-600`}
                                    >
                                        Complete Event
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeEventStatus(
                                                route('events.cancel', event.id),
                                                'Cancel this event?',
                                            )
                                        }
                                        className={`${buttonClass} bg-red-600`}
                                    >
                                        Cancel Event
                                    </button>
                                </>
                            )}

                            {isClosed && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        changeEventStatus(
                                            route('events.reopen', event.id),
                                            'Reopen this event and mark it as active?',
                                        )
                                    }
                                    className={`${buttonClass} bg-purple-700`}
                                >
                                    Reopen Event
                                </button>
                            )}
                        </ActionSection>

                        {can(auth, 'delete own events') && !isClosed && (
                            <ActionSection
                                title="Danger Zone"
                                description="Permanent destructive actions. Tiny red button, enormous consequences. Charming."
                            >
                                <button
                                    type="button"
                                    onClick={deleteEvent}
                                    className={dangerButtonClass}
                                >
                                    Delete Event
                                </button>
                            </ActionSection>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
