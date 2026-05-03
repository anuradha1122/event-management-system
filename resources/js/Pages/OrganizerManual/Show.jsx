import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, event }) {
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

    const cardStyle = {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '14px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
    };

    const sectionTitleStyle = {
        fontSize: '20px',
        fontWeight: '900',
        color: '#0f172a',
        marginTop: 0,
        marginBottom: '12px',
    };

    const paragraphStyle = {
        color: '#475569',
        lineHeight: '1.7',
        fontSize: '15px',
        marginTop: 0,
    };

    const badgeStyle = {
        display: 'inline-block',
        padding: '4px 9px',
        background: '#eef2ff',
        color: '#3730a3',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: '800',
        marginRight: '6px',
        marginBottom: '6px',
    };

    const statusColors = {
        draft: '#64748b',
        active: '#16a34a',
        completed: '#2563eb',
        cancelled: '#dc2626',
    };

    const statusLabel = event.status
        ? event.status.charAt(0).toUpperCase() + event.status.slice(1)
        : 'Draft';

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Organizer Manual - ${event.title}`} />

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
                                        fontWeight: '700',
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
                                Organizer User Manual
                            </h1>

                            <p style={{ marginTop: '8px', color: '#64748b', fontSize: '15px' }}>
                                A practical guide for managing this event from planning to final reporting.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link href={route('events.show', event.id)} style={buttonStyle('#2563eb')}>
                                Event Details
                            </Link>

                            <Link href={route('events.project-summary', event.id)} style={buttonStyle('#0f172a')}>
                                Project Summary
                            </Link>

                            <Link href={route('events.qa-checklist.index', event.id)} style={buttonStyle('#be123c')}>
                                QA Checklist
                            </Link>

                            <a
                                href={route('events.organizer-manual.pdf', event.id)}
                                style={buttonStyle('#0891b2')}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Manual PDF
                            </a>
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
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
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
                                    This manual explains how the organizer should operate the system for this event.
                                    Because apparently “click the button” still needs documentation, and honestly,
                                    fair enough.
                                </p>
                            </div>

                            <span
                                style={{
                                    display: 'inline-block',
                                    background: statusColors[event.status] || '#64748b',
                                    color: '#ffffff',
                                    padding: '8px 14px',
                                    borderRadius: '999px',
                                    fontWeight: '900',
                                    fontSize: '13px',
                                }}
                            >
                                {statusLabel}
                            </span>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                                gap: '14px',
                                marginTop: '20px',
                            }}
                        >
                            <HeroStat label="Guests" value={event.guests_count} />
                            <HeroStat label="Invitations" value={event.invitations_count} />
                            <HeroStat label="Questions" value={event.questions_count} />
                            <HeroStat label="Tasks" value={event.tasks_count} />
                            <HeroStat label="Expenses" value={event.expenses_count} />
                            <HeroStat label="QA Checks" value={event.qa_checks_count} />
                        </div>
                    </section>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(260px, 320px) 1fr',
                            gap: '20px',
                            alignItems: 'start',
                        }}
                    >
                        <aside style={{ ...cardStyle, position: 'sticky', top: '20px' }}>
                            <h2 style={sectionTitleStyle}>Manual Sections</h2>

                            <ManualNav />
                        </aside>

                        <main style={{ display: 'grid', gap: '18px' }}>
                            <ManualSection
                                id="overview"
                                number="01"
                                title="System Overview"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    The Smart Event Invitation & Planning System helps an organizer create an event,
                                    generate public invitation links, collect RSVP responses, manage guests, track
                                    check-ins, follow up with guests, organize planning tasks, and produce final reports.
                                </p>

                                <p style={paragraphStyle}>
                                    Guests do not need to log in. They open the invitation link, view the invitation,
                                    answer questions, and submit their response.
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="event-setup"
                                number="02"
                                title="Event Setup"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    Start by creating the event with the correct title, date, time, venue, type,
                                    contact details, theme color, dress code, and map link if available.
                                </p>

                                <Checklist
                                    items={[
                                        'Confirm event title and venue.',
                                        'Check event date and time.',
                                        'Add organizer contact details.',
                                        'Add map link if the venue needs directions.',
                                        'Leave optional fields blank if they are not required.',
                                    ]}
                                />

                                <p style={paragraphStyle}>
                                    If theme color or dress code is not needed, the organizer can keep those fields empty.
                                    The invitation should still work without crashing like a dramatic little machine.
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="guest-management"
                                number="03"
                                title="Guest Management"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    The organizer can add guests with name, phone, email, expected guest count,
                                    and RSVP status. Guest records are used for invitation tracking, RSVP summary,
                                    check-in, follow-up, and reports.
                                </p>

                                <Checklist
                                    items={[
                                        'Add each guest with correct contact information.',
                                        'Check duplicate guests before adding.',
                                        'Update guest count if one guest represents a family or group.',
                                        'Delete incorrect guests only before the event is closed.',
                                    ]}
                                />

                                <p style={paragraphStyle}>
                                    After an event is completed or cancelled, guest modification should be blocked.
                                    This protects the final report from becoming historical fiction.
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="invitation-links"
                                number="04"
                                title="Public Invitation Links"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    Each guest can receive a public invitation link. The guest opens this link without
                                    logging in and submits their RSVP response.
                                </p>

                                <Checklist
                                    items={[
                                        'Generate invitation links for guests.',
                                        'Send the link using WhatsApp, SMS, email, or another communication method.',
                                        'Ask guests to open the link and submit their response.',
                                        'Use the response page to verify submitted answers.',
                                    ]}
                                />

                                <p style={paragraphStyle}>
                                    This is useful in Sri Lanka where QR scanning is not always common. A direct link is
                                    simpler, which is a rare victory for common sense.
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="rsvp"
                                number="05"
                                title="RSVP Questions and Responses"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    The organizer can create RSVP questions such as attendance confirmation, meal preference,
                                    number of attendees, transport needs, or special notes.
                                </p>

                                <Checklist
                                    items={[
                                        'Create only the questions needed for the event.',
                                        'Keep questions short and clear.',
                                        'Review guest answers from the response list.',
                                        'Use RSVP status to identify accepted, declined, and pending guests.',
                                    ]}
                                />

                                <p style={paragraphStyle}>
                                    Answers belong through the invitation. Do not connect answers using guest_id unless you
                                    enjoy SQL errors with the emotional range of a brick.
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="check-in"
                                number="06"
                                title="Guest Check-In"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    During the event, the organizer or staff can mark guests as checked in. The system stores
                                    the check-in time, user, and optional note.
                                </p>

                                <Checklist
                                    items={[
                                        'Open the Guest Check-In page.',
                                        'Search or find the guest.',
                                        'Mark the guest as checked in.',
                                        'Undo check-in only if it was marked by mistake.',
                                        'Export check-in report if needed.',
                                    ]}
                                />

                                <p style={paragraphStyle}>
                                    Check-in actions should be blocked when the event is completed or cancelled.
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="follow-ups"
                                number="07"
                                title="Guest Follow-Ups"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    Follow-ups help the organizer contact guests who have not responded, need reminders,
                                    or require manual confirmation.
                                </p>

                                <Checklist
                                    items={[
                                        'View guests who need follow-up.',
                                        'Send or manually mark follow-ups.',
                                        'Use bulk follow-up actions when needed.',
                                        'Add follow-up notes for future tracking.',
                                        'Export follow-up report if required.',
                                    ]}
                                />

                                <p style={paragraphStyle}>
                                    Follow-up count and follow-up time help the organizer prove that yes, they did chase
                                    people. Repeatedly. Like civilization depends on RSVP discipline.
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="planning"
                                number="08"
                                title="Planning Tasks, Expenses, Vendors, Schedule, and Staff"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    The planning area helps the organizer manage the practical side of the event.
                                    These modules support task tracking, budget control, supplier management,
                                    event timeline planning, and staff assignment.
                                </p>

                                <Checklist
                                    items={[
                                        'Use Planning Tasks to track preparation work.',
                                        'Use Budget / Expenses to record event costs.',
                                        'Use Vendors / Suppliers for supplier contact details.',
                                        'Use Schedule / Timeline to manage the event day plan.',
                                        'Use Staff Assignment to assign responsibilities.',
                                    ]}
                                />

                                <p style={paragraphStyle}>
                                    These modules help convert “we’ll manage somehow” into actual planning, which is rude
                                    to chaos but excellent for delivery.
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="reminders"
                                number="09"
                                title="Reminders and Notification Center"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    Reminders can be created for important event actions. Reminder logs and notifications
                                    help the organizer review what needs attention.
                                </p>

                                <Checklist
                                    items={[
                                        'Create reminders for key event tasks.',
                                        'Review reminder logs.',
                                        'Mark reminder logs as reviewed.',
                                        'Use Event Notifications to check urgent items.',
                                        'Retry failed reminder logs if the module supports it.',
                                    ]}
                                />

                                <p style={paragraphStyle}>
                                    The notification center exists because humans invented deadlines and then forgot them.
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="dashboard"
                                number="10"
                                title="Dashboard and Analytics"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    The Event Dashboard gives the organizer a quick view of event progress, guest statistics,
                                    RSVP status, check-ins, follow-ups, expenses, and other important counts.
                                </p>

                                <Checklist
                                    items={[
                                        'Open Event Dashboard from the event page.',
                                        'Review guest and RSVP totals.',
                                        'Check pending guests.',
                                        'Review check-in and follow-up progress.',
                                        'Use dashboard values before generating final reports.',
                                    ]}
                                />
                            </ManualSection>

                            <ManualSection
                                id="activity-logs"
                                number="11"
                                title="Activity Logs and Interaction History"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    Activity logs record important system actions such as event updates, guest changes,
                                    RSVP submissions, check-ins, follow-ups, QA updates, and status changes.
                                </p>

                                <Checklist
                                    items={[
                                        'Use Activity Logs to audit event changes.',
                                        'Use Guest Interaction History for guest-specific notes.',
                                        'Review logs before finalizing the event.',
                                        'Keep logs readable and meaningful.',
                                    ]}
                                />

                                <p style={paragraphStyle}>
                                    This gives the project traceability, which is academic language for “we can prove what
                                    happened instead of guessing loudly.”
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="qa"
                                number="12"
                                title="QA Checklist"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    The QA Checklist is used to test whether important system modules work correctly for
                                    the event. Checks can be marked as pending, passed, or failed.
                                </p>

                                <Checklist
                                    items={[
                                        'Test event creation and editing.',
                                        'Test guest add/delete.',
                                        'Test public invitation link.',
                                        'Test RSVP submission and answers.',
                                        'Test check-in and undo check-in.',
                                        'Test follow-ups.',
                                        'Test dashboard, exports, final PDF, and activity logs.',
                                        'Mark each QA item as passed, failed, or pending.',
                                    ]}
                                />

                                <p style={paragraphStyle}>
                                    Recommended before final report generation: complete the QA checklist so the report
                                    does not proudly document broken features. Very fashionable, sadly.
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="reports"
                                number="13"
                                title="Final Reports and Project Summary"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    The Final Event Report PDF gives a formal event report. The Project Summary page gives
                                    a clean project/demo overview with module counts, summaries, and latest activity logs.
                                </p>

                                <Checklist
                                    items={[
                                        'Review Event Dashboard first.',
                                        'Complete QA Checklist as much as possible.',
                                        'Open Project Summary.',
                                        'Generate Final Event Report PDF.',
                                        'Generate Organizer Manual PDF if documentation is needed.',
                                        'Use Activity Logs for proof of system actions.',
                                    ]}
                                />

                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}>
                                    <a
                                        href={route('events.final-report.pdf', event.id)}
                                        style={buttonStyle('#16a34a')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Final Report PDF
                                    </a>

                                    <Link
                                        href={route('events.project-summary', event.id)}
                                        style={buttonStyle('#0f172a')}
                                    >
                                        Project Summary
                                    </Link>

                                    <a
                                        href={route('events.organizer-manual.pdf', event.id)}
                                        style={buttonStyle('#0891b2')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Manual PDF
                                    </a>
                                </div>
                            </ManualSection>

                            <ManualSection
                                id="lifecycle"
                                number="14"
                                title="Event Lifecycle"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <p style={paragraphStyle}>
                                    The event lifecycle controls whether the event is still editable or closed.
                                </p>

                                <LifecycleTable />

                                <p style={{ ...paragraphStyle, marginTop: '14px' }}>
                                    Completed and cancelled events should stay readable, but write actions should be blocked.
                                    This keeps final event records stable.
                                </p>
                            </ManualSection>

                            <ManualSection
                                id="recommended-workflow"
                                number="15"
                                title="Recommended Organizer Workflow"
                                badgeStyle={badgeStyle}
                                paragraphStyle={paragraphStyle}
                            >
                                <WorkflowSteps
                                    steps={[
                                        'Create event',
                                        'Add guests',
                                        'Create RSVP questions',
                                        'Generate and send invitation links',
                                        'Review RSVP responses',
                                        'Manage tasks, vendors, expenses, schedule, staff, and reminders',
                                        'Use follow-ups for pending guests',
                                        'Use check-in during the event',
                                        'Review dashboard and activity logs',
                                        'Complete QA checklist',
                                        'Generate final reports',
                                        'Generate organizer manual PDF',
                                        'Mark event as completed',
                                    ]}
                                />

                                <p style={{ ...paragraphStyle, marginTop: '14px' }}>
                                    Final recommended flow:{' '}
                                    <strong>
                                        Manage Event → QA Checklist → Final Event Report PDF → Project Summary → User Manual → Manual PDF
                                    </strong>
                                </p>
                            </ManualSection>
                        </main>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function ManualNav() {
    const links = [
        ['Overview', '#overview'],
        ['Event Setup', '#event-setup'],
        ['Guest Management', '#guest-management'],
        ['Invitation Links', '#invitation-links'],
        ['RSVP', '#rsvp'],
        ['Check-In', '#check-in'],
        ['Follow-Ups', '#follow-ups'],
        ['Planning', '#planning'],
        ['Reminders', '#reminders'],
        ['Dashboard', '#dashboard'],
        ['Activity Logs', '#activity-logs'],
        ['QA Checklist', '#qa'],
        ['Reports', '#reports'],
        ['Lifecycle', '#lifecycle'],
        ['Workflow', '#recommended-workflow'],
    ];

    return (
        <nav style={{ display: 'grid', gap: '8px' }}>
            {links.map(([label, href]) => (
                <a
                    key={href}
                    href={href}
                    style={{
                        display: 'block',
                        color: '#334155',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '700',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #e5e7eb',
                    }}
                >
                    {label}
                </a>
            ))}
        </nav>
    );
}

function ManualSection({ id, number, title, children, badgeStyle }) {
    return (
        <section id={id} style={manualCardStyle}>
            <div style={{ marginBottom: '10px' }}>
                <span style={badgeStyle}>Section {number}</span>
            </div>

            <h2
                style={{
                    fontSize: '22px',
                    fontWeight: '900',
                    color: '#0f172a',
                    marginTop: 0,
                    marginBottom: '12px',
                }}
            >
                {title}
            </h2>

            {children}
        </section>
    );
}

function Checklist({ items }) {
    return (
        <ul
            style={{
                margin: '12px 0',
                paddingLeft: '0',
                listStyle: 'none',
                display: 'grid',
                gap: '8px',
            }}
        >
            {items.map((item, index) => (
                <li
                    key={index}
                    style={{
                        background: '#f8fafc',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        color: '#334155',
                        fontSize: '14px',
                        lineHeight: '1.5',
                    }}
                >
                    <span style={{ color: '#16a34a', fontWeight: '900', marginRight: '8px' }}>
                        ✓
                    </span>
                    {item}
                </li>
            ))}
        </ul>
    );
}

function WorkflowSteps({ steps }) {
    return (
        <ol
            style={{
                margin: 0,
                paddingLeft: '0',
                listStyle: 'none',
                display: 'grid',
                gap: '10px',
            }}
        >
            {steps.map((step, index) => (
                <li
                    key={index}
                    style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        background: '#f8fafc',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px',
                    }}
                >
                    <span
                        style={{
                            flex: '0 0 auto',
                            width: '28px',
                            height: '28px',
                            borderRadius: '999px',
                            background: '#2563eb',
                            color: '#ffffff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: '900',
                        }}
                    >
                        {index + 1}
                    </span>

                    <span
                        style={{
                            color: '#334155',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            fontWeight: '700',
                        }}
                    >
                        {step}
                    </span>
                </li>
            ))}
        </ol>
    );
}

function LifecycleTable() {
    const rows = [
        {
            status: 'Draft',
            meaning: 'Event is being prepared.',
            behavior: 'Organizer can edit event, guests, questions, planning modules, and reminders.',
        },
        {
            status: 'Active',
            meaning: 'Event is live and invitation/RSVP process is active.',
            behavior: 'Organizer can manage guests, RSVP, check-ins, follow-ups, and planning modules.',
        },
        {
            status: 'Completed',
            meaning: 'Event has finished.',
            behavior: 'Pages and reports remain readable, but modification actions should be blocked.',
        },
        {
            status: 'Cancelled',
            meaning: 'Event has been cancelled.',
            behavior: 'Pages and reports remain readable, but modification actions should be blocked.',
        },
    ];

    return (
        <div style={{ overflowX: 'auto' }}>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px',
                    marginTop: '10px',
                }}
            >
                <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Meaning</th>
                        <th style={thStyle}>System Behavior</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((row) => (
                        <tr key={row.status} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={tdStyle}>
                                <strong>{row.status}</strong>
                            </td>
                            <td style={tdStyle}>{row.meaning}</td>
                            <td style={tdStyle}>{row.behavior}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function HeroStat({ label, value }) {
    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '12px',
                padding: '12px',
            }}
        >
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '12px' }}>{label}</p>
            <p
                style={{
                    margin: '6px 0 0',
                    color: '#ffffff',
                    fontSize: '22px',
                    fontWeight: '900',
                }}
            >
                {value || 0}
            </p>
        </div>
    );
}

const manualCardStyle = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '22px',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
    scrollMarginTop: '24px',
};

const thStyle = {
    textAlign: 'left',
    padding: '12px',
    color: '#334155',
    fontWeight: '900',
    borderBottom: '1px solid #e5e7eb',
};

const tdStyle = {
    padding: '12px',
    color: '#475569',
    verticalAlign: 'top',
    lineHeight: '1.6',
};
