import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { can } from '@/Utils/permissions';

export default function Index({ events }) {
    const { auth, flash } = usePage().props;

    const deleteEvent = (eventId) => {
        if (confirm('Delete this event?')) {
            router.delete(route('events.destroy', eventId));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Events" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Events
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage your event invitations and RSVP tracking.
                            </p>
                        </div>

                        {can(auth, 'create events') && (
                            <Link
                                href={route('events.create')}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#111827',
                                    color: '#ffffff',
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                    border: '1px solid #111827',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                }}
                            >
                                Create Event
                            </Link>
                        )}
                    </div>

                    {flash?.success && (
                        <div className="mb-4 rounded bg-green-100 p-4 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-hidden rounded bg-white shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Venue
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {events.length > 0 ? (
                                    events.map((event) => (
                                        <tr key={event.id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {event.title}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {event.event_date || '-'}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {event.event_time || '-'}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {event.venue || '-'}
                                            </td>

                                            <td className="space-x-3 px-6 py-4 text-right text-sm">
                                                <Link
                                                    href={route('events.show', event.id)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View
                                                </Link>

                                                <Link
                                                    href={route('events.analytics', event.id)}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    Analytics
                                                </Link>

                                                {can(auth, 'update own events') && (
                                                    <Link
                                                        href={route('events.edit', event.id)}
                                                        className="text-amber-600 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}

                                                {can(auth, 'delete own events') && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteEvent(event.id)
                                                        }
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No events created yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
