import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({
    auth,
    summary,
    systemStats,
    modules,
    demoChecklist,
    knownIssues,
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
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
    });

    const cardStyle = {
        background: '#fff',
        borderRadius: '12px',
        padding: '18px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
    };

    const labelStyle = {
        fontSize: '13px',
        color: '#6b7280',
        marginBottom: '6px',
    };

    const valueStyle = {
        fontSize: '28px',
        fontWeight: '800',
        color: '#111827',
    };

    const badgeStyle = (status) => {
        const colors = {
            passed: {
                background: '#dcfce7',
                color: '#166534',
            },
            failed: {
                background: '#fee2e2',
                color: '#991b1b',
            },
            pending: {
                background: '#fef3c7',
                color: '#92400e',
            },
            handled: {
                background: '#dbeafe',
                color: '#1e40af',
            },
            ready: {
                background: '#dcfce7',
                color: '#166534',
            },
        };

        return {
            display: 'inline-block',
            padding: '5px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'capitalize',
            ...(colors[status] || {
                background: '#f3f4f6',
                color: '#374151',
            }),
        };
    };

    const sectionTitleStyle = {
        fontSize: '22px',
        fontWeight: '800',
        color: '#111827',
        marginBottom: '14px',
    };

    const tableHeaderStyle = {
        padding: '12px',
        textAlign: 'left',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        fontSize: '13px',
        fontWeight: '800',
        color: '#374151',
    };

    const tableCellStyle = {
        padding: '12px',
        borderBottom: '1px solid #e5e7eb',
        fontSize: '14px',
        color: '#374151',
        verticalAlign: 'top',
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Final Testing Documentation" />

            <div style={{ padding: '28px', background: '#f3f4f6', minHeight: '100vh' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#111827', marginBottom: '8px' }}>
                            Final Testing Documentation
                        </h1>

                        <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: '1.7', maxWidth: '900px' }}>
                            This page summarizes the final testing status of the Smart Event Invitation & Planning System.
                            It is prepared for final demo, review, and project submission readiness.
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

                        <a
                            href={route('super-admin.system-report.pdf')}
                            style={buttonStyle('#16a34a')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            System Report PDF
                        </a>

                        <a
                            href={route('super-admin.testing-documentation.pdf')}
                            style={buttonStyle('#dc2626')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Testing Documentation PDF
                        </a>
                    </div>

                    <div
                        style={{
                            ...cardStyle,
                            marginBottom: '24px',
                            borderLeft: readiness?.status === 'Ready for final demo'
                                ? '6px solid #16a34a'
                                : '6px solid #f59e0b',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#111827', marginBottom: '8px' }}>
                                    Final Readiness Status
                                </h2>

                                <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7' }}>
                                    {readiness?.message}
                                </p>
                            </div>

                            <div>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: '10px 16px',
                                        borderRadius: '999px',
                                        fontWeight: '800',
                                        background: readiness?.status === 'Ready for final demo'
                                            ? '#dcfce7'
                                            : '#fef3c7',
                                        color: readiness?.status === 'Ready for final demo'
                                            ? '#166534'
                                            : '#92400e',
                                    }}
                                >
                                    {readiness?.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            marginBottom: '24px',
                        }}
                    >
                        <div style={cardStyle}>
                            <div style={labelStyle}>Total Tests</div>
                            <div style={valueStyle}>{summary?.total_tests ?? 0}</div>
                        </div>

                        <div style={cardStyle}>
                            <div style={labelStyle}>Passed</div>
                            <div style={{ ...valueStyle, color: '#16a34a' }}>{summary?.passed_tests ?? 0}</div>
                        </div>

                        <div style={cardStyle}>
                            <div style={labelStyle}>Failed</div>
                            <div style={{ ...valueStyle, color: '#dc2626' }}>{summary?.failed_tests ?? 0}</div>
                        </div>

                        <div style={cardStyle}>
                            <div style={labelStyle}>Pending</div>
                            <div style={{ ...valueStyle, color: '#f59e0b' }}>{summary?.pending_tests ?? 0}</div>
                        </div>

                        <div style={cardStyle}>
                            <div style={labelStyle}>Completion</div>
                            <div style={{ ...valueStyle, color: '#2563eb' }}>
                                {summary?.completion_percentage ?? 0}%
                            </div>
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>System Overview</h2>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '14px',
                            }}
                        >
                            <MiniStat label="Total Events" value={systemStats?.total_events} />
                            <MiniStat label="Draft Events" value={systemStats?.draft_events} />
                            <MiniStat label="Active Events" value={systemStats?.active_events} />
                            <MiniStat label="Completed Events" value={systemStats?.completed_events} />
                            <MiniStat label="Cancelled Events" value={systemStats?.cancelled_events} />
                            <MiniStat label="Users" value={systemStats?.total_users} />
                            <MiniStat label="Guests" value={systemStats?.total_guests} />
                            <MiniStat label="Invitations" value={systemStats?.total_invitations} />
                            <MiniStat label="Questions" value={systemStats?.total_questions} />
                            <MiniStat label="QA Checks" value={systemStats?.total_qa_checks} />
                            <MiniStat label="Activity Logs" value={systemStats?.total_activity_logs} />
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Completed Modules</h2>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                gap: '12px',
                            }}
                        >
                            {modules?.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '10px',
                                        padding: '14px',
                                        background: '#f9fafb',
                                    }}
                                >
                                    <div style={{ fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
                                        {item.module}
                                    </div>

                                    <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
                                        {item.category}
                                    </div>

                                    <span style={badgeStyle(item.status)}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px', overflowX: 'auto' }}>
                        <h2 style={sectionTitleStyle}>Module Testing Table</h2>

                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>#</th>
                                    <th style={tableHeaderStyle}>Module</th>
                                    <th style={tableHeaderStyle}>Category</th>
                                    <th style={tableHeaderStyle}>Test Case</th>
                                    <th style={tableHeaderStyle}>Expected Result</th>
                                    <th style={tableHeaderStyle}>Status</th>
                                    <th style={tableHeaderStyle}>Remarks</th>
                                </tr>
                            </thead>

                            <tbody>
                                {modules?.map((item, index) => (
                                    <tr key={index}>
                                        <td style={tableCellStyle}>{index + 1}</td>

                                        <td style={{ ...tableCellStyle, fontWeight: '800', color: '#111827' }}>
                                            {item.module}
                                        </td>

                                        <td style={tableCellStyle}>{item.category}</td>

                                        <td style={tableCellStyle}>{item.test_case}</td>

                                        <td style={tableCellStyle}>{item.expected_result}</td>

                                        <td style={tableCellStyle}>
                                            <span style={badgeStyle(item.status)}>{item.status}</span>
                                        </td>

                                        <td style={tableCellStyle}>{item.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Final Demo Checklist</h2>

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {demoChecklist?.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '60px 1fr auto',
                                        gap: '12px',
                                        alignItems: 'center',
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
                                        <div style={{ fontWeight: '800', color: '#111827', marginBottom: '4px' }}>
                                            {item.step}
                                        </div>

                                        <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                                            {item.description}
                                        </div>
                                    </div>

                                    <span style={badgeStyle(item.status)}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Known Issues / Remarks</h2>

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {knownIssues?.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '10px',
                                        padding: '14px',
                                        background: '#f9fafb',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: '12px',
                                            flexWrap: 'wrap',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        <div style={{ fontWeight: '800', color: '#111827' }}>
                                            {item.title}
                                        </div>

                                        <span style={badgeStyle(item.status)}>{item.status}</span>
                                    </div>

                                    <div style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.7' }}>
                                        {item.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={sectionTitleStyle}>Testing Steps</h2>

                        <ol style={{ margin: 0, paddingLeft: '22px', color: '#374151', lineHeight: '1.9' }}>
                            <li>Login as a Super Admin user.</li>
                            <li>Open the Super Admin Testing Documentation page.</li>
                            <li>Verify summary cards show total, passed, failed, pending, and completion percentage.</li>
                            <li>Open each linked Super Admin page from the top button area.</li>
                            <li>Generate the System Report PDF using the green PDF button.</li>
                            <li>Open a sample event and verify event dashboard, final PDF report, QA checklist, project summary, organizer manual, and manual PDF.</li>
                            <li>Test a public invitation link without login.</li>
                            <li>Submit RSVP and verify the response inside organizer pages.</li>
                            <li>Mark event completed or cancelled and verify modification protection.</li>
                            <li>Reopen event and verify edit features work again.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function MiniStat({ label, value }) {
    return (
        <div
            style={{
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '14px',
                background: '#f9fafb',
            }}
        >
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                {label}
            </div>

            <div style={{ fontSize: '22px', fontWeight: '900', color: '#111827' }}>
                {value ?? 0}
            </div>
        </div>
    );
}
