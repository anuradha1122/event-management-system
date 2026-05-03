import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({
    auth,
    event,
    guests,
    summary,
    charts,
    filters,
    filterOptions,
}) {
    const { flash } = usePage().props;

    const [selectedGuestIds, setSelectedGuestIds] = useState([]);
    const [bulkMessage, setBulkMessage] = useState(
        'Hello, this is a reminder regarding your event invitation. Please check and respond when possible.'
    );
    const [bulkNote, setBulkNote] = useState('');

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
        response_status: filters?.response_status || '',
        checkin_status: filters?.checkin_status || '',
        followup_status: filters?.followup_status || '',
    });

    const currentPageGuestIds = useMemo(() => {
        return (guests.data || []).map((guest) => guest.id);
    }, [guests.data]);

    const allCurrentPageSelected =
        currentPageGuestIds.length > 0 &&
        currentPageGuestIds.every((id) => selectedGuestIds.includes(id));

    const applyFilters = (e) => {
        e.preventDefault();

        get(route('events.guest-follow-ups.index', event.id), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onSuccess: () => {
                setSelectedGuestIds([]);
            },
        });
    };

    const clearFilters = () => {
        router.get(
            route('events.guest-follow-ups.index', event.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onSuccess: () => {
                    setSelectedGuestIds([]);
                },
            }
        );
    };

    const exportUrl = (type) => {
        return (
            route('events.guest-follow-ups.export', event.id) +
            buildQueryString({
                ...data,
                type,
            })
        );
    };

    const toggleGuest = (guestId) => {
        setSelectedGuestIds((current) => {
            if (current.includes(guestId)) {
                return current.filter((id) => id !== guestId);
            }

            return [...current, guestId];
        });
    };

    const toggleCurrentPage = () => {
        if (allCurrentPageSelected) {
            setSelectedGuestIds((current) =>
                current.filter((id) => !currentPageGuestIds.includes(id))
            );
            return;
        }

        setSelectedGuestIds((current) => {
            const merged = [...current];

            currentPageGuestIds.forEach((id) => {
                if (!merged.includes(id)) {
                    merged.push(id);
                }
            });

            return merged;
        });
    };

    const clearSelected = () => {
        setSelectedGuestIds([]);
    };

    const bulkSend = () => {
        if (selectedGuestIds.length === 0) {
            alert('Select at least one guest.');
            return;
        }

        if (!confirm(`Send follow-up email to ${selectedGuestIds.length} selected guests?`)) {
            return;
        }

        router.post(
            route('events.guest-follow-ups.bulk-send', event.id),
            {
                guest_ids: selectedGuestIds,
                message: bulkMessage,
                followup_note: bulkNote,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedGuestIds([]);
                },
            }
        );
    };

    const bulkMark = () => {
        if (selectedGuestIds.length === 0) {
            alert('Select at least one guest.');
            return;
        }

        if (!confirm(`Mark ${selectedGuestIds.length} selected guests as followed up?`)) {
            return;
        }

        router.patch(
            route('events.guest-follow-ups.bulk-mark', event.id),
            {
                guest_ids: selectedGuestIds,
                followup_note: bulkNote,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedGuestIds([]);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Guest Follow-Ups - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Guest Communication Follow-Ups
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            {event.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            {event.event_date || '-'} {event.event_time || ''}
                            {event.venue ? ` • ${event.venue}` : ''}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route('events.show', event.id)}
                            style={buttonStyle('#4b5563')}
                        >
                            Back to Event
                        </Link>

                        <Link
                            href={route('events.check-in.index', event.id)}
                            style={buttonStyle('#16a34a')}
                        >
                            Check-In
                        </Link>

                        <Link
                            href={route('events.analytics', event.id)}
                            style={buttonStyle('#2563eb')}
                        >
                            Analytics
                        </Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-4 rounded bg-green-100 px-4 py-3 font-semibold text-green-800">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-4 rounded bg-red-100 px-4 py-3 font-semibold text-red-800">
                        {flash.error}
                    </div>
                )}

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    <SummaryCard
                        label="Total Guests"
                        value={summary?.total_guests ?? 0}
                        background="#f9fafb"
                        color="#111827"
                    />

                    <SummaryCard
                        label="Pending RSVP"
                        value={summary?.pending ?? 0}
                        background="#fef3c7"
                        color="#92400e"
                    />

                    <SummaryCard
                        label="Not Responded"
                        value={summary?.not_responded ?? 0}
                        background="#fee2e2"
                        color="#991b1b"
                    />

                    <SummaryCard
                        label="Not Arrived"
                        value={summary?.not_arrived ?? 0}
                        background="#f3f4f6"
                        color="#374151"
                    />

                    <SummaryCard
                        label="Followed Up"
                        value={summary?.followed_up ?? 0}
                        background="#dcfce7"
                        color="#166534"
                    />

                    <SummaryCard
                        label="Not Followed"
                        value={summary?.not_followed_up ?? 0}
                        background="#dbeafe"
                        color="#1d4ed8"
                    />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        label="Responded"
                        value={summary?.responded ?? 0}
                        background="#dbeafe"
                        color="#1d4ed8"
                    />

                    <SummaryCard
                        label="Checked In"
                        value={summary?.checked_in ?? 0}
                        background="#cffafe"
                        color="#0891b2"
                    />

                    <SummaryCard
                        label="Total Follow-Up Attempts"
                        value={summary?.total_followup_count ?? 0}
                        background="#ede9fe"
                        color="#7c3aed"
                    />

                    <SummaryCard
                        label="Multiple Follow-Ups"
                        value={summary?.guests_with_multiple_followups ?? 0}
                        background="#ffedd5"
                        color="#ea580c"
                    />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
                    <ChartCard
                        title="RSVP Breakdown"
                        subtitle="Accepted, declined, and pending guests."
                        items={charts?.rsvp || []}
                        total={summary?.total_guests ?? 0}
                    />

                    <ChartCard
                        title="Response Breakdown"
                        subtitle="Guests who responded vs not responded."
                        items={charts?.response || []}
                        total={summary?.total_guests ?? 0}
                    />

                    <ChartCard
                        title="Check-In Breakdown"
                        subtitle="Guest arrival progress."
                        items={charts?.checkin || []}
                        total={summary?.total_guests ?? 0}
                    />

                    <ChartCard
                        title="Follow-Up Breakdown"
                        subtitle="Followed-up vs not followed-up guests."
                        items={charts?.followup || []}
                        total={summary?.total_guests ?? 0}
                    />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <PercentageCard
                        label="Response Progress"
                        value={summary?.response_percentage ?? 0}
                        description="Guests who responded compared with all guests."
                        background="#eff6ff"
                        color="#2563eb"
                    />

                    <PercentageCard
                        label="Arrival Progress"
                        value={summary?.arrival_percentage ?? 0}
                        description="Checked-in guests compared with all guests."
                        background="#ecfeff"
                        color="#0891b2"
                    />

                    <PercentageCard
                        label="Follow-Up Progress"
                        value={summary?.followup_percentage ?? 0}
                        description="Guests followed up compared with all guests."
                        background="#f5f3ff"
                        color="#7c3aed"
                    />
                </div>

                <div className="mb-6 rounded bg-white p-5 shadow">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Follow-Up Exports
                            </h2>

                            <p className="text-sm text-gray-500">
                                Export guest follow-up reports using current filters.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <a href={exportUrl('all')} style={buttonStyle('#111827')}>
                                Export Full Report
                            </a>

                            <a href={exportUrl('followed_up')} style={buttonStyle('#16a34a')}>
                                Export Followed-Up
                            </a>

                            <a href={exportUrl('not_followed_up')} style={buttonStyle('#dc2626')}>
                                Export Not Followed
                            </a>

                            <a href={exportUrl('not_responded')} style={buttonStyle('#f97316')}>
                                Export Not Responded
                            </a>

                            <a href={exportUrl('not_arrived')} style={buttonStyle('#7c3aed')}>
                                Export Not Arrived
                            </a>
                        </div>
                    </div>

                    <div className="rounded bg-blue-50 p-3 text-sm text-blue-700">
                        Export includes RSVP status, invitation response, check-in details,
                        follow-up count, follow-up user, notes, and invitation link.
                    </div>
                </div>

                <div className="mb-6 rounded bg-white p-5 shadow">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Bulk Follow-Up Actions
                        </h2>

                        <p className="text-sm text-gray-500">
                            Selected guests: {selectedGuestIds.length}. Bulk email skips guests without email.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Bulk Message
                            </label>

                            <textarea
                                value={bulkMessage}
                                onChange={(e) => setBulkMessage(e.target.value)}
                                style={textareaStyle()}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Internal Bulk Note
                            </label>

                            <textarea
                                value={bulkNote}
                                onChange={(e) => setBulkNote(e.target.value)}
                                placeholder="Optional note stored on selected guests..."
                                style={textareaStyle()}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={bulkSend}
                            style={{
                                ...buttonStyle('#2563eb'),
                                opacity: selectedGuestIds.length === 0 ? 0.6 : 1,
                            }}
                            disabled={selectedGuestIds.length === 0}
                        >
                            Bulk Email Selected
                        </button>

                        <button
                            type="button"
                            onClick={bulkMark}
                            style={{
                                ...buttonStyle('#111827'),
                                opacity: selectedGuestIds.length === 0 ? 0.6 : 1,
                            }}
                            disabled={selectedGuestIds.length === 0}
                        >
                            Bulk Mark Selected
                        </button>

                        <button
                            type="button"
                            onClick={clearSelected}
                            style={buttonStyle('#6b7280')}
                        >
                            Clear Selected
                        </button>
                    </div>
                </div>

                <div className="mb-6 rounded bg-white p-5 shadow">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Filter Guests
                        </h2>

                        <p className="text-sm text-gray-500">
                            Find guests who need follow-up.
                        </p>
                    </div>

                    <form
                        onSubmit={applyFilters}
                        className="grid grid-cols-1 gap-4 md:grid-cols-6"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Search
                            </label>

                            <input
                                type="text"
                                value={data.search}
                                onChange={(e) =>
                                    setData('search', e.target.value)
                                }
                                placeholder="Name, email, phone..."
                                style={inputStyle()}
                            />
                        </div>

                        <SelectField
                            label="RSVP"
                            value={data.status}
                            onChange={(value) => setData('status', value)}
                            options={filterOptions?.statuses || {}}
                        />

                        <SelectField
                            label="Response"
                            value={data.response_status}
                            onChange={(value) =>
                                setData('response_status', value)
                            }
                            options={filterOptions?.responseStatuses || {}}
                        />

                        <SelectField
                            label="Check-In"
                            value={data.checkin_status}
                            onChange={(value) =>
                                setData('checkin_status', value)
                            }
                            options={filterOptions?.checkinStatuses || {}}
                        />

                        <SelectField
                            label="Follow-Up"
                            value={data.followup_status}
                            onChange={(value) =>
                                setData('followup_status', value)
                            }
                            options={filterOptions?.followupStatuses || {}}
                        />

                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    ...buttonStyle('#2563eb'),
                                    opacity: processing ? 0.7 : 1,
                                }}
                            >
                                Filter
                            </button>

                            <button
                                type="button"
                                onClick={clearFilters}
                                style={buttonStyle('#6b7280')}
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded bg-white shadow">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Follow-Up Guest List
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Send email follow-ups, open WhatsApp messages, mark manual follow-ups, or use bulk actions.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        <input
                                            type="checkbox"
                                            checked={allCurrentPageSelected}
                                            onChange={toggleCurrentPage}
                                        />
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Guest
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Contact
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        RSVP
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Invitation
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Check-In
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Follow-Up
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {guests.data.length > 0 ? (
                                    guests.data.map((guest) => (
                                        <GuestRow
                                            key={guest.id}
                                            event={event}
                                            guest={guest}
                                            selected={selectedGuestIds.includes(guest.id)}
                                            onToggle={() => toggleGuest(guest.id)}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No guests found for selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {guests.links && guests.links.length > 3 && (
                        <div className="flex flex-wrap gap-2 border-t border-gray-200 px-6 py-4">
                            {guests.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    style={{
                                        display: 'inline-flex',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '13px',
                                        textDecoration: 'none',
                                        backgroundColor: link.active
                                            ? '#2563eb'
                                            : '#f3f4f6',
                                        color: link.active
                                            ? '#ffffff'
                                            : '#374151',
                                        pointerEvents: link.url ? 'auto' : 'none',
                                        opacity: link.url ? 1 : 0.5,
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function GuestRow({ event, guest, selected, onToggle }) {
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState(
        `Hello ${guest.name || ''}, this is a reminder regarding your event invitation. Please check and respond when possible.`
    );
    const [note, setNote] = useState(guest.followup_note || '');

    const sendEmail = () => {
        if (!confirm('Send follow-up email to this guest?')) {
            return;
        }

        router.post(
            route('events.guests.follow-up.send', [event.id, guest.id]),
            {
                message,
                followup_note: note,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const markFollowedUp = () => {
        if (!confirm('Mark this guest as followed up?')) {
            return;
        }

        router.patch(
            route('events.guests.follow-up.mark', [event.id, guest.id]),
            {
                followup_note: note,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const copyInviteLink = async () => {
        if (!guest.invitation?.invite_url) {
            alert('No invitation link found.');
            return;
        }

        await navigator.clipboard.writeText(guest.invitation.invite_url);
        alert('Invitation link copied.');
    };

    return (
        <tr className="align-top">
            <td className="whitespace-nowrap px-6 py-4 text-sm">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onToggle}
                />
            </td>

            <td className="px-6 py-4 text-sm">
                <div className="font-bold text-gray-900">
                    {guest.name || '-'}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                    Guests: {guest.guest_count ?? 1}
                </div>
            </td>

            <td className="px-6 py-4 text-sm text-gray-600">
                <div>{guest.email || '-'}</div>
                <div className="mt-1">{guest.phone || '-'}</div>
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span style={statusBadgeStyle(guest.status)}>
                    {guest.status || 'pending'}
                </span>
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                {guest.invitation ? (
                    <div>
                        <span style={lightBadgeStyle()}>
                            {guest.invitation.sent_at ? 'Sent' : 'Not Sent'}
                        </span>

                        <div className="mt-1 text-xs text-gray-500">
                            {guest.invitation.responded_at
                                ? `Responded: ${guest.invitation.responded_at}`
                                : 'Not responded'}
                        </div>
                    </div>
                ) : (
                    '-'
                )}
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-sm">
                {guest.checked_in_at ? (
                    <span style={checkedInBadgeStyle()}>Checked In</span>
                ) : (
                    <span style={notCheckedInBadgeStyle()}>Not Arrived</span>
                )}
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-sm">
                {guest.followup_sent_at ? (
                    <div>
                        <span style={followedUpBadgeStyle()}>
                            Followed Up
                        </span>

                        <div className="mt-1 text-xs text-gray-500">
                            {guest.followup_sent_at}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                            Count: {guest.followup_count ?? 0}
                        </div>

                        {guest.followup_sent_by?.name && (
                            <div className="mt-1 text-xs text-gray-500">
                                By {guest.followup_sent_by.name}
                            </div>
                        )}
                    </div>
                ) : (
                    <span style={notFollowedUpBadgeStyle()}>
                        Not Followed
                    </span>
                )}
            </td>

            <td className="px-6 py-4 text-right text-sm">
                <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-wrap justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(!showForm)}
                            style={smallButtonStyle('#6b7280')}
                        >
                            Message
                        </button>

                        {guest.email && (
                            <button
                                type="button"
                                onClick={sendEmail}
                                style={smallButtonStyle('#2563eb')}
                            >
                                Email
                            </button>
                        )}

                        {guest.whatsapp_url && (
                            <a
                                href={guest.whatsapp_url}
                                target="_blank"
                                rel="noreferrer"
                                style={smallButtonStyle('#16a34a')}
                            >
                                WhatsApp
                            </a>
                        )}

                        {guest.invitation?.invite_url && (
                            <button
                                type="button"
                                onClick={copyInviteLink}
                                style={smallButtonStyle('#7c3aed')}
                            >
                                Copy Link
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={markFollowedUp}
                            style={smallButtonStyle('#111827')}
                        >
                            Mark
                        </button>

                        <Link
                            href={route('events.guests.interactions.index', [
                                event.id,
                                guest.id,
                            ])}
                            style={smallButtonStyle('#0891b2')}
                        >
                            History
                        </Link>
                    </div>

                    {showForm && (
                        <div className="mt-2 w-80 rounded bg-gray-50 p-3 text-left">
                            <label className="mb-1 block text-xs font-bold text-gray-600">
                                Message
                            </label>

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                style={textareaStyle()}
                            />

                            <label className="mb-1 mt-3 block text-xs font-bold text-gray-600">
                                Internal Follow-Up Note
                            </label>

                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                style={textareaStyle()}
                            />
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
}

function SelectField({ label, value, onChange, options }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">
                {label}
            </label>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={inputStyle()}
            >
                {Object.entries(options || {}).map(([optionValue, labelText]) => (
                    <option key={optionValue} value={optionValue}>
                        {labelText}
                    </option>
                ))}
            </select>
        </div>
    );
}

function SummaryCard({ label, value, background, color }) {
    return (
        <div
            style={{
                backgroundColor: background,
                borderRadius: '16px',
                padding: '18px',
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
                    fontSize: '30px',
                    fontWeight: '900',
                    lineHeight: '1',
                }}
            >
                {value ?? 0}
            </p>
        </div>
    );
}

function ChartCard({ title, subtitle, items, total }) {
    return (
        <div
            style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
            }}
        >
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>

            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>

            <div className="mt-5 space-y-4">
                {items.map((item) => {
                    const percentage =
                        total > 0 ? Math.round((item.value / total) * 100) : 0;

                    return (
                        <div key={item.label}>
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="font-bold text-gray-700">
                                    {item.label}
                                </span>

                                <span className="font-bold text-gray-900">
                                    {item.value} ({percentage}%)
                                </span>
                            </div>

                            <div
                                style={{
                                    width: '100%',
                                    height: '12px',
                                    backgroundColor: item.background,
                                    borderRadius: '999px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        width: `${percentage}%`,
                                        height: '100%',
                                        backgroundColor: item.color,
                                        borderRadius: '999px',
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PercentageCard({ label, value, description, background, color }) {
    const safeValue = Number(value || 0);
    const displayValue = Math.min(Math.max(safeValue, 0), 100);

    return (
        <div
            style={{
                backgroundColor: background,
                borderRadius: '16px',
                padding: '22px',
                boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
            }}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2
                        style={{
                            color,
                            fontSize: '18px',
                            fontWeight: '900',
                        }}
                    >
                        {label}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        {description}
                    </p>
                </div>

                <div
                    style={{
                        color,
                        fontSize: '34px',
                        fontWeight: '900',
                        lineHeight: 1,
                    }}
                >
                    {displayValue}%
                </div>
            </div>

            <div
                className="mt-5"
                style={{
                    width: '100%',
                    height: '14px',
                    backgroundColor: '#ffffff',
                    borderRadius: '999px',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        width: `${displayValue}%`,
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: '999px',
                    }}
                />
            </div>
        </div>
    );
}

function inputStyle() {
    return {
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
    };
}

function textareaStyle() {
    return {
        width: '100%',
        minHeight: '80px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '8px',
        fontSize: '13px',
    };
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
        cursor: 'pointer',
    };
}

function smallButtonStyle(backgroundColor) {
    return {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        color: '#ffffff',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '700',
        textDecoration: 'none',
        border: `1px solid ${backgroundColor}`,
        boxShadow: '0 2px 5px rgba(0,0,0,0.12)',
        cursor: 'pointer',
    };
}

function statusBadgeStyle(status) {
    const styles = {
        accepted: {
            backgroundColor: '#dcfce7',
            color: '#166534',
        },
        declined: {
            backgroundColor: '#fee2e2',
            color: '#991b1b',
        },
        pending: {
            backgroundColor: '#fef3c7',
            color: '#92400e',
        },
    };

    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        ...(styles[status] || styles.pending),
    };
}

function lightBadgeStyle() {
    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
    };
}

function checkedInBadgeStyle() {
    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        backgroundColor: '#dbeafe',
        color: '#1d4ed8',
    };
}

function notCheckedInBadgeStyle() {
    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
    };
}

function followedUpBadgeStyle() {
    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        backgroundColor: '#dcfce7',
        color: '#166534',
    };
}

function notFollowedUpBadgeStyle() {
    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
    };
}

function buildQueryString(data) {
    const params = new URLSearchParams();

    if (data.type) {
        params.append('type', data.type);
    }

    if (data.search) {
        params.append('search', data.search);
    }

    if (data.status) {
        params.append('status', data.status);
    }

    if (data.response_status) {
        params.append('response_status', data.response_status);
    }

    if (data.checkin_status) {
        params.append('checkin_status', data.checkin_status);
    }

    if (data.followup_status) {
        params.append('followup_status', data.followup_status);
    }

    const queryString = params.toString();

    return queryString ? `?${queryString}` : '';
}
