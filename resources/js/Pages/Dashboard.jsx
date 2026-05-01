import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { can, hasRole } from '@/Utils/permissions';

export default function Dashboard({ summary, recentEvents }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-gray-600">
                                Welcome, {auth.user?.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Role: {auth.roles?.join(', ') || 'No role'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {can(auth, 'view own events') && (
                                <Link
                                    href={route('events.index')}
                                    style={buttonStyle('#111827')}
                                >
                                    Manage Events
                                </Link>
                            )}

                            {can(auth, 'create events') && (
                                <Link
                                    href={route('events.create')}
                                    style={buttonStyle('#2563eb')}
                                >
                                    Create Event
                                </Link>
                            )}
                        </div>
                    </div>

                    {hasRole(auth, 'Super Admin') && (
                        <div
                            style={{
                                marginBottom: '24px',
                                borderRadius: '12px',
                                backgroundColor: '#eff6ff',
                                color: '#1d4ed8',
                                padding: '14px 16px',
                                fontWeight: '700',
                            }}
                        >
                            Super Admin view: showing system-wide event statistics.
                        </div>
                    )}

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '16px',
                            marginBottom: '28px',
                        }}
                    >
                        <SummaryCard
                            label="Total Events"
                            value={summary.total_events}
                            background="#f9fafb"
                            color="#111827"
                        />

                        <SummaryCard
                            label="Total Guests"
                            value={summary.total_guests}
                            background="#f3f4f6"
                            color="#111827"
                        />

                        <SummaryCard
                            label="Accepted"
                            value={summary.accepted}
                            background="#dcfce7"
                            color="#166534"
                        />

                        <SummaryCard
                            label="Declined"
                            value={summary.declined}
                            background="#fee2e2"
                            color="#991b1b"
                        />

                        <SummaryCard
                            label="Pending"
                            value={summary.pending}
                            background="#fef3c7"
                            color="#92400e"
                        />

                        <SummaryCard
                            label="Extra Guests"
                            value={summary.extra_guests}
                            background="#dbeafe"
                            color="#1d4ed8"
                        />
                    </div>

                    <div className="rounded bg-white shadow">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Recent Events
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Latest created events and quick access.
                                </p>
                            </div>

                            {can(auth, 'view own events') && (
                                <Link
                                    href={route('events.index')}
                                    style={{
                                        color: '#2563eb',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                    }}
                                >
                                    View All
                                </Link>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Venue
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Guests
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Invitations
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Questions
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {recentEvents.length > 0 ? (
                                        recentEvents.map((event) => (
                                            <tr key={event.id}>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    {event.title}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {event.event_date || '-'}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {event.venue || '-'}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {event.guests_count ?? 0}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {event.invitations_count ?? 0}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {event.questions_count ?? 0}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                    <Link
                                                        href={route(
                                                            'events.show',
                                                            event.id
                                                        )}
                                                        style={{
                                                            color: '#2563eb',
                                                            fontWeight: '700',
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
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

                    <div
                        style={{
                            marginTop: '24px',
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: '16px',
                        }}
                    >
                        <QuickActionCard
                            title="Create an Event"
                            description="Start a new wedding, meeting, party, or gathering invitation."
                            href={route('events.create')}
                            visible={can(auth, 'create events')}
                            buttonText="Create Event"
                        />

                        <QuickActionCard
                            title="Manage Guests"
                            description="Open an event and add guests to generate invitation links."
                            href={route('events.index')}
                            visible={can(auth, 'view guests')}
                            buttonText="Go to Events"
                        />

                        <QuickActionCard
                            title="View Responses"
                            description="Track RSVP status, guest counts, and custom question answers."
                            href={route('events.index')}
                            visible={can(auth, 'view responses')}
                            buttonText="View Events"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SummaryCard({ label, value, background, color }) {
    return (
        <div
            style={{
                backgroundColor: background,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
            }}
        >
            <p
                style={{
                    color: '#6b7280',
                    fontSize: '13px',
                    fontWeight: '700',
                    marginBottom: '8px',
                }}
            >
                {label}
            </p>

            <p
                style={{
                    color,
                    fontSize: '34px',
                    fontWeight: '900',
                    lineHeight: '1',
                }}
            >
                {value}
            </p>
        </div>
    );
}

function QuickActionCard({ title, description, href, visible, buttonText }) {
    if (!visible) {
        return null;
    }

    return (
        <div
            style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
            }}
        >
            <h3
                style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#111827',
                    marginBottom: '8px',
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                }}
            >
                {description}
            </p>

            <Link href={href} style={buttonStyle('#111827')}>
                {buttonText}
            </Link>
        </div>
    );
}

function buttonStyle(backgroundColor) {
    return {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        color: '#ffffff',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '700',
        textDecoration: 'none',
        border: `1px solid ${backgroundColor}`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    };
}
