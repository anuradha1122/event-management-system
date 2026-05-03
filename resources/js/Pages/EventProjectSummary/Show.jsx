import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({
    auth,
    event,
    guestSummary,
    rsvpSummary,
    checkInSummary,
    followUpSummary,
    budgetSummary,
    qaSummary,
    activitySummary,
}) {
    const statusColors = {
        draft: '#64748b',
        active: '#16a34a',
        completed: '#2563eb',
        cancelled: '#dc2626',
    };

    const statusLabel = event.status
        ? event.status.charAt(0).toUpperCase() + event.status.slice(1)
        : 'Draft';

    const buttonStyle = (background = '#111827') => ({
        display: 'inline-block',
        padding: '10px 14px',
        background,
        color: '#ffffff',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
    });

    const cardStyle = {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
    };

    const labelStyle = {
        fontSize: '13px',
        color: '#64748b',
        marginBottom: '4px',
    };

    const valueStyle = {
        fontSize: '22px',
        fontWeight: '800',
        color: '#0f172a',
    };

    const smallValueStyle = {
        fontSize: '15px',
        fontWeight: '700',
        color: '#111827',
    };

    const progressOuterStyle = {
        width: '100%',
        height: '10px',
        background: '#e5e7eb',
        borderRadius: '999px',
        overflow: 'hidden',
        marginTop: '10px',
    };

    const progressInnerStyle = (percentage, color = '#2563eb') => ({
        width: `${Math.min(Number(percentage || 0), 100)}%`,
        height: '100%',
        background: color,
        borderRadius: '999px',
    });

    const formatDate = (value) => {
        if (!value) return 'N/A';

        try {
            return new Date(value).toLocaleDateString();
        } catch {
            return value;
        }
    };

    const formatDateTime = (value) => {
        if (!value) return 'N/A';

        try {
            return new Date(value).toLocaleString();
        } catch {
            return value;
        }
    };

    const formatMoney = (value) => {
        const number = Number(value || 0);

        return number.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Project Summary - ${event.title}`} />

            <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '16px',
                            marginBottom: '22px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div>
                            <div style={{ marginBottom: '8px' }}>
                                <Link
                                    href={route('events.show', event.id)}
                                    style={{
                                        color: '#2563eb',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                    }}
                                >
                                    ← Back to Event
                                </Link>
                            </div>

                            <h1
                                style={{
                                    fontSize: '30px',
                                    lineHeight: '36px',
                                    fontWeight: '900',
                                    color: '#0f172a',
                                    margin: 0,
                                }}
                            >
                                Event Project Summary
                            </h1>

                            <p style={{ marginTop: '8px', color: '#64748b', fontSize: '15px' }}>
                                Clean project/demo summary for this event. Because apparently even events now need executive dashboards.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <a
                                href={route('events.final-report.pdf', event.id)}
                                style={buttonStyle('#16a34a')}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Final Report PDF
                            </a>

                            <Link
                                href={route('events.qa-checklist.index', event.id)}
                                style={buttonStyle('#be123c')}
                            >
                                QA Checklist
                            </Link>

                            <Link
                                href={route('events.activity-logs.index', event.id)}
                                style={buttonStyle('#7c3aed')}
                            >
                                Activity Logs
                            </Link>
                        </div>
                    </div>

                    <div
                        style={{
                            ...cardStyle,
                            marginBottom: '20px',
                            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                            color: '#ffffff',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '16px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div>
                                <h2
                                    style={{
                                        fontSize: '26px',
                                        fontWeight: '900',
                                        margin: 0,
                                        color: '#ffffff',
                                    }}
                                >
                                    {event.title}
                                </h2>

                                <p style={{ marginTop: '8px', color: '#cbd5e1' }}>
                                    {event.description || 'No description provided.'}
                                </p>
                            </div>

                            <div>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        background: statusColors[event.status] || '#64748b',
                                        color: '#ffffff',
                                        padding: '8px 14px',
                                        borderRadius: '999px',
                                        fontWeight: '800',
                                        fontSize: '13px',
                                    }}
                                >
                                    {statusLabel}
                                </span>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '14px',
                                marginTop: '20px',
                            }}
                        >
                            <InfoBox label="Event Date" value={formatDate(event.event_date)} dark />
                            <InfoBox label="Event Time" value={event.event_time || 'N/A'} dark />
                            <InfoBox label="Venue" value={event.venue || 'N/A'} dark />
                            <InfoBox label="Event Type" value={event.event_type || 'N/A'} dark />
                            <InfoBox label="Organizer" value={event.user?.name || 'N/A'} dark />
                            <InfoBox label="Contact" value={event.contact_phone || 'N/A'} dark />
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '16px',
                            marginBottom: '20px',
                        }}
                    >
                        <SummaryCard
                            title="Guests"
                            value={guestSummary.total}
                            subtitle={`Total guest count: ${guestSummary.total_guest_count}`}
                            labelStyle={labelStyle}
                            valueStyle={valueStyle}
                            cardStyle={cardStyle}
                        />

                        <SummaryCard
                            title="Invitations"
                            value={rsvpSummary.invitations}
                            subtitle={`${rsvpSummary.answered_invitations} answered`}
                            labelStyle={labelStyle}
                            valueStyle={valueStyle}
                            cardStyle={cardStyle}
                        />

                        <SummaryCard
                            title="QA Passed"
                            value={`${qaSummary.percentage}%`}
                            subtitle={`${qaSummary.passed} of ${qaSummary.total} checks passed`}
                            labelStyle={labelStyle}
                            valueStyle={valueStyle}
                            cardStyle={cardStyle}
                        />

                        <SummaryCard
                            title="Activities"
                            value={activitySummary.total}
                            subtitle="Total logged actions"
                            labelStyle={labelStyle}
                            valueStyle={valueStyle}
                            cardStyle={cardStyle}
                        />
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '18px',
                            marginBottom: '20px',
                        }}
                    >
                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>Guest RSVP Summary</h2>

                            <div style={miniGridStyle}>
                                <MiniStat label="Accepted" value={guestSummary.accepted} color="#16a34a" />
                                <MiniStat label="Declined" value={guestSummary.declined} color="#dc2626" />
                                <MiniStat label="Pending" value={guestSummary.pending} color="#f59e0b" />
                            </div>

                            <div style={{ marginTop: '14px' }}>
                                <p style={labelStyle}>RSVP Questions</p>
                                <p style={smallValueStyle}>{rsvpSummary.questions}</p>
                            </div>

                            <div style={{ marginTop: '14px' }}>
                                <p style={labelStyle}>Invitations without answers</p>
                                <p style={smallValueStyle}>{rsvpSummary.not_answered_invitations}</p>
                            </div>
                        </section>

                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>Check-In Summary</h2>

                            <div style={miniGridStyle}>
                                <MiniStat label="Checked In" value={checkInSummary.checked_in} color="#2563eb" />
                                <MiniStat label="Not Checked In" value={checkInSummary.not_checked_in} color="#64748b" />
                            </div>

                            <div style={progressOuterStyle}>
                                <div style={progressInnerStyle(checkInSummary.percentage, '#2563eb')} />
                            </div>

                            <p style={{ marginTop: '8px', color: '#64748b', fontSize: '13px' }}>
                                {checkInSummary.percentage}% check-in completion
                            </p>
                        </section>

                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>Follow-Up Summary</h2>

                            <div style={miniGridStyle}>
                                <MiniStat label="Followed Up" value={followUpSummary.followed_up} color="#7c3aed" />
                                <MiniStat label="Not Followed" value={followUpSummary.not_followed_up} color="#64748b" />
                            </div>

                            <div style={{ marginTop: '14px' }}>
                                <p style={labelStyle}>Total follow-up actions</p>
                                <p style={smallValueStyle}>{followUpSummary.total_followup_count}</p>
                            </div>

                            <div style={progressOuterStyle}>
                                <div style={progressInnerStyle(followUpSummary.percentage, '#7c3aed')} />
                            </div>

                            <p style={{ marginTop: '8px', color: '#64748b', fontSize: '13px' }}>
                                {followUpSummary.percentage}% guests followed up
                            </p>
                        </section>

                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>Budget / Expense Summary</h2>

                            <div style={miniGridStyle}>
                                <MiniStat label="Expense Items" value={budgetSummary.expense_count} color="#0f172a" />
                                <MiniStat label="Total Amount" value={formatMoney(budgetSummary.total_amount)} color="#16a34a" />
                            </div>

                            <p style={{ marginTop: '12px', color: '#64748b', fontSize: '13px' }}>
                                Amount column used:{' '}
                                <strong>{budgetSummary.amount_column || 'No amount column detected'}</strong>
                            </p>
                        </section>

                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>QA Checklist Summary</h2>

                            <div style={miniGridStyle}>
                                <MiniStat label="Passed" value={qaSummary.passed} color="#16a34a" />
                                <MiniStat label="Failed" value={qaSummary.failed} color="#dc2626" />
                                <MiniStat label="Pending" value={qaSummary.pending} color="#f59e0b" />
                            </div>

                            <div style={progressOuterStyle}>
                                <div style={progressInnerStyle(qaSummary.percentage, '#16a34a')} />
                            </div>

                            <p style={{ marginTop: '8px', color: '#64748b', fontSize: '13px' }}>
                                {qaSummary.percentage}% QA completion
                            </p>
                        </section>

                        <section style={cardStyle}>
                            <h2 style={sectionTitleStyle}>Module Counts</h2>

                            <div style={moduleCountGridStyle}>
                                <ModuleCount label="Tasks" value={event.tasks_count} />
                                <ModuleCount label="Expenses" value={event.expenses_count} />
                                <ModuleCount label="Vendors" value={event.vendors_count} />
                                <ModuleCount label="Schedules" value={event.schedules_count} />
                                <ModuleCount label="Staff" value={event.staff_count} />
                                <ModuleCount label="Reminders" value={event.reminders_count} />
                                <ModuleCount label="Reminder Logs" value={event.reminder_logs_count} />
                                <ModuleCount label="Activity Logs" value={event.activity_logs_count} />
                            </div>
                        </section>
                    </div>

                    <section style={{ ...cardStyle, marginBottom: '20px' }}>
                        <h2 style={sectionTitleStyle}>Event Lifecycle Details</h2>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: '14px',
                            }}
                        >
                            <InfoBox label="Current Status" value={statusLabel} />
                            <InfoBox label="Completed At" value={formatDateTime(event.completed_at)} />
                            <InfoBox label="Completed By" value={event.completed_by?.name || 'N/A'} />
                            <InfoBox label="Cancelled At" value={formatDateTime(event.cancelled_at)} />
                            <InfoBox label="Cancelled By" value={event.cancelled_by?.name || 'N/A'} />
                        </div>
                    </section>

                    <section style={{ ...cardStyle, marginBottom: '20px' }}>
                        <h2 style={sectionTitleStyle}>Latest Activity Logs</h2>

                        {activitySummary.latest.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table
                                    style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        fontSize: '14px',
                                    }}
                                >
                                    <thead>
                                        <tr style={{ background: '#f1f5f9' }}>
                                            <th style={thStyle}>Date</th>
                                            <th style={thStyle}>Action</th>
                                            <th style={thStyle}>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activitySummary.latest.map((log) => (
                                            <tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={tdStyle}>{formatDateTime(log.created_at)}</td>
                                                <td style={tdStyle}>
                                                    <span
                                                        style={{
                                                            display: 'inline-block',
                                                            background: '#eef2ff',
                                                            color: '#3730a3',
                                                            padding: '4px 8px',
                                                            borderRadius: '999px',
                                                            fontSize: '12px',
                                                            fontWeight: '700',
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
                            <p style={{ color: '#64748b' }}>No activity logs found.</p>
                        )}
                    </section>

                    <section style={cardStyle}>
                        <h2 style={sectionTitleStyle}>Project Remarks</h2>

                        <div
                            style={{
                                background: '#f8fafc',
                                border: '1px dashed #cbd5e1',
                                borderRadius: '12px',
                                padding: '16px',
                                color: '#475569',
                                lineHeight: '1.7',
                            }}
                        >
                            <p style={{ marginTop: 0 }}>
                                This summary page is intended for project demonstration, testing review,
                                and final reporting. It combines the main event modules into one readable
                                overview.
                            </p>

                            <p style={{ marginBottom: 0 }}>
                                Recommended final workflow:{' '}
                                <strong>
                                    Manage Event → QA Checklist → Final Event Report PDF → Project Summary → Project Summary PDF
                                </strong>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 0,
    marginBottom: '16px',
};

const miniGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
};

const moduleCountGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '10px',
};

const thStyle = {
    textAlign: 'left',
    padding: '12px',
    color: '#334155',
    fontWeight: '800',
    borderBottom: '1px solid #e5e7eb',
};

const tdStyle = {
    padding: '12px',
    color: '#475569',
    verticalAlign: 'top',
};

function SummaryCard({ title, value, subtitle, labelStyle, valueStyle, cardStyle }) {
    return (
        <div style={cardStyle}>
            <p style={labelStyle}>{title}</p>
            <p style={{ ...valueStyle, margin: 0 }}>{value}</p>
            <p style={{ color: '#64748b', marginTop: '8px', marginBottom: 0, fontSize: '13px' }}>
                {subtitle}
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
            <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{label}</p>
            <p
                style={{
                    color,
                    fontSize: '20px',
                    fontWeight: '900',
                    marginTop: '6px',
                    marginBottom: 0,
                }}
            >
                {value}
            </p>
        </div>
    );
}

function ModuleCount({ label, value }) {
    return (
        <div
            style={{
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '10px',
            }}
        >
            <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>{label}</p>
            <p style={{ margin: '4px 0 0', color: '#0f172a', fontSize: '18px', fontWeight: '900' }}>
                {value || 0}
            </p>
        </div>
    );
}

function InfoBox({ label, value, dark = false }) {
    return (
        <div
            style={{
                background: dark ? 'rgba(255,255,255,0.08)' : '#f8fafc',
                border: dark ? '1px solid rgba(255,255,255,0.14)' : '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '12px',
            }}
        >
            <p
                style={{
                    margin: 0,
                    color: dark ? '#cbd5e1' : '#64748b',
                    fontSize: '12px',
                }}
            >
                {label}
            </p>

            <p
                style={{
                    margin: '5px 0 0',
                    color: dark ? '#ffffff' : '#0f172a',
                    fontSize: '15px',
                    fontWeight: '800',
                    wordBreak: 'break-word',
                }}
            >
                {value || 'N/A'}
            </p>
        </div>
    );
}
