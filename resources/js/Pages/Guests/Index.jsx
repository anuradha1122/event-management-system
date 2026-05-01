import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { can } from '@/Utils/permissions';

export default function Index({ event, guests }) {
    const { auth, flash } = usePage().props;

    const deleteGuest = (guestId) => {
        if (confirm('Delete this guest?')) {
            router.delete(route('events.guests.destroy', [event.id, guestId]));
        }
    };

    const inviteUrl = (token) => {
        return `${window.location.origin}/invite/${token}`;
    };

    const copyInviteLink = async (token) => {
        await navigator.clipboard.writeText(inviteUrl(token));
        alert('Invitation link copied.');
    };

    const sendInvitation = (guestId) => {
        if (confirm('Send invitation email to this guest?')) {
            router.post(route('events.guests.send-invitation', [event.id, guestId]));
        }
    };

    const sendAllInvitations = () => {
        if (confirm('Send invitation emails to all pending guests with email addresses?')) {
            router.post(route('events.guests.send-all-invitations', event.id));
        }
    };

    const whatsappUrl = (guest) => {
        if (!guest.phone || !guest.invitation) {
            return '#';
        }

        let phone = guest.phone.replace(/\D/g, '');

        if (phone.startsWith('0')) {
            phone = `94${phone.substring(1)}`;
        }

        const message = `Dear ${guest.name}, you are invited to ${event.title}. Please open your invitation and RSVP here: ${inviteUrl(guest.invitation.token)}`;

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
            <Head title={`Guests - ${event.title}`} />

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
                                Event: {event.title}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={route('events.show', event.id)}
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

                            {can(auth, 'create guests') && (
                                <>
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

                                    <Link
                                        href={route('events.guests.import.create', event.id)}
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

                                    <Link
                                        href={route('events.guests.create', event.id)}
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
                                {guests.length > 0 ? (
                                    guests.map((guest) => (
                                        <tr key={guest.id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {guest.name}
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
                                                    {guest.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {guest.guest_count}
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
                                                            Count: {guest.invitation.sent_count}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#92400e', fontWeight: '700' }}>
                                                        Not sent
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {guest.invitation ? (
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
                                                    {guest.email && guest.invitation && (
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

                                                    {can(auth, 'delete guests') && (
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
