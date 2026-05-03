import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({
    auth,
    event,
    guestSummary,
    invitationSummary,
    checkInSummary,
    followUpSummary,
    reminderSummary,
    expenseSummary,
    recentActivities,
    charts,
}) {
    const buttonStyle = (backgroundColor = '#2563eb') => ({
        display: 'inline-flex',
        backgroundColor,
        color: '#ffffff',
        padding: '10px 16px',
        borderRadius: '8px',
        fontWeight: '700',
        textDecoration: 'none',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    });

    const cardStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
    };

    const pageBg = {
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
        padding: '24px',
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={`Dashboard - ${event.title}`} />

            <div style={pageBg}>
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
                                    margin: 0,
                                    fontSize: '30px',
                                    fontWeight: 900,
                                    color: '#111827',
                                }}
                            >
                                Event Dashboard
                            </h1>

                            <p
                                style={{
                                    marginTop: '6px',
                                    color: '#6b7280',
                                    fontSize: '15px',
                                }}
                            >
                                {event.title}
                            </p>

                            <p
                                style={{
                                    marginTop: '4px',
                                    color: '#6b7280',
                                    fontSize: '14px',
                                }}
                            >
                                {event.event_date || '-'} {event.event_time || ''} ·{' '}
                                {event.venue || 'No venue'}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link
                                href={route('events.show', event.id)}
                                style={buttonStyle('#4b5563')}
                            >
                                Back to Event
                            </Link>

                            <Link
                                href={route('events.activity-logs.index', event.id)}
                                style={buttonStyle('#111827')}
                            >
                                Activity Logs
                            </Link>
                        </div>
                    </div>

                    <SectionTitle title="Main Summary" />

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '14px',
                            marginBottom: '24px',
                        }}
                    >
                        <SummaryCard title="Total Guests" value={guestSummary.total} />
                        <SummaryCard title="Accepted" value={guestSummary.accepted} />
                        <SummaryCard title="Declined" value={guestSummary.declined} />
                        <SummaryCard title="Pending" value={guestSummary.pending} />
                        <SummaryCard title="Responded" value={invitationSummary.responded} />
                        <SummaryCard title="Not Responded" value={invitationSummary.not_responded} />
                        <SummaryCard title="Checked In" value={checkInSummary.checked_in} />
                        <SummaryCard title="Not Arrived" value={checkInSummary.not_arrived} />
                        <SummaryCard title="Followed Up" value={followUpSummary.followed_up} />
                        <SummaryCard title="Reminder Failed" value={reminderSummary.failed} />
                        <SummaryCard title="Total Expenses" value={`Rs. ${formatMoney(expenseSummary.total_amount)}`} />
                        <SummaryCard title="Pending Payments" value={`Rs. ${formatMoney(expenseSummary.pending_amount)}`} />
                    </div>

                    <SectionTitle title="Performance Percentages" />

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                            gap: '14px',
                            marginBottom: '24px',
                        }}
                    >
                        <ProgressCard
                            title="Invitation Sent Rate"
                            value={invitationSummary.sent_rate}
                            description={`${invitationSummary.sent} of ${invitationSummary.total} invitations sent`}
                        />

                        <ProgressCard
                            title="RSVP Response Rate"
                            value={invitationSummary.response_rate}
                            description={`${invitationSummary.responded} guests responded`}
                        />

                        <ProgressCard
                            title="Acceptance Rate"
                            value={guestSummary.acceptance_rate}
                            description={`${guestSummary.accepted} accepted invitations`}
                        />

                        <ProgressCard
                            title="Guest Check-In Rate"
                            value={checkInSummary.guest_check_in_rate}
                            description={`${checkInSummary.checked_in} guests checked in`}
                        />

                        <ProgressCard
                            title="People Attendance Rate"
                            value={checkInSummary.people_attendance_rate}
                            description={`${checkInSummary.arrived_people} of ${checkInSummary.expected_people} expected people arrived`}
                        />

                        <ProgressCard
                            title="Follow-Up Completion"
                            value={followUpSummary.followup_rate}
                            description={`${followUpSummary.followed_up} guests followed up`}
                        />

                        <ProgressCard
                            title="Reminder Success Rate"
                            value={reminderSummary.success_rate}
                            description={`${reminderSummary.sent} sent, ${reminderSummary.failed} failed`}
                        />
                    </div>

                    <SectionTitle title="Charts" />

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '16px',
                            marginBottom: '24px',
                        }}
                    >
                        <SimpleChart title="RSVP Breakdown" data={charts.rsvp} />
                        <SimpleChart title="Response Status" data={charts.response} />
                        <SimpleChart title="Check-In Status" data={charts.checkIn} />
                        <SimpleChart title="Follow-Up Status" data={charts.followUp} />
                        <SimpleChart title="Reminder Status" data={charts.reminders} />
                        <SimpleChart
                            title="Expense Category Breakdown"
                            data={charts.expenses}
                            money
                        />
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '16px',
                            marginBottom: '24px',
                        }}
                    >
                        <div style={cardStyle}>
                            <h2 style={boxTitleStyle}>Guest Details</h2>

                            <InfoRow label="Total Guest Records" value={guestSummary.total} />
                            <InfoRow label="Total People Count" value={guestSummary.total_guest_count} />
                            <InfoRow label="Accepted People Count" value={guestSummary.accepted_guest_count} />
                            <InfoRow label="Expected People" value={checkInSummary.expected_people} />
                            <InfoRow label="Arrived People" value={checkInSummary.arrived_people} />
                        </div>

                        <div style={cardStyle}>
                            <h2 style={boxTitleStyle}>Follow-Up Details</h2>

                            <InfoRow label="Followed Up" value={followUpSummary.followed_up} />
                            <InfoRow label="Not Followed Up" value={followUpSummary.not_followed_up} />
                            <InfoRow label="Total Follow-Up Attempts" value={followUpSummary.total_attempts} />
                            <InfoRow label="Multiple Follow-Ups" value={followUpSummary.multiple_followups} />
                        </div>

                        <div style={cardStyle}>
                            <h2 style={boxTitleStyle}>Reminder Details</h2>

                            <InfoRow label="Total Reminders" value={reminderSummary.total} />
                            <InfoRow label="Pending" value={reminderSummary.pending} />
                            <InfoRow label="Sent Emails" value={reminderSummary.sent} />
                            <InfoRow label="Failed Emails" value={reminderSummary.failed} />
                            <InfoRow label="Unreviewed Failed Emails" value={reminderSummary.unreviewed_failed} />
                            <InfoRow label="Reviewed Failed Emails" value={reminderSummary.reviewed_failed} />
                        </div>

                        <div style={cardStyle}>
                            <h2 style={boxTitleStyle}>Expense Details</h2>

                            <InfoRow label="Expense Count" value={expenseSummary.expense_count} />
                            <InfoRow label="Total Amount" value={`Rs. ${formatMoney(expenseSummary.total_amount)}`} />
                            <InfoRow label="Paid Amount" value={`Rs. ${formatMoney(expenseSummary.paid_amount)}`} />
                            <InfoRow label="Pending Amount" value={`Rs. ${formatMoney(expenseSummary.pending_amount)}`} />
                        </div>
                    </div>

                    <SectionTitle title="Recent Activity" />

                    <div style={cardStyle}>
                        {recentActivities.length === 0 ? (
                            <div
                                style={{
                                    padding: '20px',
                                    color: '#6b7280',
                                    textAlign: 'center',
                                }}
                            >
                                No recent activity found. Either nothing happened or the database is being suspiciously quiet.
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '10px',
                                            padding: '12px',
                                            backgroundColor: '#f9fafb',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                gap: '10px',
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: 900,
                                                        color: '#111827',
                                                    }}
                                                >
                                                    {activity.action_label}
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: '4px',
                                                        color: '#374151',
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    {activity.description || '-'}
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    textAlign: 'right',
                                                    color: '#6b7280',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                <div>{activity.created_at}</div>
                                                <div>{activity.created_at_human}</div>
                                                <div>By: {activity.user_name}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SectionTitle({ title }) {
    return (
        <h2
            style={{
                margin: '0 0 12px 0',
                fontSize: '20px',
                fontWeight: 900,
                color: '#111827',
            }}
        >
            {title}
        </h2>
    );
}

