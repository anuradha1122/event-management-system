import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({
    auth,
    users,
    filters = {},
    roleOptions = [],
    summary = {},
}) {
    const [form, setForm] = useState({
        search: filters.search || '',
        role: filters.role || '',
    });

    const safeSummary = {
        total_users: 0,
        super_admins: 0,
        organizers: 0,
        users_without_events: 0,
        total_events: 0,
        total_guests: 0,
        total_invitations: 0,
        total_questions: 0,
        ...summary,
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

        router.get(route('super-admin.users.index'), form, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const reset = () => {
        setForm({
            search: '',
            role: '',
        });

        router.get(route('super-admin.users.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const deleteUser = (user) => {
        if (!confirm(`Delete ${user.name}? This cannot be undone.`)) {
            return;
        }

        router.delete(route('super-admin.users.destroy', user.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Super Admin Users" />

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
                                Super Admin Users / Organizers
                            </h1>

                            <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>
                                View users, roles, organizer event counts, and system usage by user.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link href={route('super-admin.users.create')} style={buttonStyle('#16a34a')}>
                                Add User
                            </Link>

                            <Link href={route('super-admin.dashboard')} style={buttonStyle('#0f172a')}>
                                Super Admin Dashboard
                            </Link>

                            <Link href={route('super-admin.events.index')} style={buttonStyle('#2563eb')}>
                                Manage All Events
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
                            <HeroStat label="Total Users" value={safeSummary.total_users} />
                            <HeroStat label="Super Admins" value={safeSummary.super_admins} />
                            <HeroStat label="Organizers" value={safeSummary.organizers} />
                            <HeroStat label="Users Without Events" value={safeSummary.users_without_events} />
                            <HeroStat label="Total Events" value={safeSummary.total_events} />
                            <HeroStat label="Total Guests" value={safeSummary.total_guests} />
                        </div>
                    </section>

                    <section
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '16px',
                            marginBottom: '20px',
                        }}
                    >
                        <SummaryCard title="Invitations" value={safeSummary.total_invitations} color="#16a34a" cardStyle={cardStyle} />
                        <SummaryCard title="RSVP Questions" value={safeSummary.total_questions} color="#7c3aed" cardStyle={cardStyle} />
                        <SummaryCard title="Events" value={safeSummary.total_events} color="#2563eb" cardStyle={cardStyle} />
                        <SummaryCard title="Guests" value={safeSummary.total_guests} color="#ea580c" cardStyle={cardStyle} />
                    </section>

                    <section style={{ ...cardStyle, marginBottom: '20px' }}>
                        <h2 style={sectionTitleStyle}>Filter Users</h2>

                        <form onSubmit={submit}>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
                                        placeholder="Name or email..."
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Role</label>
                                    <select
                                        value={form.role}
                                        onChange={(e) => updateField('role', e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="">All Roles</option>
                                        {(roleOptions || []).map((role) => (
                                            <option key={role.id} value={role.name}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
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
                                Users
                            </h2>

                            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                                Showing {users?.data?.length || 0} of {users?.total || 0} users
                            </p>
                        </div>

                        {users?.data?.length > 0 ? (
                            <>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr style={theadRowStyle}>
                                                <th style={thStyle}>User</th>
                                                <th style={thStyle}>Roles</th>
                                                <th style={thStyle}>Usage Counts</th>
                                                <th style={thStyle}>Latest Event</th>
                                                <th style={thStyle}>Created</th>
                                                <th style={thStyle}>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {users.data.map((user) => (
                                                <tr key={user.id} style={trStyle}>
                                                    <td style={tdStyle}>
                                                        <div style={{ fontWeight: '900', color: '#0f172a' }}>
                                                            {user.name || 'N/A'}
                                                        </div>

                                                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                                                            {user.email || 'N/A'}
                                                        </div>

                                                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                                                            User #{user.id}
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                            {user.roles?.length > 0 ? (
                                                                user.roles.map((role) => (
                                                                    <RoleBadge key={role} role={role} />
                                                                ))
                                                            ) : (
                                                                <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                                                                    No role
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <div style={countGridStyle}>
                                                            <CountPill label="Events" value={user.events_count} />
                                                            <CountPill label="Guests" value={user.guest_count} />
                                                            <CountPill label="Invites" value={user.invitation_count} />
                                                            <CountPill label="Q" value={user.question_count} />
                                                            <CountPill label="Logs" value={user.activity_log_count} />
                                                        </div>
                                                    </td>

                                                    <td style={tdStyle}>
                                                        {user.latest_event ? (
                                                            <div>
                                                                <Link
                                                                    href={route('events.show', user.latest_event.id)}
                                                                    style={{
                                                                        color: '#2563eb',
                                                                        fontWeight: '900',
                                                                        textDecoration: 'none',
                                                                    }}
                                                                >
                                                                    {user.latest_event.title || `Event #${user.latest_event.id}`}
                                                                </Link>

                                                                <div style={{ marginTop: '6px' }}>
                                                                    <StatusBadge
                                                                        status={user.latest_event.status}
                                                                        statusColors={statusColors}
                                                                    />
                                                                </div>

                                                                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '6px' }}>
                                                                    Event date: {user.latest_event.event_date || 'N/A'}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                                                                No events yet
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td style={tdStyle}>
                                                        {user.created_at || 'N/A'}
                                                    </td>

                                                    <td style={tdStyle}>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                gap: '8px',
                                                                flexWrap: 'wrap',
                                                            }}
                                                        >
                                                            <Link
                                                                href={route('super-admin.users.edit', user.id)}
                                                                style={smallLinkStyle('#16a34a')}
                                                            >
                                                                Edit
                                                            </Link>

                                                            <Link
                                                                href={route('super-admin.users.password.edit', user.id)}
                                                                style={smallLinkStyle('#7c3aed')}
                                                            >
                                                                Password
                                                            </Link>

                                                            <Link
                                                                href={route('super-admin.events.index', {
                                                                    organizer_id: user.id,
                                                                })}
                                                                style={smallLinkStyle('#2563eb')}
                                                            >
                                                                View Events
                                                            </Link>

                                                            {user.latest_event && (
                                                                <Link
                                                                    href={route('events.project-summary', user.latest_event.id)}
                                                                    style={smallLinkStyle('#0f172a')}
                                                                >
                                                                    Latest Summary
                                                                </Link>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() => deleteUser(user)}
                                                                style={smallButtonStyle('#dc2626')}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <Pagination links={users.links} />
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
                                No users found for the selected filters.
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

function SummaryCard({ title, value, color, cardStyle }) {
    return (
        <div style={cardStyle}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '800' }}>
                {title}
            </p>

            <p style={{ margin: '8px 0 0', color, fontSize: '30px', fontWeight: '900' }}>
                {value || 0}
            </p>
        </div>
    );
}

function RoleBadge({ role }) {
    const background = role === 'Super Admin' ? '#0f172a' : '#4338ca';

    return (
        <span
            style={{
                display: 'inline-block',
                background,
                color: '#ffffff',
                padding: '5px 9px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '900',
            }}
        >
            {role}
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

const smallButtonStyle = (background) => ({
    display: 'inline-block',
    background,
    color: '#ffffff',
    padding: '6px 9px',
    borderRadius: '7px',
    fontSize: '12px',
    fontWeight: '800',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
});
