import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({
    auth,
    event,
    logs,
    filters,
    summary,
    actions,
    users,
    subjectTypes,
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [action, setAction] = useState(filters.action || '');
    const [userId, setUserId] = useState(filters.user_id || '');
    const [subjectType, setSubjectType] = useState(filters.subject_type || '');
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');

    const flash = usePage().props.flash || {};

    const applyFilters = (e) => {
        e.preventDefault();

        router.get(
            route('events.activity-logs.index', event.id),
            {
                search,
                action,
                user_id: userId,
                subject_type: subjectType,
                from,
                to,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilters = () => {
        setSearch('');
        setAction('');
        setUserId('');
        setSubjectType('');
        setFrom('');
        setTo('');

        router.get(
            route('events.activity-logs.index', event.id),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const buttonStyle = (bg = '#2563eb') => ({
        display: 'inline-block',
        background: bg,
        color: '#fff',
        padding: '9px 14px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
    });

    const smallButtonStyle = (bg = '#2563eb') => ({
        display: 'inline-block',
        background: bg,
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '7px',
        textDecoration: 'none',
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px',
    });

    const cardStyle = {
        background: '#fff',
        borderRadius: '12px',
        padding: '18px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
    };

    const inputStyle = {
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '9px 10px',
        fontSize: '14px',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: 700,
        color: '#374151',
        marginBottom: '6px',
    };

    const getActionColor = (actionName) => {
        if (!actionName) return '#6b7280';

        if (actionName.includes('created')) return '#16a34a';
        if (actionName.includes('updated')) return '#2563eb';
        if (actionName.includes('deleted')) return '#dc2626';
        if (actionName.includes('failed')) return '#b91c1c';
        if (actionName.includes('reviewed')) return '#9333ea';
        if (actionName.includes('checked_in')) return '#059669';
        if (actionName.includes('checkin_undone')) return '#ea580c';
        if (actionName.includes('followup')) return '#0891b2';
        if (actionName.includes('reminder')) return '#7c3aed';
        if (actionName.includes('rsvp')) return '#0d9488';

        return '#4b5563';
    };

    const renderProperties = (properties) => {
        if (!properties || Object.keys(properties).length === 0) {
            return <span style={{ color: '#9ca3af' }}>No extra data</span>;
        }

        return (
            <details>
                <summary
                    style={{
                        cursor: 'pointer',
                        fontWeight: 700,
                        color: '#2563eb',
                    }}
                >
                    View properties
                </summary>

                <pre
                    style={{
                        marginTop: '10px',
                        background: '#111827',
                        color: '#bbf7d0',
                        padding: '12px',
                        borderRadius: '8px',
                        overflowX: 'auto',
                        fontSize: '12px',
                        maxHeight: '280px',
                    }}
                >
                    {JSON.stringify(properties, null, 2)}
                </pre>
            </details>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Activity Logs - ${event.title}`} />

            <div style={{ padding: '24px', background: '#f3f4f6', minHeight: '100vh' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '16px',
                        alignItems: 'flex-start',
                        marginBottom: '20px',
                        flexWrap: 'wrap',
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize: '28px',
                                fontWeight: 800,
                                color: '#111827',
                                margin: 0,
                            }}
                        >
                            Event Activity Log / Audit Trail
                        </h1>

                        <p style={{ marginTop: '6px', color: '#6b7280' }}>
                            Event: <strong>{event.title}</strong>
                        </p>

                        {event.venue && (
                            <p style={{ marginTop: '4px', color: '#6b7280' }}>
                                Venue: {event.venue}
                            </p>
                        )}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Link
                            href={route('events.show', event.id)}
                            style={buttonStyle('#4b5563')}
                        >
                            Back to Event
                        </Link>

                        <Link
                            href={route('events.check-in.index', event.id)}
                            style={buttonStyle('#059669')}
                        >
                            Check-In
                        </Link>

                        <Link
                            href={route('events.guest-follow-ups.index', event.id)}
                            style={buttonStyle('#0891b2')}
                        >
                            Follow-Ups
                        </Link>
                    </div>
                </div>

                {flash.success && (
                    <div
                        style={{
                            background: '#dcfce7',
                            color: '#166534',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            marginBottom: '16px',
                            border: '1px solid #86efac',
                            fontWeight: 700,
                        }}
                    >
                        {flash.success}
                    </div>
                )}

                {flash.error && (
                    <div
                        style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            marginBottom: '16px',
                            border: '1px solid #fecaca',
                            fontWeight: 700,
                        }}
                    >
                        {flash.error}
                    </div>
                )}

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '14px',
                        marginBottom: '20px',
                    }}
                >
                    <SummaryCard title="Total Logs" value={summary.total} />
                    <SummaryCard title="Today" value={summary.today} />
                    <SummaryCard title="Guest Actions" value={summary.guest_actions} />
                    <SummaryCard title="Follow-Ups" value={summary.followups} />
                    <SummaryCard title="Check-Ins" value={summary.checkins} />
                    <SummaryCard title="Reminders" value={summary.reminders} />
                </div>

                <form onSubmit={applyFilters} style={{ ...cardStyle, marginBottom: '20px' }}>
                    <h2
                        style={{
                            marginTop: 0,
                            marginBottom: '14px',
                            fontSize: '18px',
                            fontWeight: 800,
                            color: '#111827',
                        }}
                    >
                        Filters
                    </h2>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '14px',
                            alignItems: 'end',
                        }}
                    >
                        <div>
                            <label style={labelStyle}>Search</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Action, description, IP..."
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Action</label>
                            <select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="">All actions</option>
                                {actions.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>User</label>
                            <select
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="">All users</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Subject</label>
                            <select
                                value={subjectType}
                                onChange={(e) => setSubjectType(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="">All subjects</option>
                                {subjectTypes.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>From</label>
                            <input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>To</label>
                            <input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <button type="submit" style={buttonStyle('#2563eb')}>
                                Apply
                            </button>

                            <button
                                type="button"
                                onClick={resetFilters}
                                style={buttonStyle('#6b7280')}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </form>

                <div style={cardStyle}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                            flexWrap: 'wrap',
                            marginBottom: '14px',
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: 800,
                                color: '#111827',
                            }}
                        >
                            Audit Trail
                        </h2>

                        <div style={{ color: '#6b7280', fontSize: '14px' }}>
                            Showing {logs.data.length} of {logs.total} logs
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                minWidth: '1000px',
                            }}
                        >
                            <thead>
                                <tr style={{ background: '#f9fafb' }}>
                                    <th style={thStyle}>Date / Time</th>
                                    <th style={thStyle}>Action</th>
                                    <th style={thStyle}>Description</th>
                                    <th style={thStyle}>User</th>
                                    <th style={thStyle}>Subject</th>
                                    <th style={thStyle}>IP Address</th>
                                    <th style={thStyle}>Properties</th>
                                </tr>
                            </thead>

                            <tbody>
                                {logs.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            style={{
                                                padding: '30px',
                                                textAlign: 'center',
                                                color: '#6b7280',
                                            }}
                                        >
                                            No activity logs found. The system is either peaceful or suspiciously quiet.
                                        </td>
                                    </tr>
                                )}

                                {logs.data.map((log) => (
                                    <tr key={log.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: 700, color: '#111827' }}>
                                                {log.created_at}
                                            </div>
                                            <div style={{ color: '#6b7280', fontSize: '12px' }}>
                                                {log.created_at_human}
                                            </div>
                                        </td>

                                        <td style={tdStyle}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    background: getActionColor(log.action),
                                                    color: '#fff',
                                                    padding: '5px 9px',
                                                    borderRadius: '999px',
                                                    fontSize: '12px',
                                                    fontWeight: 800,
                                                }}
                                            >
                                                {log.action_label}
                                            </span>
                                        </td>

                                        <td style={tdStyle}>
                                            <div style={{ color: '#111827', fontWeight: 600 }}>
                                                {log.description || '-'}
                                            </div>
                                        </td>

                                        <td style={tdStyle}>
                                            {log.user ? (
                                                <span style={{ fontWeight: 700 }}>
                                                    {log.user.name}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#9ca3af' }}>
                                                    Guest/System
                                                </span>
                                            )}
                                        </td>

                                        <td style={tdStyle}>
                                            {log.subject_name ? (
                                                <>
                                                    <div style={{ fontWeight: 700 }}>
                                                        {log.subject_name}
                                                    </div>
                                                    <div style={{ color: '#6b7280', fontSize: '12px' }}>
                                                        ID: {log.subject_id}
                                                    </div>
                                                </>
                                            ) : (
                                                <span style={{ color: '#9ca3af' }}>-</span>
                                            )}
                                        </td>

                                        <td style={tdStyle}>
                                            <span style={{ color: '#374151' }}>
                                                {log.ip_address || '-'}
                                            </span>
                                        </td>

                                        <td style={tdStyle}>
                                            {renderProperties(log.properties)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination links={logs.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SummaryCard({ title, value }) {
    return (
        <div
            style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
            }}
        >
            <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: 700 }}>
                {title}
            </div>
            <div
                style={{
                    color: '#111827',
                    fontSize: '28px',
                    fontWeight: 900,
                    marginTop: '6px',
                }}
            >
                {value}
            </div>
        </div>
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
                gap: '6px',
                flexWrap: 'wrap',
                marginTop: '18px',
            }}
        >
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    preserveScroll
                    preserveState
                    style={{
                        padding: '7px 10px',
                        borderRadius: '7px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 700,
                        background: link.active ? '#2563eb' : '#f3f4f6',
                        color: link.active ? '#fff' : '#374151',
                        border: '1px solid #d1d5db',
                        pointerEvents: link.url ? 'auto' : 'none',
                        opacity: link.url ? 1 : 0.45,
                    }}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

const thStyle = {
    textAlign: 'left',
    padding: '12px',
    fontSize: '13px',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
    whiteSpace: 'nowrap',
};

const tdStyle = {
    padding: '12px',
    verticalAlign: 'top',
    fontSize: '14px',
    color: '#111827',
};