function SummaryCard({ title, value }) {
    return (
        <div
            style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
            }}
        >
            <div
                style={{
                    color: '#6b7280',
                    fontSize: '13px',
                    fontWeight: 800,
                }}
            >
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

function ProgressCard({ title, value, description }) {
    const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
    const width = Math.max(0, Math.min(safeValue, 100));

    return (
        <div
            style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '10px',
                    marginBottom: '8px',
                }}
            >
                <div style={{ fontWeight: 900, color: '#111827' }}>{title}</div>
                <div style={{ fontWeight: 900, color: '#2563eb' }}>
                    {safeValue}%
                </div>
            </div>

            <div
                style={{
                    height: '10px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    marginBottom: '8px',
                }}
            >
                <div
                    style={{
                        width: `${width}%`,
                        height: '100%',
                        backgroundColor: '#2563eb',
                    }}
                />
            </div>

            <div style={{ color: '#6b7280', fontSize: '13px' }}>
                {description}
            </div>
        </div>
    );
}

function SimpleChart({ title, data, money = false }) {
    const safeData = Array.isArray(data) ? data : [];
    const max = Math.max(...safeData.map((item) => Number(item.value) || 0), 0);

    return (
        <div
            style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
            }}
        >
            <h3 style={boxTitleStyle}>{title}</h3>

            {safeData.length === 0 || max === 0 ? (
                <div
                    style={{
                        padding: '18px 0',
                        color: '#6b7280',
                        fontSize: '14px',
                    }}
                >
                    No data available.
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                    {safeData.map((item, index) => {
                        const value = Number(item.value) || 0;
                        const width = max > 0 ? Math.round((value / max) * 100) : 0;

                        return (
                            <div key={`${item.label}-${index}`}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '10px',
                                        fontSize: '14px',
                                        marginBottom: '4px',
                                    }}
                                >
                                    <span style={{ fontWeight: 800, color: '#374151' }}>
                                        {item.label}
                                    </span>

                                    <span style={{ fontWeight: 900, color: '#111827' }}>
                                        {money ? `Rs. ${formatMoney(value)}` : value}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        height: '10px',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '999px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${width}%`,
                                            backgroundColor: chartColors[index % chartColors.length],
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '9px 0',
                borderBottom: '1px solid #f3f4f6',
            }}
        >
            <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: 700 }}>
                {label}
            </div>

            <div style={{ color: '#111827', fontSize: '14px', fontWeight: 900 }}>
                {value}
            </div>
        </div>
    );
}

function formatMoney(value) {
    const number = Number(value || 0);

    return number.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

const boxTitleStyle = {
    margin: '0 0 12px 0',
    fontSize: '17px',
    fontWeight: 900,
    color: '#111827',
};

const chartColors = [
    '#2563eb',
    '#16a34a',
    '#dc2626',
    '#d97706',
    '#7c3aed',
    '#0891b2',
    '#4b5563',
];
