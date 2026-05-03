import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({
    auth,
    project,
    systemStats,
    completedModules,
    accessSummary,
    finalDocuments,
    setupNotes,
    handoverChecklist,
    futureImprovements,
    readiness,
}) {
    const buttonStyle = (background = '#2563eb') => ({
        display: 'inline-block',
        background,
        color: '#fff',
        padding: '10px 14px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '700',
        border: 'none',
        cursor: 'pointer',
    });

    const cardStyle = {
        background: '#fff',
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

    const smallLabelStyle = {
        fontSize: '13px',
        color: '#6b7280',
        marginBottom: '5px',
    };

    const statValueStyle = {
        fontSize: '26px',
        fontWeight: '900',
        color: '#111827',
    };

    const badgeStyle = (status) => {
        const colors = {
            completed: {
                background: '#dcfce7',
                color: '#166534',
            },
            Configured: {
                background: '#dcfce7',
                color: '#166534',
            },
            Available: {
                background: '#dbeafe',
                color: '#1e40af',
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
            fontWeight: '800',
            textTransform: 'capitalize',
            ...(colors[status] || {
                background: '#f3f4f6',
                color: '#374151',
            }),
        };
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

    const routeExists = (name) => {
        try {
            route(name);
            return true;
        } catch (error) {
            return false;
        }
    };

    const renderDocumentButton = (document) => {
        if (!document?.route || !routeExists(document.route)) {
            return (
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                    Route missing
                </span>
            );
        }

        if (document.type === 'pdf') {
            return (
                <a
                    href={route(document.route)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={buttonStyle('#dc2626')}
                >
                    Open PDF
                </a>
            );
        }

        return (
            <Link href={route(document.route)} style={buttonStyle('#2563eb')}>
                Open Page
            </Link>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Final Project Handover" />

            <div style={{ padding: '28px', background: '#f3f4f6', minHeight: '100vh' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#111827', marginBottom: '8px' }}>
                            Final Project Handover / Submission Summary
                        </h1>

                        <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: '1.7', maxWidth: '950px' }}>
                            This page summarizes the completed Smart Event Invitation & Planning System for final demo,
                            project review, documentation submission, and handover.
                        </p>
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
                            Manage All Events
                        </Link>

                        <Link href={route('super-admin.users.index')} style={buttonStyle('#0891b2')}>
                            Manage Users
                        </Link>

                        <Link href={route('super-admin.activity-logs.index')} style={buttonStyle('#f97316')}>
                            Activity Logs
                        </Link>

                        <Link href={route('super-admin.testing-documentation.index')} style={buttonStyle('#9333ea')}>
                            Testing Documentation
                        </Link>

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
                            style={buttonStyle('#0f766e')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Handover PDF
                        </a>

                        <a
                            href={route('super-admin.system-report.pdf')}
                            style={buttonStyle('#16a34a')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            System Report PDF
                        </a>
                    </div>

                    <div
                        style={{
                            ...cardStyle,
                            marginBottom: '24px',
                            borderLeft: '6px solid #16a34a',
                        }}
                    >
                        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#111827', marginBottom: '8px' }}>
                            {readiness?.status}
                        </h2>

                        <p style={{ color: '#4b5563', lineHeight: '1.7', margin: 0 }}>
                            {readiness?.message}
                        </p>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Project Overview</h2>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '16px',
                            }}
                        >
                            <InfoBlock label="Project Name" value={project?.name} />
                            <InfoBlock label="Local URL" value={project?.local_url} />
                            <InfoBlock label="Database" value={project?.database} />
                            <InfoBlock label="Environment" value={project?.environment} />
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <div style={smallLabelStyle}>Purpose</div>
                            <div style={{ color: '#374151', lineHeight: '1.7' }}>
                                {project?.purpose}
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '16px',
                                marginTop: '18px',
                            }}
                        >
                            <ListBox title="Target Users" items={project?.target_users} />
                            <ListBox title="Technology Stack" items={project?.tech_stack} />
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Database / System Summary</h2>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                                gap: '14px',
                            }}
                        >
                            <StatCard label="Total Events" value={systemStats?.total_events} />
                            <StatCard label="Draft Events" value={systemStats?.draft_events} />
                            <StatCard label="Active Events" value={systemStats?.active_events} />
                            <StatCard label="Completed Events" value={systemStats?.completed_events} />
                            <StatCard label="Cancelled Events" value={systemStats?.cancelled_events} />
                            <StatCard label="Users" value={systemStats?.total_users} />
                            <StatCard label="Guests" value={systemStats?.total_guests} />
                            <StatCard label="Invitations" value={systemStats?.total_invitations} />
                            <StatCard label="Questions" value={systemStats?.total_questions} />
                            <StatCard label="Answers" value={systemStats?.total_answers} />
                            <StatCard label="Tasks" value={systemStats?.total_tasks} />
                            <StatCard label="Expenses" value={systemStats?.total_expenses} />
                            <StatCard label="Vendors" value={systemStats?.total_vendors} />
                            <StatCard label="Schedules" value={systemStats?.total_schedules} />
                            <StatCard label="Staff" value={systemStats?.total_staff} />
                            <StatCard label="Reminders" value={systemStats?.total_reminders} />
                            <StatCard label="Reminder Logs" value={systemStats?.total_reminder_logs} />
                            <StatCard label="QA Checks" value={systemStats?.total_qa_checks} />
                            <StatCard label="Activity Logs" value={systemStats?.total_activity_logs} />
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Completed Modules</h2>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '16px',
                            }}
                        >
                            {completedModules?.map((group, index) => (
                                <div
                                    key={index}
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        background: '#f9fafb',
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: '17px',
                                            fontWeight: '900',
                                            color: '#111827',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {group.group}
                                    </h3>

                                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#374151', lineHeight: '1.8' }}>
                                        {group.items?.map((item, itemIndex) => (
                                            <li key={itemIndex}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px', overflowX: 'auto' }}>
                        <h2 style={sectionTitleStyle}>System Access Summary</h2>

                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>Role / User Type</th>
                                    <th style={tableHeaderStyle}>Access Description</th>
                                    <th style={tableHeaderStyle}>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {accessSummary?.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ ...tableCellStyle, fontWeight: '900', color: '#111827' }}>
                                            {item.role}
                                        </td>

                                        <td style={tableCellStyle}>
                                            {item.access}
                                        </td>

                                        <td style={tableCellStyle}>
                                            <span style={badgeStyle(item.status)}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px', overflowX: 'auto' }}>
                        <h2 style={sectionTitleStyle}>Final Documents and Reports</h2>

                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>Document</th>
                                    <th style={tableHeaderStyle}>Description</th>
                                    <th style={tableHeaderStyle}>Type</th>
                                    <th style={tableHeaderStyle}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {finalDocuments?.map((document, index) => (
                                    <tr key={index}>
                                        <td style={{ ...tableCellStyle, fontWeight: '900', color: '#111827' }}>
                                            {document.title}
                                        </td>

                                        <td style={tableCellStyle}>
                                            {document.description}
                                        </td>

                                        <td style={tableCellStyle}>
                                            <span style={badgeStyle(document.type)}>
                                                {document.type}
                                            </span>
                                        </td>

                                        <td style={tableCellStyle}>
                                            {renderDocumentButton(document)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Deployment / Local Setup Notes</h2>

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {setupNotes?.map((note, index) => (
                                <div
                                    key={index}
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '10px',
                                        padding: '14px',
                                        background: '#f9fafb',
                                    }}
                                >
                                    <div style={{ fontWeight: '900', color: '#111827', marginBottom: '5px' }}>
                                        {note.title}
                                    </div>

                                    <div style={{ color: '#6b7280', lineHeight: '1.7' }}>
                                        {note.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Final Handover Checklist</h2>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '12px',
                            }}
                        >
                            {handoverChecklist?.map((item, index) => (
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
                        <h2 style={sectionTitleStyle}>Recommended Future Improvements</h2>

                        <ul style={{ margin: 0, paddingLeft: '22px', color: '#374151', lineHeight: '1.9' }}>
                            {futureImprovements?.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div
                        style={{
                            ...cardStyle,
                            marginBottom: '24px',
                            background: '#111827',
                            color: '#ffffff',
                        }}
                    >
                        <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '10px' }}>
                            Final Statement
                        </h2>

                        <p style={{ color: '#e5e7eb', lineHeight: '1.8', margin: 0 }}>
                            The Smart Event Invitation & Planning System includes the main functional, reporting,
                            documentation, testing, and Super Admin monitoring features required for final demonstration.
                            The system is ready for project handover and future production-level improvements.
                        </p>
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
                <div style={smallLabelStyle}>{label}</div>
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
                <div style={smallLabelStyle}>{label}</div>
                <div style={statValueStyle}>{value ?? 0}</div>
            </div>
        );
    }

    function ListBox({ title, items }) {
        return (
            <div
                style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '14px',
                    background: '#f9fafb',
                }}
            >
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#111827', marginBottom: '8px' }}>
                    {title}
                </h3>

                <ul style={{ margin: 0, paddingLeft: '20px', color: '#374151', lineHeight: '1.8' }}>
                    {items?.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        );
    }
}
