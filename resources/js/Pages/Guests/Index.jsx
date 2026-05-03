import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { can } from '@/Utils/permissions';

export default function Index({ event = {}, guests = [] }) {
    const { auth, flash } = usePage().props;

    const safeAuth = auth || {};
const safeEvent = event || {};
const safeGuests = Array.isArray(guests) ? guests : [];

const routeExists = (name, params = undefined) => {
    try {
        route(name, params);
        return true;
    } catch (error) {
        return false;
    }
};

console.log('Event:', safeEvent);
console.log('Event ID:', safeEvent.id);
console.log(
    'Route create guest:',
    safeEvent.id ? routeExists('events.guests.create', safeEvent.id) : false
);
console.log(
    'Route import CSV:',
    safeEvent.id ? routeExists('events.guests.import.create', safeEvent.id) : false
);
console.log(
    'Route send all:',
    safeEvent.id ? routeExists('events.guests.send-all-invitations', safeEvent.id) : false
);
console.log('Can create guests:', can(safeAuth, 'create guests'));


    const deleteGuest = (guestId) => {
        if (!safeEvent.id || !guestId) {
            alert('Missing event or guest ID.');
            return;
        }

        if (confirm('Delete this guest?')) {
            router.delete(route('events.guests.destroy', [safeEvent.id, guestId]));
        }
    };

    const inviteUrl = (token) => {
        return `${window.location.origin}/invitation/${token}`;
    };

    const copyInviteLink = async (token) => {
        if (!token) {
            alert('Invitation token is missing.');
            return;
        }

        await navigator.clipboard.writeText(inviteUrl(token));
        alert('Invitation link copied.');
    };

    const sendInvitation = (guestId) => {
        if (!safeEvent.id || !guestId) {
            alert('Missing event or guest ID.');
            return;
        }

        if (!routeExists('events.guests.send-invitation', [safeEvent.id, guestId])) {
            alert('Send invitation route is missing.');
            return;
        }

        if (confirm('Send invitation email to this guest?')) {
            router.post(route('events.guests.send-invitation', [safeEvent.id, guestId]));
        }
    };

    const sendAllInvitations = () => {
        if (!safeEvent.id) {
            alert('Missing event ID.');
            return;
        }

        if (!routeExists('events.guests.send-all-invitations', safeEvent.id)) {
            alert('Send all invitations route is missing.');
            return;
        }

        if (confirm('Send invitation emails to all pending guests with email addresses?')) {
            router.post(route('events.guests.send-all-invitations', safeEvent.id));
        }
    };

    const whatsappUrl = (guest) => {
        if (!guest?.phone || !guest?.invitation?.token) {
            return '#';
        }

        let phone = guest.phone.replace(/\D/g, '');

        if (phone.startsWith('0')) {
            phone = `94${phone.substring(1)}`;
        }

        const message = `Dear ${guest.name || 'Guest'}, you are invited to ${safeEvent.title || 'our event'}. Please open your invitation and RSVP here: ${inviteUrl(guest.invitation.token)}`;

        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    const formatDateTime = (value) => {
        if (!value) {
            return null;
        }

        return new Date(value).toLocaleString();
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Guests - ${safeEvent.title || 'Event'}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded bg-green-100 p-4 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-4 rounded bg-red-100 p-4 text-sm text-red-800">
                            {flash.error}
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Guests
                            </h1>

                            <p className="text-sm text-gray-500">
                                Event: {safeEvent.title || '-'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {safeEvent.id && routeExists('events.show', safeEvent.id) && (
                                <Link
                                    href={route('events.show', safeEvent.id)}
                                    style={{
                                        display: 'inline-flex',
                                        backgroundColor: '#e5e7eb',
                                        color: '#111827',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Back to Event
                                </Link>
                            )}

                            {can(safeAuth, 'create guests') && (
                                <>
                                    {routeExists('events.guests.send-all-invitations', safeEvent.id) && (
                                        <button
                                            type="button"
                                            onClick={sendAllInvitations}
                                            style={{
                                                display: 'inline-flex',
                                                backgroundColor: '#059669',
                                                color: '#ffffff',
                                                padding: '10px 16px',
                                                borderRadius: '8px',
                                                fontWeight: '700',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Send All Invitations
                                        </button>
                                    )}

                                    {routeExists('events.guests.import.create', safeEvent.id) && (
                                        <Link
                                            href={route('events.guests.import.create', safeEvent.id)}
                                            style={{
                                                display: 'inline-flex',
                                                backgroundColor: '#7C3AED',
                                                color: '#ffffff',
                                                padding: '10px 16px',
                                                borderRadius: '8px',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            Import CSV
                                        </Link>
                                    )}

                                    {safeEvent.id && routeExists('events.guests.create', safeEvent.id) && (
                                        <Link
                                            href={route('events.guests.create', safeEvent.id)}
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
                                            Add Guest
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded bg-white shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Guest
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Count
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Sent
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Invitation
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {safeGuests.length > 0 ? (
                                    safeGuests.map((guest) => (
                                        <tr key={guest.id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {guest.name || '-'}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div>{guest.email || '-'}</div>
                                                <div>{guest.phone || '-'}</div>
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        padding: '4px 10px',
                                                        borderRadius: '999px',
                                                        backgroundColor:
                                                            guest.status === 'accepted'
                                                                ? '#dcfce7'
                                                                : guest.status === 'declined'
                                                                  ? '#fee2e2'
                                                                  : '#fef3c7',
                                                        color:
                                                            guest.status === 'accepted'
                                                                ? '#166534'
                                                                : guest.status === 'declined'
                                                                  ? '#991b1b'
                                                                  : '#92400e',
                                                        fontWeight: '700',
                                                    }}
                                                >
                                                    {guest.status || 'pending'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {guest.guest_count ?? 1}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {guest.invitation?.sent_at ? (
                                                    <div>
                                                        <div style={{ fontWeight: '700', color: '#166534' }}>
                                                            Sent
                                                        </div>

                                                        <div className="text-xs text-gray-500">
                                                            {formatDateTime(guest.invitation.sent_at)}
                                                        </div>

                                                        <div className="text-xs text-gray-500">
                                                            Count: {guest.invitation.sent_count ?? 0}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#92400e', fontWeight: '700' }}>
                                                        Not sent
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {guest.invitation?.token ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                copyInviteLink(
                                                                    guest.invitation.token
                                                                )
                                                            }
                                                            style={{
                                                                backgroundColor: '#2563eb',
                                                                color: '#ffffff',
                                                                padding: '7px 12px',
                                                                borderRadius: '8px',
                                                                fontWeight: '700',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            Copy Link
                                                        </button>

                                                        {guest.phone && (
                                                            <a
                                                                href={whatsappUrl(guest)}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                style={{
                                                                    backgroundColor: '#16a34a',
                                                                    color: '#ffffff',
                                                                    padding: '7px 12px',
                                                                    borderRadius: '8px',
                                                                    fontWeight: '700',
                                                                    textDecoration: 'none',
                                                                }}
                                                            >
                                                                WhatsApp
                                                            </a>
                                                        )}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right text-sm">
                                                <div className="flex justify-end gap-3">
                                                    {guest.email &&
                                                        guest.invitation?.token &&
                                                        routeExists('events.guests.send-invitation', [safeEvent.id, guest.id]) && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    sendInvitation(guest.id)
                                                                }
                                                                style={{
                                                                    color: '#2563eb',
                                                                    fontWeight: '700',
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                Send Email
                                                            </button>
                                                        )}

                                                    {can(safeAuth, 'delete guests') && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteGuest(guest.id)
                                                            }
                                                            style={{
                                                                color: '#dc2626',
                                                                fontWeight: '700',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No guests added yet.
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
