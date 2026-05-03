import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const buttonStyle = (background = '#111827') => ({
        display: 'inline-block',
        padding: '12px 18px',
        background,
        color: '#ffffff',
        borderRadius: '10px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '800',
        boxShadow: '0 8px 18px rgba(15, 23, 42, 0.18)',
    });

    const cardStyle = {
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(226,232,240,0.9)',
        borderRadius: '18px',
        padding: '22px',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
    };

    const featureCardStyle = {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 6px 16px rgba(15, 23, 42, 0.08)',
    };

    return (
        <>
            <Head title="Smart Event Invitation & Planning System" />

            <div
                style={{
                    minHeight: '100vh',
                    background:
                        'linear-gradient(135deg, #eef2ff 0%, #f8fafc 40%, #ecfeff 100%)',
                    color: '#0f172a',
                }}
            >
                <header
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                            src="/images/logo.png"
                            alt="Smart Invitation Logo"
                            style={{
                                height: '52px',
                                width: '52px',
                                borderRadius: '14px',
                                objectFit: 'contain',
                                background: '#ffffff',
                                padding: '6px',
                                boxShadow: '0 10px 22px rgba(37, 99, 235, 0.18)',
                            }}
                        />

                        <div>
                            <div
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '900',
                                    color: '#0f172a',
                                }}
                            >
                                Smart Invitation
                            </div>

                            <div
                                style={{
                                    fontSize: '12px',
                                    color: '#64748b',
                                    fontWeight: '700',
                                }}
                            >
                                Event Invitation & Planning System
                            </div>
                        </div>
                    </div>

                    <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {auth?.user ? (
                            <Link href={route('dashboard')} style={buttonStyle('#2563eb')}>
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    style={{
                                        ...buttonStyle('#0f172a'),
                                        boxShadow: 'none',
                                    }}
                                >
                                    Login
                                </Link>

                                {/* {route().has('register') && (
                                    <Link
                                        href={route('register')}
                                        style={{
                                            ...buttonStyle('#2563eb'),
                                            boxShadow: 'none',
                                        }}
                                    >
                                        Register
                                    </Link>
                                )} */}
                            </>
                        )}
                    </nav>
                </header>

                <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                    <section
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '28px',
                            alignItems: 'center',
                            padding: '44px 0 34px',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    display: 'inline-block',
                                    background: '#dbeafe',
                                    color: '#1d4ed8',
                                    padding: '8px 12px',
                                    borderRadius: '999px',
                                    fontSize: '13px',
                                    fontWeight: '900',
                                    marginBottom: '18px',
                                }}
                            >
                                Complete Event Management Platform
                            </div>

                            <h1
                                style={{
                                    fontSize: 'clamp(36px, 6vw, 64px)',
                                    lineHeight: '1.03',
                                    fontWeight: '950',
                                    letterSpacing: '-1.5px',
                                    color: '#0f172a',
                                    margin: 0,
                                }}
                            >
                                Plan events. Send invitations. Track guests.
                            </h1>

                            <p
                                style={{
                                    marginTop: '18px',
                                    fontSize: '18px',
                                    lineHeight: '30px',
                                    color: '#475569',
                                    maxWidth: '620px',
                                }}
                            >
                                A smart system for creating events, generating public invitation
                                links, collecting RSVP responses, managing guests, tracking expenses,
                                assigning staff, and preparing final event reports.
                            </p>

                            <div
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                    flexWrap: 'wrap',
                                    marginTop: '26px',
                                }}
                            >
                                {auth?.user ? (
                                    <>
                                        <Link href={route('dashboard')} style={buttonStyle('#2563eb')}>
                                            Go to Dashboard
                                        </Link>

                                        <Link href={route('events.index')} style={buttonStyle('#16a34a')}>
                                            Manage Events
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href={route('login')} style={buttonStyle('#2563eb')}>
                                            Login to System
                                        </Link>

                                        {route().has('register') && (
                                            <Link href={route('register')} style={buttonStyle('#16a34a')}>
                                                Create Account
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <div
                                style={{
                                    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                                    borderRadius: '18px',
                                    padding: '24px',
                                    color: '#ffffff',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '14px',
                                        flexWrap: 'wrap',
                                        marginBottom: '24px',
                                    }}
                                >
                                    <div>
                                        <p
                                            style={{
                                                margin: 0,
                                                color: '#cbd5e1',
                                                fontSize: '13px',
                                                fontWeight: '800',
                                            }}
                                        >
                                            Current Event
                                        </p>

                                        <h2
                                            style={{
                                                margin: '8px 0 0',
                                                fontSize: '24px',
                                                fontWeight: '900',
                                            }}
                                        >
                                            Wedding Celebration
                                        </h2>
                                    </div>

                                    <span
                                        style={{
                                            height: 'fit-content',
                                            background: '#16a34a',
                                            color: '#ffffff',
                                            padding: '7px 11px',
                                            borderRadius: '999px',
                                            fontSize: '12px',
                                            fontWeight: '900',
                                        }}
                                    >
                                        Active
                                    </span>
                                </div>

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                                        gap: '12px',
                                    }}
                                >
                                    <DashboardMiniCard label="Guests" value="250" />
                                    <DashboardMiniCard label="Accepted" value="184" />
                                    <DashboardMiniCard label="Pending" value="42" />
                                    <DashboardMiniCard label="Tasks" value="18" />
                                </div>

                                <div
                                    style={{
                                        marginTop: '18px',
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '14px',
                                        padding: '16px',
                                    }}
                                >
                                    <p
                                        style={{
                                            margin: 0,
                                            color: '#cbd5e1',
                                            fontSize: '13px',
                                            fontWeight: '800',
                                        }}
                                    >
                                        Public Invitation Link
                                    </p>

                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            color: '#ffffff',
                                            fontSize: '14px',
                                            wordBreak: 'break-all',
                                        }}
                                    >
                                        /invitation/yYKY87wnpcihWjZOBBG2pt32fld3ujyb
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '18px',
                            marginTop: '24px',
                        }}
                    >
                        <FeatureCard
                            title="Digital Invitations"
                            text="Generate secure public invitation links for every guest."
                        />

                        <FeatureCard
                            title="RSVP Questions"
                            text="Collect attendance, meal choices, extra guests, and custom answers."
                        />

                        <FeatureCard
                            title="Guest Management"
                            text="Manage guests, send follow-ups, track responses, and check-ins."
                        />

                        <FeatureCard
                            title="Planning Tools"
                            text="Handle tasks, vendors, expenses, schedules, reminders, and staff."
                        />

                        <FeatureCard
                            title="Reports & PDFs"
                            text="Export final reports, testing documents, handover files, and summaries."
                        />

                        <FeatureCard
                            title="Role-Based Access"
                            text="Super Admin, Organizer, and Event Staff permissions with Spatie."
                        />
                    </section>

                    <section
                        style={{
                            ...cardStyle,
                            marginTop: '34px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '18px',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    color: '#0f172a',
                                    fontSize: '28px',
                                    fontWeight: '900',
                                }}
                            >
                                Built for weddings, meetings, ceremonies, and gatherings.
                            </h2>

                            <p
                                style={{
                                    margin: '10px 0 0',
                                    color: '#64748b',
                                    fontSize: '15px',
                                    lineHeight: '24px',
                                }}
                            >
                                From invitation creation to final handover, the system supports
                                the full event lifecycle with controlled access and clear reporting.
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                                gap: '12px',
                            }}
                        >
                            <StatBox value="39+" label="Completed Modules" />
                            <StatBox value="3" label="System Roles" />
                            <StatBox value="PDF" label="Report Export" />
                            <StatBox value="QR/Link" label="Invitation Access" />
                        </div>
                    </section>
                </main>

                <footer
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '28px 24px',
                        color: '#64748b',
                        fontSize: '13px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap',
                    }}
                >
                    <span>
                        © {new Date().getFullYear()} Smart Event Invitation & Planning System
                    </span>

                    <span>
                        Developed for event planning, invitation management, and final reporting.
                    </span>
                </footer>
            </div>
        </>
    );
}

