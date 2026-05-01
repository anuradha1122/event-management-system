import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { can } from '@/Utils/permissions';

export default function Show({ event }) {
    const { auth, flash } = usePage().props;

    const deleteEvent = () => {
        if (confirm('Delete this event?')) {
            router.delete(route('events.destroy', event.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={event.title} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded bg-green-100 p-4 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {event.title}
                            </h1>
                            <p className="text-sm text-gray-500">
                                Event details and invitation management
                            </p>
                        </div>

                        <Link
                            href={route('events.index')}
                            style={{
                                display: 'inline-flex',
                                backgroundColor: '#e5e7eb',
                                color: '#111827',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                fontWeight: '700',
                                textDecoration: 'none',
                            }}
                        >
                            Back
                        </Link>
                    </div>

                    <div className="rounded bg-white p-6 shadow">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-semibold text-gray-500">
                                    Date
                                </p>
                                <p className="text-gray-900">
                                    {event.event_date || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-500">
                                    Time
                                </p>
                                <p className="text-gray-900">
                                    {event.event_time || '-'}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm font-semibold text-gray-500">
                                    Venue
                                </p>
                                <p className="text-gray-900">
                                    {event.venue || '-'}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm font-semibold text-gray-500">
                                    Description
                                </p>
                                <p className="whitespace-pre-line text-gray-900">
                                    {event.description || '-'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <div className="rounded bg-gray-100 p-4">
                                <p className="text-sm text-gray-500">Guests</p>
                                <p className="text-2xl font-bold">
                                    {event.guests_count ?? 0}
                                </p>
                            </div>

                            <div className="rounded bg-gray-100 p-4">
                                <p className="text-sm text-gray-500">
                                    Invitations
                                </p>
                                <p className="text-2xl font-bold">
                                    {event.invitations_count ?? 0}
                                </p>
                            </div>

                            <div className="rounded bg-gray-100 p-4">
                                <p className="text-sm text-gray-500">
                                    Questions
                                </p>
                                <p className="text-2xl font-bold">
                                    {event.questions_count ?? 0}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {can(auth, 'update own events') && (
                                <Link
                                    href={route('events.edit', event.id)}
                                    style={{
                                        display: 'inline-flex',
                                        backgroundColor: '#111827',
                                        color: '#ffffff',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Edit Event
                                </Link>
                            )}

                            <Link
                                href={route('events.guests.index', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#2563eb',
                                    color: '#ffffff',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                Manage Guests
                            </Link>

                            <Link
                                href={route('events.questions.index', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#4f46e5',
                                    color: '#ffffff',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                RSVP Questions
                            </Link>

                            <Link
                                href={route('events.responses.index', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#059669',
                                    color: '#ffffff',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                View Responses
                            </Link>

                            <Link
                                href={route('events.analytics', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#4f46e5',
                                    color: '#ffffff',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                Analytics
                            </Link>

                            <Link
                                href={route('events.tasks.index', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#0f766e',
                                    color: '#ffffff',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                Planning Tasks
                            </Link>

                            <Link
                                href={route('events.expenses.index', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#7c3aed',
                                    color: '#ffffff',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                Budget / Expenses
                            </Link>

                            <Link
                                href={route('events.vendors.index', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#0891b2',
                                    color: '#ffffff',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                Vendors / Suppliers
                            </Link>

                            <Link
                                href={route('events.schedules.index', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#9333ea',
                                    color: '#ffffff',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                Schedule / Timeline
                            </Link>

                            {can(auth, 'delete own events') && (
                                <button
                                    type="button"
                                    onClick={deleteEvent}
                                    style={{
                                        display: 'inline-flex',
                                        backgroundColor: '#dc2626',
                                        color: '#ffffff',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Delete Event
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
