import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({
    auth,
    event,
    guest,
    interactions,
    summary,
    filters,
    filterOptions,
}) {
    const { flash } = usePage().props;

    const [noteTitle, setNoteTitle] = useState('');
    const [noteText, setNoteText] = useState('');
    const [noteChannel, setNoteChannel] = useState('manual');

    const { data, setData, get, processing } = useForm({
        type: filters?.type || '',
        channel: filters?.channel || '',
        search: filters?.search || '',
    });

    const applyFilters = (e) => {
        e.preventDefault();

        get(route('events.guests.interactions.index', [event.id, guest.id]), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(
            route('events.guests.interactions.index', [event.id, guest.id]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const addNote = () => {
        if (!noteText.trim()) {
            alert('Please enter a note.');
            return;
        }

        router.post(
            route('events.guests.interactions.store', [event.id, guest.id]),
            {
                title: noteTitle,
                note: noteText,
                channel: noteChannel,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNoteTitle('');
                    setNoteText('');
                    setNoteChannel('manual');
                },
            }
        );
    };

    const deleteInteraction = (interactionId) => {
        if (!confirm('Delete this interaction?')) {
            return;
        }

        router.delete(
            route('events.guests.interactions.destroy', [
                event.id,
                guest.id,
                interactionId,
            ]),
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Guest Interactions - ${guest.name}`} />

            <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Guest Interaction History
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            {guest.name} • {event.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            {guest.email || '-'} {guest.phone ? `• ${guest.phone}` : ''}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route('events.guest-follow-ups.index', event.id)}
                            style={buttonStyle('#0891b2')}
                        >
                            Follow-Ups
                        </Link>

                        <Link
                            href={route('events.check-in.index', event.id)}
                            style={buttonStyle('#16a34a')}
                        >
                            Check-In
                        </Link>

                        <Link
                            href={route('events.show', event.id)}
                            style={buttonStyle('#4b5563')}
                        >
                            Back to Event
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

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
                    <SummaryCard
                        label="Total"
                        value={summary?.total ?? 0}
                        background="#f9fafb"
                        color="#111827"
                    />

                    <SummaryCard
                        label="Notes"
                        value={summary?.notes ?? 0}
                        background="#dbeafe"
                        color="#1d4ed8"
                    />

                    <SummaryCard
                        label="Follow-Ups"
                        value={summary?.followups ?? 0}
                        background="#ede9fe"
                        color="#7c3aed"
                    />

                    <SummaryCard
                        label="Emails"
                        value={summary?.emails ?? 0}
                        background="#dcfce7"
                        color="#166534"
                    />

                    <SummaryCard
                        label="Manual"
                        value={summary?.manual ?? 0}
                        background="#fef3c7"
                        color="#92400e"
                    />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded bg-white p-5 shadow lg:col-span-1">
                        <h2 className="mb-3 text-lg font-bold text-gray-900">
                            Guest Summary
                        </h2>

                        <InfoItem label="Name" value={guest.name} />
                        <InfoItem label="Email" value={guest.email} />
                        <InfoItem label="Phone" value={guest.phone} />
                        <InfoItem label="RSVP Status" value={guest.status || 'pending'} />
                        <InfoItem label="Guest Count" value={guest.guest_count} />
                        <InfoItem label="Checked In At" value={guest.checked_in_at || '-'} />
                        <InfoItem label="Follow-Up Count" value={guest.followup_count ?? 0} />
                        <InfoItem label="Last Follow-Up" value={guest.followup_sent_at || '-'} />

                        {guest.followup_note && (
                            <div className="mt-3 rounded bg-gray-50 p-3 text-sm text-gray-700">
                                <div className="mb-1 font-bold text-gray-500">
                                    Latest Follow-Up Note
                                </div>
                                {guest.followup_note}
                            </div>
                        )}
                    </div>

                    <div className="rounded bg-white p-5 shadow lg:col-span-2">
                        <h2 className="mb-3 text-lg font-bold text-gray-900">
                            Add Manual Note
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-gray-700">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={noteTitle}
                                    onChange={(e) => setNoteTitle(e.target.value)}
                                    placeholder="Optional title..."
                                    style={inputStyle()}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold text-gray-700">
                                    Channel
                                </label>

                                <select
                                    value={noteChannel}
                                    onChange={(e) => setNoteChannel(e.target.value)}
                                    style={inputStyle()}
                                >
                                    <option value="manual">Manual</option>
                                    <option value="email">Email</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Note
                            </label>

                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Write interaction note..."
                                style={textareaStyle()}
                            />
                        </div>

                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addNote}
                                style={buttonStyle('#2563eb')}
                            >
                                Add Note
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-6 rounded bg-white p-5 shadow">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Filter Interactions
                        </h2>
                    </div>

                    <form
                        onSubmit={applyFilters}
                        className="grid grid-cols-1 gap-4 md:grid-cols-4"
                    >
                        <SelectField
                            label="Type"
                            value={data.type}
                            onChange={(value) => setData('type', value)}
                            options={filterOptions?.types || {}}
                        />

                        <SelectField
                            label="Channel"
                            value={data.channel}
                            onChange={(value) => setData('channel', value)}
                            options={filterOptions?.channels || {}}
                        />

                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Search
                            </label>

                            <input
                                type="text"
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                placeholder="Search title, message, note..."
                                style={inputStyle()}
                            />
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
                            Interaction Timeline
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Every note and follow-up action for this guest. Finally, history that does not depend on someone remembering vaguely.
                        </p>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {interactions.data.length > 0 ? (
                            interactions.data.map((interaction) => (
                                <InteractionItem
                                    key={interaction.id}
                                    interaction={interaction}
                                    onDelete={() => deleteInteraction(interaction.id)}
                                />
                            ))
                        ) : (
                            <div className="px-6 py-10 text-center text-sm text-gray-500">
                                No interactions found.
                            </div>
                        )}
                    </div>

                    {interactions.links && interactions.links.length > 3 && (
                        <div className="flex flex-wrap gap-2 border-t border-gray-200 px-6 py-4">
                            {interactions.links.map((link, index) => (
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

function InteractionItem({ interaction, onDelete }) {
    return (
        <div className="px-6 py-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span style={typeBadgeStyle(interaction.type)}>
                            {formatLabel(interaction.type)}
                        </span>

                        <span style={channelBadgeStyle(interaction.channel)}>
                            {formatLabel(interaction.channel)}
                        </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900">
                        {interaction.title || 'Interaction'}
                    </h3>

                    {interaction.message && (
                        <div className="mt-3 rounded bg-blue-50 p-3 text-sm text-blue-700">
                            <div className="mb-1 font-bold">Message</div>
                            {interaction.message}
                        </div>
                    )}

                    {interaction.note && (
                        <div className="mt-3 rounded bg-gray-50 p-3 text-sm text-gray-700">
                            <div className="mb-1 font-bold">Note</div>
                            {interaction.note}
                        </div>
                    )}

                    <p className="mt-2 text-xs text-gray-500">
                        Time: {interaction.interaction_at || interaction.created_at || '-'}
                        {interaction.user?.name ? ` • By ${interaction.user.name}` : ''}
                    </p>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={onDelete}
                        style={smallButtonStyle('#dc2626')}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="mb-3">
            <div className="text-sm font-bold text-gray-500">{label}</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">
                {value || '-'}
            </div>
        </div>
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
        minHeight: '120px',
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

function typeBadgeStyle(type) {
    const styles = {
        note: {
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
        },
        followup: {
            backgroundColor: '#ede9fe',
            color: '#6d28d9',
        },
        checkin: {
            backgroundColor: '#dcfce7',
            color: '#166534',
        },
        system: {
            backgroundColor: '#f3f4f6',
            color: '#374151',
        },
    };

    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        ...(styles[type] || styles.note),
    };
}

function channelBadgeStyle(channel) {
    const styles = {
        manual: {
            backgroundColor: '#fef3c7',
            color: '#92400e',
        },
        email: {
            backgroundColor: '#dcfce7',
            color: '#166534',
        },
        whatsapp: {
            backgroundColor: '#d1fae5',
            color: '#047857',
        },
        system: {
            backgroundColor: '#e5e7eb',
            color: '#374151',
        },
    };

    return {
        display: 'inline-flex',
        padding: '4px 10px',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '12px',
        ...(styles[channel] || styles.manual),
    };
}

function formatLabel(value) {
    if (!value) {
        return '-';
    }

    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