function DashboardMiniCard({ label, value }) {
    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '14px',
                padding: '14px',
            }}
        >
            <p
                style={{
                    margin: 0,
                    color: '#cbd5e1',
                    fontSize: '12px',
                    fontWeight: '800',
                }}
            >
                {label}
            </p>

            <p
                style={{
                    margin: '8px 0 0',
                    color: '#ffffff',
                    fontSize: '26px',
                    fontWeight: '900',
                }}
            >
                {value}
            </p>
        </div>
    );
}

function FeatureCard({ title, text }) {
    return (
        <div
            style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 6px 16px rgba(15, 23, 42, 0.08)',
            }}
        >
            <div
                style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: '#dbeafe',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    marginBottom: '14px',
                }}
            >
                ✓
            </div>

            <h3
                style={{
                    margin: 0,
                    color: '#0f172a',
                    fontSize: '18px',
                    fontWeight: '900',
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    margin: '8px 0 0',
                    color: '#64748b',
                    fontSize: '14px',
                    lineHeight: '22px',
                }}
            >
                {text}
            </p>
        </div>
    );
}

function StatBox({ value, label }) {
    return (
        <div
            style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    color: '#2563eb',
                    fontSize: '24px',
                    fontWeight: '900',
                }}
            >
                {value}
            </div>

            <div
                style={{
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: '800',
                    marginTop: '4px',
                }}
            >
                {label}
            </div>
        </div>
    );
}
