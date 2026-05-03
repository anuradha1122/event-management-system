import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({
    auth,
    logs,
    filters,
    events,
    users,
    actions,
    summary,
}) {
    const [form, setForm] = useState({
        search: filters.search || '',
        event_id: filters.event_id || '',
        user_id: filters.user_id || '',
        action: filters.action || '',
        from_date: filters.from_date || '',
        to_date: filters.to_date || '',
    });

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

    const statusColors = {
        draft: '#64748b',
        active: '#16a34a',
        completed: '#2563eb',
        cancelled: '#dc2626',
    };

    const updateField = (key, value) => {
        setForm((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(route('super-admin.activity-logs.index'), form, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const reset = () => {
        setForm({
            search: '',
            event_id: '',
            user_id: '',
            action: '',
            from_date: '',
            to_date: '',
        });

        router.get(route('super-admin.activity-logs.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Super Admin Activity Logs" />

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
                                Super Admin Activity Logs
                            </h1>

                            <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>
                                Monitor system-wide event activity, user actions, lifecycle changes, QA updates, and operational logs.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link href={route('super-admin.dashboard')} style={buttonStyle('#0f172a')}>
                                Super Admin Dashboard
                            </Link>

                            <Link href={route('super-admin.events.index')} style={buttonStyle('#2563eb')}>
                                Manage All Events
                            </Link>

                            <Link href={route('super-admin.users.index')} style={buttonStyle('#4338ca')}>
                                Manage Users
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
                            <HeroStat label="Total Logs" value={summary.total_logs} />
                            <HeroStat label="Today" value={summary.today_logs} />
                            <HeroStat label="This Week" value={summary.this_week_logs} />
                            <HeroStat label="This Month" value={summary.this_month_logs} />
                            <HeroStat label="System Logs" value={summary.system_logs} />
                            <HeroStat label="User Logs" value={summary.user_logs} />
                        </div>
                    </section>

                    <section style={{ ...cardStyle, marginBottom: '20px' }}>
                        <h2 style={sectionTitleStyle}>Filter Activity Logs</h2>

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
                                        placeholder="Action or description..."
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Event</label>
                                    <select
                                        value={form.event_id}
                                        onChange={(e) => updateField('event_id', e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="">All Events</option>
                                        {(events || []).map((event) => (
                                            <option key={event.id} value={event.id}>
                                                #{event.id} - {event.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>User</label>
                                    <select
                                        value={form.user_id}
                                        onChange={(e) => updateField('user_id', e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="">All Users</option>
                                        {(users || []).map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} {user.email ? `(${user.email})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>Action</label>
                                    <select
                                        value={form.action}
                                        onChange={(e) => updateField('action', e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="">All Actions</option>
                                        {(actions || []).map((action) => (
                                            <option key={action.value} value={action.value}>
                                                {action.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>From Date</label>
                                    <input
                                        type="date"
                                        value={form.from_date}
                                        onChange={(e) => updateField('from_date', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>To Date</label>
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
                                Activity Logs
                            </h2>

                            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                                Showing {logs?.data?.length || 0} of {logs?.total || 0} logs
                            </p>
                        </div>

                        {logs?.data?.length > 0 ? (
                            <>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr style={theadRowStyle}>
                                                <th style={thStyle}>Date</th>
                                                <th style={thStyle}>Action</th>
                                                <th style={thStyle}>Description</th>
                                                <th style={thStyle}>Event</th>
                                                <th style={thStyle}>User</th>
                                                <th style={thStyle}>Links</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {logs.data.map((log) => (
                                                <tr key={log.id} style={trStyle}>
                                                    <td style={tdStyle}>
                                                        <div style={{ fontWeight: '800', color: '#334155' }}>
                                                            {log.created_at || 'N/A'}
                                                        </div>
                                                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                                                            Log #{log.id}
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <ActionBadge action={log.action} />
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <div style={{ maxWidth: '420px', lineHeight: '1.6' }}>
                                                            {log.description || 'N/A'}
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        {log.event?.id ? (
                                                            <div>
                                                                <Link
                                                                    href={route('events.show', log.event.id)}
                                                                    style={{
                                                                        color: '#2563eb',
                                                                        fontWeight: '900',
                                                                        textDecoration: 'none',
                                                                    }}
                                                                >
                                                                    {log.event.title || `Event #${log.event.id}`}
                                                                </Link>

                                                                <div style={{ marginTop: '6px' }}>
                                                                    <StatusBadge
                                                                        status={log.event.status}
                                                                        statusColors={statusColors}
                                                                    />
                                                                </div>

                                                                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '6px' }}>
                                                                    Event date: {log.event.event_date || 'N/A'}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                                                                No event
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td style={tdStyle}>
                                                        {log.user?.id ? (
                                                            <div>
                                                                <div style={{ fontWeight: '900', color: '#0f172a' }}>
                                                                    {log.user.name || 'N/A'}
                                                                </div>

                                                                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                                                                    {log.user.email || ''}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                                                                System
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                gap: '8px',
                                                                flexWrap: 'wrap',
                                                            }}
                                                        >
                                                            {log.event?.id && (
                                                                <>
                                                                    <Link
                                                                        href={route('events.show', log.event.id)}
                                                                        style={smallLinkStyle('#2563eb')}
                                                                    >
                                                                        Event
                                                                    </Link>

                                                                    <Link
                                                                        href={route('events.activity-logs.index', log.event.id)}
                                                                        style={smallLinkStyle('#7c3aed')}
                                                                    >
                                                                        Event Logs
                                                                    </Link>

                                                                    <Link
                                                                        href={route('events.project-summary', log.event.id)}
                                                                        style={smallLinkStyle('#0f172a')}
                                                                    >
                                                                        Summary
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <Pagination links={logs.links} />
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
                                No activity logs found for the selected filters.
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

function ActionBadge({ action }) {
    return (
        <span
            style={{
                display: 'inline-block',
                background: '#eef2ff',
                color: '#3730a3',
                padding: '5px 9px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '900',
                whiteSpace: 'nowrap',
            }}
        >
            {action || 'unknown'}
        </span>
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
