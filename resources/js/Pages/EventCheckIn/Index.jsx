import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

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

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
        checkin_status: filters?.checkin_status || '',
    });

    const applyFilters = (e) => {
        e.preventDefault();

        get(route('events.check-in.index', event.id), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(
            route('events.check-in.index', event.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const exportUrl = (type) => {
        return (
            route('events.check-in.export', event.id) +
            buildQueryString({
                ...data,
                type,
            })
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Check-In - ${event.title}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Guest Check-In
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
                            href={route('events.guests.index', event.id)}
                            style={buttonStyle('#7c3aed')}
                        >
                            Guests
                        </Link>

                        <Link
                            href={route('events.guest-follow-ups.index', event.id)}
                            style={buttonStyle('#0891b2')}
                        >
                            Follow-Ups
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

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-7">
                    <SummaryCard
                        label="Total Guests"
                        value={summary?.total_guests ?? 0}
                        background="#f9fafb"
                        color="#111827"
                    />

                    <SummaryCard
                        label="Accepted"
                        value={summary?.accepted ?? 0}
                        background="#dcfce7"
                        color="#166534"
                    />

                    <SummaryCard
                        label="Declined"
                        value={summary?.declined ?? 0}
                        background="#fee2e2"
                        color="#991b1b"
                    />

                    <SummaryCard
                        label="Pending"
                        value={summary?.pending ?? 0}
                        background="#fef3c7"
                        color="#92400e"
                    />

                    <SummaryCard
                        label="Checked In"
                        value={summary?.checked_in ?? 0}
                        background="#dbeafe"
                        color="#1d4ed8"
                    />

                    <SummaryCard
                        label="Not Arrived"
                        value={summary?.not_checked_in ?? 0}
                        background="#f3f4f6"
                        color="#374151"
                    />

                    <SummaryCard
                        label="Attending Count"
                        value={summary?.total_attending_count ?? 0}
                        background="#ede9fe"
                        color="#6d28d9"
                    />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <ChartCard
                        title="RSVP Breakdown"
                        subtitle="Accepted, declined, and pending guests."
                        items={charts?.rsvp || []}
                        total={summary?.total_guests ?? 0}
                    />

                    <ChartCard
                        title="Check-In Breakdown"
                        subtitle="Who arrived and who has not arrived yet."
                        items={charts?.checkin || []}
                        total={summary?.total_guests ?? 0}
                    />

                    <ChartCard
                        title="Expected vs Actual Attendance"
                        subtitle="Compares accepted guest count against actual arrived count."
                        items={charts?.attendance || []}
                        total={Math.max(
                            summary?.expected_attending_count ?? 0,
                            summary?.total_attending_count ?? 0,
                            1
                        )}
                    />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <PercentageCard
                        label="Attendance Progress"
                        value={summary?.attendance_percentage ?? 0}
                        description="Actual attending count compared with accepted guest count."
                        background="#ecfeff"
                        color="#0891b2"
                    />

                    <PercentageCard
                        label="Guest Check-In Progress"
                        value={summary?.guest_check_in_percentage ?? 0}
                        description="Checked-in guest records compared with total guest records."
                        background="#f5f3ff"
                        color="#7c3aed"
                    />
                </div>

                <div className="mb-6 rounded bg-white p-5 shadow">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Attendance Exports
                            </h2>

                            <p className="text-sm text-gray-500">
                                Export attendance data using the current filters.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <a
                                href={exportUrl('all')}
                                style={buttonStyle('#111827')}
                            >
                                Export Full Report
                            </a>

                            <a
                                href={exportUrl('checked_in')}
                                style={buttonStyle('#16a34a')}
                            >
                                Export Checked-In
                            </a>

                            <a
                                href={exportUrl('not_checked_in')}
                                style={buttonStyle('#dc2626')}
                            >
                                Export Not Arrived
                            </a>
                        </div>
                    </div>

                    <div className="rounded bg-blue-50 p-3 text-sm text-blue-700">
                        CSV export includes guest details, RSVP status, invitation status,
                        check-in time, checked-in user, and notes. Because apparently
                        event entrances now need forensic documentation.
                    </div>
                </div>

                <div className="mb-6 rounded bg-white p-5 shadow">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Filter Guests
                        </h2>

                        <p className="text-sm text-gray-500">
                            Search by guest name, email, phone, RSVP status, or check-in status.
                        </p>
                    </div>

                    <form
                        onSubmit={applyFilters}
                        className="grid grid-cols-1 gap-4 md:grid-cols-4"
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

                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                RSVP Status
                            </label>

                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                style={inputStyle()}
                            >
                                {Object.entries(
                                    filterOptions?.statuses || {}
                                ).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Check-In Status
                            </label>

                            <select
                                value={data.checkin_status}
                                onChange={(e) =>
                                    setData('checkin_status', e.target.value)
                                }
                                style={inputStyle()}
                            >
                                {Object.entries(
                                    filterOptions?.checkinStatuses || {}
                                ).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

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
                            Guest List
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Mark guests as arrived during the event.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
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
                                        Guest Count
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
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
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

function GuestRow({ event, guest }) {
    const [note, setNote] = useState(guest.checkin_note || '');
    const [showNote, setShowNote] = useState(false);

    const checkIn = () => {
        router.patch(
            route('events.guests.check-in', [event.id, guest.id]),
            {
                checkin_note: note,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const undoCheckIn = () => {
        if (!confirm('Undo this guest check-in?')) {
            return;
        }

        router.patch(
            route('events.guests.undo-check-in', [event.id, guest.id]),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <tr className="align-top">
            <td className="px-6 py-4 text-sm">
                <div className="font-bold text-gray-900">
                    {guest.name || '-'}
                </div>

                {guest.checkin_note && (
                    <div className="mt-1 max-w-xs rounded bg-gray-50 p-2 text-xs text-gray-600">
                        Note: {guest.checkin_note}
                    </div>
                )}
            </td>

            <td className="px-6 py-4 text-sm text-gray-600">
                <div>{guest.email || '-'}</div>
                <div className="mt-1">{guest.phone || '-'}</div>
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                {guest.guest_count ?? 1}
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span style={statusBadgeStyle(guest.status)}>
                    {guest.status || 'pending'}
                </span>
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                {guest.invitation ? (
                    <div>
                        <span style={sentBadgeStyle(guest.invitation.sent_at)}>
                            {guest.invitation.sent_at ? 'Sent' : 'Not Sent'}
                        </span>

                        {guest.invitation.responded_at && (
                            <div className="mt-1 text-xs text-gray-500">
                                Responded: {guest.invitation.responded_at}
                            </div>
                        )}
                    </div>
                ) : (
                    '-'
                )}
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-sm">
                {guest.checked_in_at ? (
                    <div>
                        <span style={checkedInBadgeStyle()}>
                            Checked In
                        </span>

                        <div className="mt-1 text-xs text-gray-500">
                            {guest.checked_in_at}
                        </div>

                        {guest.checked_in_by?.name && (
                            <div className="mt-1 text-xs text-gray-500">
                                By {guest.checked_in_by.name}
                            </div>
                        )}
                    </div>
                ) : (
                    <span style={notCheckedInBadgeStyle()}>
                        Not Arrived
                    </span>
                )}
            </td>

            <td className="px-6 py-4 text-right text-sm">
                <div className="flex flex-col items-end gap-2">
                    {!guest.checked_in_at ? (
                        <>
                            {showNote && (
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Optional check-in note..."
                                    style={{
                                        width: '220px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        fontSize: '13px',
                                    }}
                                />
                            )}

                            <div className="flex flex-wrap justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowNote(!showNote)}
                                    style={smallButtonStyle('#6b7280')}
                                >
                                    Note
                                </button>

                                <button
                                    type="button"
                                    onClick={checkIn}
                                    style={smallButtonStyle('#16a34a')}
                                >
                                    Check In
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
                        </>
                    ) : (
                        <div className="flex flex-wrap justify-end gap-2">
                            <button
                                type="button"
                                onClick={undoCheckIn}
                                style={smallButtonStyle('#dc2626')}
                            >
                                Undo
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
                    )}
                </div>
            </td>
        </tr>
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

function sentBadgeStyle(sentAt) {
    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        backgroundColor: sentAt ? '#dcfce7' : '#f3f4f6',
        color: sentAt ? '#166534' : '#374151',
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

    if (data.checkin_status) {
        params.append('checkin_status', data.checkin_status);
    }

    const queryString = params.toString();

    return queryString ? `?${queryString}` : '';
}
