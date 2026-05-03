import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({
    auth,
    events,
    filters,
    statusOptions,
    eventTypeOptions,
    organizers,
    summary,
}) {
    const [form, setForm] = useState({
        search: filters.search || '',
        status: filters.status || '',
        event_type: filters.event_type || '',
        organizer_id: filters.organizer_id || '',
        from_date: filters.from_date || '',
        to_date: filters.to_date || '',
    });

    const statusColors = {
        draft: '#64748b',
        active: '#16a34a',
        completed: '#2563eb',
        cancelled: '#dc2626',
    };

    const cardStyle = {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
    };

    const buttonStyle = (background = '#111827') => ({
        display: 'inline-block',
        padding: '10px 14px',
        background,
        color: '#ffffff',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '700',
        border: 'none',
        cursor: 'pointer',
    });

    const inputStyle = {
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '10px 12px',
        fontSize: '14px',
        outline: 'none',
        background: '#ffffff',
    };

    const labelStyle = {
        display: 'block',
        color: '#334155',
        fontSize: '13px',
        fontWeight: '800',
        marginBottom: '6px',
    };

    const updateField = (key, value) => {
        setForm((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(route('super-admin.events.index'), form, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const reset = () => {
        setForm({
            search: '',
            status: '',
            event_type: '',
            organizer_id: '',
            from_date: '',
            to_date: '',
        });

        router.get(route('super-admin.events.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Super Admin Events" />

            <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '16px',
                            flexWrap: 'wrap',
                            marginBottom: '22px',
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    fontSize: '32px',
                                    lineHeight: '38px',
                                    fontWeight: '900',
                                    color: '#0f172a',
                                    margin: 0,
                                }}
                            >
                                Super Admin Events Management
                            </h1>

                            <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>
                                View, filter, inspect, and jump into all events across the system.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link href={route('super-admin.dashboard')} style={buttonStyle('#0f172a')}>
                                Super Admin Dashboard
                            </Link>

                            <Link href={route('events.index')} style={buttonStyle('#2563eb')}>
                                Normal Event List
                            </Link>
                        </div>
                    </div>

                    <section
                        style={{
                            ...cardStyle,
                            marginBottom: '20px',
                            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                            color: '#ffffff',
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                                gap: '14px',
                            }}
                        >
                            <HeroStat label="Total Events" value={summary.total} />
                            <HeroStat label="Draft" value={summary.draft} />
                            <HeroStat label="Active" value={summary.active} />
                            <HeroStat label="Completed" value={summary.completed} />
                            <HeroStat label="Cancelled" value={summary.cancelled} />
                        </div>
                    </section>

                    <section style={{ ...cardStyle, marginBottom: '20px' }}>
                        <h2 style={sectionTitleStyle}>Filter Events</h2>

                        <form onSubmit={submit}>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                    gap: '14px',
                                    alignItems: 'end',
                                }}
                            >
                                <div>
                                    <label style={labelStyle}>Search</label>
                                    <input
                                        type="text"
                                        value={form.search}
                                        onChange={(e) => updateField('search', e.target.value)}
                                        placeholder="Title, venue, type, organizer..."
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => updateField('status', e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="">All Statuses</option>
                                        {(statusOptions || []).map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>Event Type</label>
                                    <select
                                        value={form.event_type}
                                        onChange={(e) => updateField('event_type', e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="">All Types</option>
                                        {(eventTypeOptions || []).map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>Organizer</label>
                                    <select
                                        value={form.organizer_id}
                                        onChange={(e) => updateField('organizer_id', e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="">All Organizers</option>
                                        {(organizers || []).map((organizer) => (
                                            <option key={organizer.id} value={organizer.id}>
                                                {organizer.name} {organizer.email ? `(${organizer.email})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>From Event Date</label>
                                    <input
                                        type="date"
                                        value={form.from_date}
                                        onChange={(e) => updateField('from_date', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>To Event Date</label>
                                    <input
                                        type="date"
                                        value={form.to_date}
                                        onChange={(e) => updateField('to_date', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    gap: '10px',
                                    flexWrap: 'wrap',
                                    marginTop: '16px',
                                }}
                            >
                                <button type="submit" style={buttonStyle('#2563eb')}>
                                    Apply Filters
                                </button>

                                <button
                                    type="button"
                                    onClick={reset}
                                    style={buttonStyle('#64748b')}
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </section>

                    <section style={cardStyle}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '12px',
                                flexWrap: 'wrap',
                                marginBottom: '14px',
                            }}
                        >
                            <h2 style={{ ...sectionTitleStyle, marginBottom: 0 }}>
                                Events
                            </h2>

                            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                                Showing {events?.data?.length || 0} of {events?.total || 0} events
                            </p>
                        </div>

                        {events?.data?.length > 0 ? (
                            <>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr style={theadRowStyle}>
                                                <th style={thStyle}>Event</th>
                                                <th style={thStyle}>Organizer</th>
                                                <th style={thStyle}>Date / Time</th>
                                                <th style={thStyle}>Venue</th>
                                                <th style={thStyle}>Status</th>
                                                <th style={thStyle}>Counts</th>
                                                <th style={thStyle}>Created</th>
                                                <th style={thStyle}>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {events.data.map((event) => (
                                                <tr key={event.id} style={trStyle}>
                                                    <td style={tdStyle}>
                                                        <div style={{ fontWeight: '900', color: '#0f172a' }}>
                                                            {event.title || 'Untitled Event'}
                                                        </div>

                                                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                                                            #{event.id}
                                                            {event.event_type ? ` · ${event.event_type}` : ''}
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <div style={{ fontWeight: '800', color: '#334155' }}>
                                                            {event.organizer?.name || 'N/A'}
                                                        </div>

                                                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                                                            {event.organizer?.email || ''}
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <div>{event.event_date || 'N/A'}</div>
                                                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                                                            {event.event_time || 'No time'}
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>{event.venue || 'N/A'}</td>

                                                    <td style={tdStyle}>
                                                        <StatusBadge
                                                            status={event.status}
                                                            statusColors={statusColors}
                                                        />
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <div style={countGridStyle}>
                                                            <CountPill label="Guests" value={event.counts.guests} />
                                                            <CountPill label="Invites" value={event.counts.invitations} />
                                                            <CountPill label="Q" value={event.counts.questions} />
                                                            <CountPill label="QA" value={event.counts.qa_checks} />
                                                            <CountPill label="Logs" value={event.counts.activity_logs} />
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>{event.created_at || 'N/A'}</td>

                                                    <td style={tdStyle}>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                gap: '8px',
                                                                flexWrap: 'wrap',
                                                            }}
                                                        >
                                                            <Link
                                                                href={route('events.show', event.id)}
                                                                style={smallLinkStyle('#2563eb')}
                                                            >
                                                                View
                                                            </Link>

                                                            <Link
                                                                href={route('events.dashboard', event.id)}
                                                                style={smallLinkStyle('#16a34a')}
                                                            >
                                                                Dashboard
                                                            </Link>

                                                            <Link
                                                                href={route('events.project-summary', event.id)}
                                                                style={smallLinkStyle('#0f172a')}
                                                            >
                                                                Summary
                                                            </Link>

                                                            <Link
                                                                href={route('events.activity-logs.index', event.id)}
                                                                style={smallLinkStyle('#7c3aed')}
                                                            >
                                                                Logs
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <Pagination links={events.links} />
                            </>
                        ) : (
                            <div
                                style={{
                                    background: '#f8fafc',
                                    border: '1px dashed #cbd5e1',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    color: '#64748b',
                                    fontSize: '14px',
                                }}
                            >
                                No events found for the selected filters.
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function HeroStat({ label, value }) {
    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '12px',
                padding: '14px',
            }}
        >
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '12px', fontWeight: '800' }}>
                {label}
            </p>

            <p style={{ margin: '6px 0 0', color: '#ffffff', fontSize: '28px', fontWeight: '900' }}>
                {value || 0}
            </p>
        </div>
    );
}

function StatusBadge({ status, statusColors }) {
    const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft';

    return (
        <span
            style={{
                display: 'inline-block',
                background: statusColors[status] || '#64748b',
                color: '#ffffff',
                padding: '5px 9px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '900',
            }}
        >
            {label}
        </span>
    );
}

function CountPill({ label, value }) {
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#334155',
                borderRadius: '999px',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: '800',
                whiteSpace: 'nowrap',
            }}
        >
            {label}: {value || 0}
        </span>
    );
}

function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div
            style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: '18px',
                alignItems: 'center',
            }}
        >
            {links.map((link, index) => {
                if (!link.url) {
                    return (
                        <span
                            key={index}
                            style={{
                                padding: '8px 11px',
                                borderRadius: '8px',
                                background: '#f1f5f9',
                                color: '#94a3b8',
                                fontSize: '13px',
                                fontWeight: '800',
                            }}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        preserveState
                        style={{
                            padding: '8px 11px',
                            borderRadius: '8px',
                            background: link.active ? '#2563eb' : '#ffffff',
                            color: link.active ? '#ffffff' : '#334155',
                            border: '1px solid #dbeafe',
                            fontSize: '13px',
                            fontWeight: '800',
                            textDecoration: 'none',
                        }}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}

const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 0,
    marginBottom: '16px',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
};

const theadRowStyle = {
    background: '#f1f5f9',
};

const trStyle = {
    borderBottom: '1px solid #e5e7eb',
};

const thStyle = {
    textAlign: 'left',
    padding: '12px',
    color: '#334155',
    fontWeight: '900',
    whiteSpace: 'nowrap',
};

const tdStyle = {
    padding: '12px',
    color: '#475569',
    verticalAlign: 'top',
};

const countGridStyle = {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    minWidth: '210px',
};

const smallLinkStyle = (background) => ({
    display: 'inline-block',
    background,
    color: '#ffffff',
    padding: '6px 9px',
    borderRadius: '7px',
    fontSize: '12px',
    fontWeight: '800',
    textDecoration: 'none',
});
