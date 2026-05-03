import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({
    auth,
    project,
    stats,
    finalDocuments,
    superAdminPages,
    organizerPages,
    submissionChecklist,
    demoFlow,
    finalRemarks,
}) {
    const buttonStyle = (background = '#2563eb') => ({
        display: 'inline-block',
        background,
        color: '#ffffff',
        padding: '10px 14px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '800',
        border: 'none',
        cursor: 'pointer',
    });

    const cardStyle = {
        background: '#ffffff',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
    };

    const sectionTitleStyle = {
        fontSize: '22px',
        fontWeight: '900',
        color: '#111827',
        marginBottom: '14px',
    };

    const labelStyle = {
        fontSize: '13px',
        color: '#6b7280',
        marginBottom: '5px',
    };

    const valueStyle = {
        fontSize: '25px',
        fontWeight: '900',
        color: '#111827',
    };

    const tableHeaderStyle = {
        padding: '12px',
        textAlign: 'left',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        fontSize: '13px',
        fontWeight: '900',
        color: '#374151',
    };

    const tableCellStyle = {
        padding: '12px',
        borderBottom: '1px solid #e5e7eb',
        fontSize: '14px',
        color: '#374151',
        verticalAlign: 'top',
    };

    const badgeStyle = (type) => {
        const colors = {
            ready: {
                background: '#dcfce7',
                color: '#166534',
            },
            completed: {
                background: '#dcfce7',
                color: '#166534',
            },
            page: {
                background: '#ede9fe',
                color: '#5b21b6',
            },
            pdf: {
                background: '#fee2e2',
                color: '#991b1b',
            },
        };

        return {
            display: 'inline-block',
            padding: '5px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'capitalize',
            ...(colors[type] || {
                background: '#f3f4f6',
                color: '#374151',
            }),
        };
    };

    const routeExists = (name) => {
        try {
            route(name);
            return true;
        } catch (error) {
            return false;
        }
    };

    const renderAction = (item) => {
        if (!item?.route || !routeExists(item.route)) {
            return (
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                    Route missing
                </span>
            );
        }

        if (item.type === 'pdf') {
            return (
                <a
                    href={route(item.route)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={buttonStyle('#dc2626')}
                >
                    Open PDF
                </a>
            );
        }

        return (
            <Link href={route(item.route)} style={buttonStyle('#2563eb')}>
                Open Page
            </Link>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Master Final Submission Dashboard" />

            <div style={{ padding: '28px', background: '#f3f4f6', minHeight: '100vh' }}>
                <div style={{ maxWidth: '1450px', margin: '0 auto' }}>
                    <div
                        style={{
                            ...cardStyle,
                            marginBottom: '24px',
                            background: '#111827',
                            color: '#ffffff',
                            border: 'none',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '18px',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <h1
                                    style={{
                                        fontSize: '34px',
                                        fontWeight: '900',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Master Final Submission Dashboard
                                </h1>

                                <p
                                    style={{
                                        color: '#d1d5db',
                                        fontSize: '15px',
                                        lineHeight: '1.7',
                                        maxWidth: '900px',
                                        margin: 0,
                                    }}
                                >
                                    {project?.summary}
                                </p>
                            </div>

                            <div>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: '12px 18px',
                                        borderRadius: '999px',
                                        background: '#dcfce7',
                                        color: '#166534',
                                        fontWeight: '900',
                                    }}
                                >
                                    {project?.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                            marginBottom: '24px',
                        }}
                    >
                        <Link href={route('super-admin.dashboard')} style={buttonStyle('#2563eb')}>
                            Super Admin Dashboard
                        </Link>

                        <Link href={route('super-admin.events.index')} style={buttonStyle('#7c3aed')}>
                            All Events
                        </Link>

                        <Link href={route('super-admin.users.index')} style={buttonStyle('#0891b2')}>
                            Users
                        </Link>

                        <Link href={route('super-admin.activity-logs.index')} style={buttonStyle('#f97316')}>
                            Activity Logs
                        </Link>

                        <Link href={route('super-admin.testing-documentation.index')} style={buttonStyle('#9333ea')}>
                            Testing Docs
                        </Link>

                        <Link href={route('super-admin.project-handover.index')} style={buttonStyle('#0f766e')}>
                            Handover
                        </Link>

                        <a
                            href={route('super-admin.system-report.pdf')}
                            style={buttonStyle('#16a34a')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            System PDF
                        </a>

                        <a
                            href={route('super-admin.testing-documentation.pdf')}
                            style={buttonStyle('#dc2626')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Testing PDF
                        </a>

                        <a
                            href={route('super-admin.project-handover.pdf')}
                            style={buttonStyle('#047857')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Handover PDF
                        </a>

                        <a
                            href={route('super-admin.final-submission.pdf')}
                            style={buttonStyle('#be123c')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Final Submission PDF
                        </a>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Project Summary</h2>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                gap: '14px',
                            }}
                        >
                            <InfoBlock label="Project Name" value={project?.name} />
                            <InfoBlock label="Status" value={project?.status} />
                            <InfoBlock label="Local URL" value={project?.local_url} />
                            <InfoBlock label="Database" value={project?.database} />
                            <InfoBlock label="Environment" value={project?.environment} />
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#111827', marginBottom: '8px' }}>
                                Technology Stack
                            </h3>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {project?.technology?.map((item, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            display: 'inline-block',
                                            padding: '7px 11px',
                                            background: '#f3f4f6',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '999px',
                                            fontSize: '13px',
                                            fontWeight: '800',
                                            color: '#374151',
                                        }}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>System Statistics</h2>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                                gap: '14px',
                            }}
                        >
                            <StatCard label="Events" value={stats?.total_events} />
                            <StatCard label="Draft" value={stats?.draft_events} />
                            <StatCard label="Active" value={stats?.active_events} />
                            <StatCard label="Completed" value={stats?.completed_events} />
                            <StatCard label="Cancelled" value={stats?.cancelled_events} />
                            <StatCard label="Users" value={stats?.total_users} />
                            <StatCard label="Guests" value={stats?.total_guests} />
                            <StatCard label="Invitations" value={stats?.total_invitations} />
                            <StatCard label="Questions" value={stats?.total_questions} />
                            <StatCard label="Answers" value={stats?.total_answers} />
                            <StatCard label="Tasks" value={stats?.total_tasks} />
                            <StatCard label="Expenses" value={stats?.total_expenses} />
                            <StatCard label="Vendors" value={stats?.total_vendors} />
                            <StatCard label="Schedules" value={stats?.total_schedules} />
                            <StatCard label="Staff" value={stats?.total_staff} />
                            <StatCard label="Reminders" value={stats?.total_reminders} />
                            <StatCard label="Reminder Logs" value={stats?.total_reminder_logs} />
                            <StatCard label="QA Checks" value={stats?.total_qa_checks} />
                            <StatCard label="Activity Logs" value={stats?.total_activity_logs} />
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px', overflowX: 'auto' }}>
                        <h2 style={sectionTitleStyle}>Final Documents</h2>

                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>Document</th>
                                    <th style={tableHeaderStyle}>Description</th>
                                    <th style={tableHeaderStyle}>Type</th>
                                    <th style={tableHeaderStyle}>Status</th>
                                    <th style={tableHeaderStyle}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {finalDocuments?.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ ...tableCellStyle, fontWeight: '900', color: '#111827' }}>
                                            {item.title}
                                        </td>

                                        <td style={tableCellStyle}>
                                            {item.description}
                                        </td>

                                        <td style={tableCellStyle}>
                                            <span style={badgeStyle(item.type)}>
                                                {item.type}
                                            </span>
                                        </td>

                                        <td style={tableCellStyle}>
                                            <span style={badgeStyle(item.status)}>
                                                {item.status}
                                            </span>
                                        </td>

                                        <td style={tableCellStyle}>
                                            {renderAction(item)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <TwoColumnLinks
                        title="Super Admin Pages"
                        items={superAdminPages}
                        renderAction={renderAction}
                        tableHeaderStyle={tableHeaderStyle}
                        tableCellStyle={tableCellStyle}
                        badgeStyle={badgeStyle}
                    />

                    <TwoColumnLinks
                        title="Organizer / General Pages"
                        items={organizerPages}
                        renderAction={renderAction}
                        tableHeaderStyle={tableHeaderStyle}
                        tableCellStyle={tableCellStyle}
                        badgeStyle={badgeStyle}
                    />

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Final Submission Checklist</h2>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '12px',
                            }}
                        >
                            {submissionChecklist?.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '12px',
                                        alignItems: 'center',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '10px',
                                        padding: '14px',
                                        background: '#f9fafb',
                                    }}
                                >
                                    <div style={{ color: '#374151', fontWeight: '700' }}>
                                        {item.item}
                                    </div>

                                    <span style={badgeStyle(item.status)}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Recommended Final Demo Flow</h2>

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {demoFlow?.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '55px 1fr',
                                        gap: '12px',
                                        alignItems: 'start',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '10px',
                                        padding: '14px',
                                        background: '#f9fafb',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '999px',
                                            background: '#dbeafe',
                                            color: '#1e40af',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '900',
                                        }}
                                    >
                                        {index + 1}
                                    </div>

                                    <div>
                                        <div style={{ fontWeight: '900', color: '#111827', marginBottom: '4px' }}>
                                            {item.step}
                                        </div>

                                        <div style={{ color: '#6b7280', lineHeight: '1.7' }}>
                                            {item.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        style={{
                            ...cardStyle,
                            marginBottom: '24px',
                            background: '#111827',
                            color: '#ffffff',
                        }}
                    >
                        <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '12px' }}>
                            Final Remarks
                        </h2>

                        <ul style={{ margin: 0, paddingLeft: '22px', color: '#e5e7eb', lineHeight: '1.9' }}>
                            {finalRemarks?.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );

    function InfoBlock({ label, value }) {
        return (
            <div
                style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '14px',
                    background: '#f9fafb',
                }}
            >
                <div style={labelStyle}>{label}</div>
                <div style={{ fontWeight: '900', color: '#111827', wordBreak: 'break-word' }}>
                    {value ?? 'N/A'}
                </div>
            </div>
        );
    }

    function StatCard({ label, value }) {
        return (
            <div
                style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '14px',
                    background: '#f9fafb',
                }}
            >
                <div style={labelStyle}>{label}</div>
                <div style={valueStyle}>{value ?? 0}</div>
            </div>
        );
    }
}

function TwoColumnLinks({
    title,
    items,
    renderAction,
    tableHeaderStyle,
    tableCellStyle,
    badgeStyle,
}) {
    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb',
            marginBottom: '24px',
            overflowX: 'auto',
        }}>
            <h2 style={{
                fontSize: '22px',
                fontWeight: '900',
                color: '#111827',
                marginBottom: '14px',
            }}>
                {title}
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Page</th>
                        <th style={tableHeaderStyle}>Description</th>
                        <th style={tableHeaderStyle}>Type</th>
                        <th style={tableHeaderStyle}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {items?.map((item, index) => (
                        <tr key={index}>
                            <td style={{ ...tableCellStyle, fontWeight: '900', color: '#111827' }}>
                                {item.title}
                            </td>

                            <td style={tableCellStyle}>
                                {item.description}
                            </td>

                            <td style={tableCellStyle}>
                                <span style={badgeStyle(item.type)}>
                                    {item.type}
                                </span>
                            </td>

                            <td style={tableCellStyle}>
                                {renderAction(item)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
