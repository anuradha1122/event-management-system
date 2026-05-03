import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({
    auth,
    summary,
    eventsByStatus,
    recentEvents,
    recentActivityLogs,
    topOrganizers,
    monthlyEvents,
}) {
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

    const statusColors = {
        draft: '#64748b',
        active: '#16a34a',
        completed: '#2563eb',
        cancelled: '#dc2626',
    };

    const maxMonthlyCount = Math.max(...(monthlyEvents || []).map((item) => item.count), 1);
    const maxOrganizerCount = Math.max(...(topOrganizers || []).map((item) => item.events_count), 1);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Super Admin Dashboard" />

            <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
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
                                Super Admin Dashboard
                            </h1>

                            <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>
                                System-wide monitoring for events, organizers, guests, invitations, QA, and activity logs.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link href={route('super-admin.events.index')} style={buttonStyle('#2563eb')}>
                                Manage All Events
                            </Link>

                            <Link href={route('super-admin.users.index')} style={buttonStyle('#4338ca')}>
                                Manage Users
                            </Link>

                            <Link href={route('super-admin.activity-logs.index')} style={buttonStyle('#7c3aed')}>
                                Activity Logs
                            </Link>

                            <Link href={route('events.index')} style={buttonStyle('#0f172a')}>
                                Normal Event List
                            </Link>

                            <a
                                href={route('super-admin.system-report.pdf')}
                                style={buttonStyle('#16a34a')}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                System Report PDF
                            </a>

                            <Link href={route('super-admin.testing-documentation.index')} style={buttonStyle('#9333ea')}>
                                Testing Documentation
                            </Link>

                            <Link href={route('super-admin.project-handover.index')} style={buttonStyle('#0f766e')}>
                                Project Handover
                            </Link>

                            <Link href={route('super-admin.final-submission.index')} style={buttonStyle('#be123c')}>
                                Final Submission
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
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '14px',
                            }}
                        >
                            <HeroStat label="Total Events" value={summary.total_events} />
                            <HeroStat label="Organizers" value={summary.total_organizers} />
                            <HeroStat label="Users" value={summary.total_users} />
                            <HeroStat label="Guests" value={summary.total_guests} />
                            <HeroStat label="Invitations" value={summary.total_invitations} />
                            <HeroStat label="Activity Logs" value={summary.total_activity_logs} />
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
                        <SummaryCard
                            title="Draft Events"
                            value={summary.draft_events}
                            color="#64748b"
                            cardStyle={cardStyle}
                        />

                        <SummaryCard
                            title="Active Events"
                            value={summary.active_events}
                            color="#16a34a"
                            cardStyle={cardStyle}
                        />

                        <SummaryCard
                            title="Completed Events"
                            value={summary.completed_events}
                            color="#2563eb"
                            cardStyle={cardStyle}
                        />

                        <SummaryCard
                            title="Cancelled Events"
                            value={summary.cancelled_events}
                            color="#dc2626"
                            cardStyle={cardStyle}
                        />
                    </section>

                    <section
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '16px',
                            marginBottom: '20px',
                        }}
                    >
                        <SummaryCard
                            title="RSVP Questions"
                            value={summary.total_questions}
                            color="#7c3aed"
                            cardStyle={cardStyle}
                        />

                        <SummaryCard
                            title="RSVP Answers"
                            value={summary.total_answers}
                            color="#0891b2"
                            cardStyle={cardStyle}
                        />

                        <SummaryCard
                            title="QA Checks"
                            value={summary.total_qa_checks}
                            color="#be123c"
                            cardStyle={cardStyle}
                        />

                        <SummaryCard
                            title="Invitations"
                            value={summary.total_invitations}
                            color="#ea580c"
                            cardStyle={cardStyle}
                        />
                    </section>

                    <section
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                            gap: '18px',
                            marginBottom: '20px',
                        }}
                    >
                        <div style={cardStyle}>
                            <h2 style={sectionTitleStyle}>Events by Status</h2>

                            <div style={{ display: 'grid', gap: '12px' }}>
                                {(eventsByStatus || []).map((item) => {
                                    const percentage =
                                        summary.total_events > 0
                                            ? Math.round((item.count / summary.total_events) * 100)
                                            : 0;

                                    return (
                                        <div key={item.status}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '6px',
                                                }}
                                            >
                                                <span style={{ fontWeight: '800', color: '#334155' }}>
                                                    {item.label}
                                                </span>

                                                <span style={{ color: '#64748b', fontSize: '13px' }}>
                                                    {item.count} events · {percentage}%
                                                </span>
                                            </div>

                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '10px',
                                                    background: '#e5e7eb',
                                                    borderRadius: '999px',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: `${percentage}%`,
                                                        height: '100%',
                                                        background: statusColors[item.status] || '#64748b',
                                                        borderRadius: '999px',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <h2 style={sectionTitleStyle}>Monthly Event Creation</h2>

                            {(monthlyEvents || []).length > 0 ? (
                                <div style={{ display: 'grid', gap: '10px' }}>
                                    {monthlyEvents.map((item) => {
                                        const percentage = Math.round((item.count / maxMonthlyCount) * 100);

                                        return (
                                            <div key={item.month}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '5px',
                                                    }}
                                                >
                                                    <span style={{ color: '#334155', fontWeight: '800' }}>
                                                        {item.month}
                                                    </span>
                                                    <span style={{ color: '#64748b', fontSize: '13px' }}>
                                                        {item.count}
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        width: '100%',
                                                        height: '9px',
                                                        background: '#e5e7eb',
                                                        borderRadius: '999px',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: `${percentage}%`,
                                                            height: '100%',
                                                            background: '#2563eb',
                                                            borderRadius: '999px',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <EmptyText text="No monthly event data found." />
                            )}
                        </div>
                    </section>

                    <section
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
                            gap: '18px',
                            marginBottom: '20px',
                        }}
                    >
                        <div style={cardStyle}>
                            <h2 style={sectionTitleStyle}>Top Organizers</h2>

                            {(topOrganizers || []).length > 0 ? (
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {topOrganizers.map((organizer, index) => {
                                        const percentage = Math.round(
                                            (organizer.events_count / maxOrganizerCount) * 100
                                        );

                                        return (
                                            <div key={organizer.id}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        gap: '12px',
                                                        marginBottom: '6px',
                                                    }}
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: '900', color: '#0f172a' }}>
                                                            {index + 1}. {organizer.name || 'N/A'}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                            {organizer.email || 'N/A'}
                                                        </div>
                                                    </div>

                                                    <div
                                                        style={{
                                                            fontWeight: '900',
                                                            color: '#2563eb',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {organizer.events_count} events
                                                    </div>
                                                </div>

                                                <div
                                                    style={{
                                                        width: '100%',
                                                        height: '9px',
                                                        background: '#e5e7eb',
                                                        borderRadius: '999px',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: `${percentage}%`,
                                                            height: '100%',
                                                            background: '#7c3aed',
                                                            borderRadius: '999px',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <EmptyText text="No organizer event data found." />
                            )}
                        </div>

                        <div style={cardStyle}>
                            <h2 style={sectionTitleStyle}>System Usage Summary</h2>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                    gap: '12px',
                                }}
                            >
                                <MiniStat label="Guests" value={summary.total_guests} color="#2563eb" />
                                <MiniStat label="Invitations" value={summary.total_invitations} color="#16a34a" />
                                <MiniStat label="Questions" value={summary.total_questions} color="#7c3aed" />
                                <MiniStat label="Answers" value={summary.total_answers} color="#0891b2" />
                                <MiniStat label="QA Checks" value={summary.total_qa_checks} color="#be123c" />
                                <MiniStat label="Logs" value={summary.total_activity_logs} color="#ea580c" />
                            </div>

                            <p
                                style={{
                                    marginTop: '14px',
                                    marginBottom: 0,
                                    color: '#64748b',
                                    fontSize: '14px',
                                    lineHeight: '1.7',
                                }}
                            >
                                This panel gives the Super Admin a quick system-wide view without opening every
                                event manually like some tragic spreadsheet archaeologist.
                            </p>
                        </div>
                    </section>

                    <section style={{ ...cardStyle, marginBottom: '20px' }}>
                        <h2 style={sectionTitleStyle}>Recent Events</h2>

                        {(recentEvents || []).length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr style={theadRowStyle}>
                                            <th style={thStyle}>Event</th>
                                            <th style={thStyle}>Organizer</th>
                                            <th style={thStyle}>Date</th>
                                            <th style={thStyle}>Venue</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={thStyle}>Created</th>
                                            <th style={thStyle}>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentEvents.map((event) => (
                                            <tr key={event.id} style={trStyle}>
                                                <td style={tdStyle}>
                                                    <strong>{event.title}</strong>
                                                </td>

                                                <td style={tdStyle}>
                                                    <div>{event.organizer?.name || 'N/A'}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                        {event.organizer?.email || ''}
                                                    </div>
                                                </td>

                                                <td style={tdStyle}>
                                                    {event.event_date || 'N/A'}
                                                    {event.event_time ? ` · ${event.event_time}` : ''}
                                                </td>

                                                <td style={tdStyle}>{event.venue || 'N/A'}</td>

                                                <td style={tdStyle}>
                                                    <StatusBadge
                                                        status={event.status}
                                                        statusColors={statusColors}
                                                    />
                                                </td>

                                                <td style={tdStyle}>{event.created_at || 'N/A'}</td>

                                                <td style={tdStyle}>
                                                    <Link
                                                        href={route('events.show', event.id)}
                                                        style={{
                                                            color: '#2563eb',
                                                            fontWeight: '800',
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyText text="No recent events found." />
                        )}
                    </section>

                    <section style={cardStyle}>
                        <h2 style={sectionTitleStyle}>Recent Activity Logs</h2>

                        {(recentActivityLogs || []).length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr style={theadRowStyle}>
                                            <th style={thStyle}>Date</th>
                                            <th style={thStyle}>Event</th>
                                            <th style={thStyle}>User</th>
                                            <th style={thStyle}>Action</th>
                                            <th style={thStyle}>Description</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentActivityLogs.map((log) => (
                                            <tr key={log.id} style={trStyle}>
                                                <td style={tdStyle}>{log.created_at || 'N/A'}</td>

                                                <td style={tdStyle}>
                                                    {log.event?.id ? (
                                                        <Link
                                                            href={route('events.show', log.event.id)}
                                                            style={{
                                                                color: '#2563eb',
                                                                fontWeight: '800',
                                                                textDecoration: 'none',
                                                            }}
                                                        >
                                                            {log.event.title || `Event #${log.event.id}`}
                                                        </Link>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>

                                                <td style={tdStyle}>
                                                    <div>{log.user?.name || 'System'}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                        {log.user?.email || ''}
                                                    </div>
                                                </td>

                                                <td style={tdStyle}>
                                                    <span
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '4px 8px',
                                                            background: '#eef2ff',
                                                            color: '#3730a3',
                                                            borderRadius: '999px',
                                                            fontSize: '12px',
                                                            fontWeight: '800',
                                                        }}
                                                    >
                                                        {log.action}
                                                    </span>
                                                </td>

                                                <td style={tdStyle}>{log.description || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyText text="No recent activity logs found." />
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
            <p
                style={{
                    margin: 0,
                    color: '#64748b',
                    fontSize: '13px',
                    fontWeight: '800',
                }}
            >
                {title}
            </p>

            <p
                style={{
                    margin: '8px 0 0',
                    color,
                    fontSize: '30px',
                    fontWeight: '900',
                }}
            >
                {value || 0}
            </p>
        </div>
    );
}

function MiniStat({ label, value, color }) {
    return (
        <div
            style={{
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '12px',
            }}
        >
            <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: '800' }}>
                {label}
            </p>
            <p
                style={{
                    margin: '6px 0 0',
                    color,
                    fontSize: '22px',
                    fontWeight: '900',
                }}
            >
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

function EmptyText({ text }) {
    return (
        <p
            style={{
                color: '#64748b',
                fontSize: '14px',
                margin: 0,
                lineHeight: '1.6',
            }}
        >
            {text}
        </p>
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
