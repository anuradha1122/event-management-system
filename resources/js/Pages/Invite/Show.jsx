import { Head, useForm, usePage } from '@inertiajs/react';

export default function Show({
    invitation,
    event,
    guest,
    questions = [],
    existingAnswers = {},
}) {
    const { flash } = usePage().props;

    const themeColor = event.theme_color || '#111827';
    const coverImageUrl = event.cover_image
        ? `/storage/${event.cover_image}`
        : null;

    const initialAnswers = {};

    questions.forEach((question) => {
        initialAnswers[question.id] = existingAnswers[question.id] || '';
    });

    const { data, setData, post, processing, errors } = useForm({
        status: guest.status === 'pending' ? 'accepted' : guest.status,
        guest_count: guest.guest_count || 0,
        answers: initialAnswers,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('invite.submit', invitation.token));
    };

    const setAnswer = (questionId, value) => {
        setData('answers', {
            ...data.answers,
            [questionId]: value,
        });
    };

    return (
        <>
            <Head title={`Invitation - ${event.title}`} />

            <div
                style={{
                    minHeight: '100vh',
                    background:
                        'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
                    padding: '32px 14px',
                }}
            >
                <div style={{ maxWidth: '860px', margin: '0 auto' }}>
                    {flash?.success && (
                        <div
                            style={{
                                marginBottom: '16px',
                                borderRadius: '12px',
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                padding: '14px 18px',
                                fontWeight: '800',
                            }}
                        >
                            {flash.success}
                        </div>
                    )}

                    <div
                        style={{
                            overflow: 'hidden',
                            backgroundColor: '#ffffff',
                            borderRadius: '28px',
                            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.16)',
                        }}
                    >
                        <InvitationHero
                            event={event}
                            coverImageUrl={coverImageUrl}
                            themeColor={themeColor}
                        />

                        <div style={{ padding: '28px' }}>
                            <EventInfoGrid event={event} themeColor={themeColor} />

                            <GuestGreeting
                                guest={guest}
                                invitation={invitation}
                                themeColor={themeColor}
                            />

                            <form onSubmit={submit}>
                                <RsvpStatus
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    themeColor={themeColor}
                                />

                                {data.status === 'accepted' && (
                                    <ExtraGuestCount
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                    />
                                )}

                                {questions.length > 0 && (
                                    <div
                                        style={{
                                            marginTop: '28px',
                                            marginBottom: '24px',
                                            borderTop: '1px solid #e5e7eb',
                                            paddingTop: '24px',
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: '20px',
                                                fontWeight: '900',
                                                color: '#111827',
                                                marginBottom: '16px',
                                            }}
                                        >
                                            Additional Questions
                                        </h3>

                                        {questions.map((question) => (
                                            <QuestionField
                                                key={question.id}
                                                question={question}
                                                value={
                                                    data.answers[question.id] || ''
                                                }
                                                error={
                                                    errors[`answers.${question.id}`]
                                                }
                                                onChange={(value) =>
                                                    setAnswer(question.id, value)
                                                }
                                                themeColor={themeColor}
                                            />
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        width: '100%',
                                        backgroundColor: processing
                                            ? '#6b7280'
                                            : themeColor,
                                        color: '#ffffff',
                                        padding: '15px 18px',
                                        borderRadius: '14px',
                                        fontWeight: '900',
                                        border: 'none',
                                        cursor: processing
                                            ? 'not-allowed'
                                            : 'pointer',
                                        boxShadow:
                                            '0 8px 18px rgba(15, 23, 42, 0.22)',
                                    }}
                                >
                                    Submit RSVP
                                </button>
                            </form>
                        </div>
                    </div>

                    <p
                        style={{
                            marginTop: '18px',
                            textAlign: 'center',
                            color: '#6b7280',
                            fontSize: '13px',
                        }}
                    >
                        Smart Event Invitation & Planning System
                    </p>
                </div>
            </div>
        </>
    );
}

function InvitationHero({ event, coverImageUrl, themeColor }) {
    return (
        <div
            style={{
                position: 'relative',
                minHeight: '340px',
                backgroundColor: themeColor,
                backgroundImage: coverImageUrl
                    ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(${coverImageUrl})`
                    : `linear-gradient(135deg, ${themeColor}, #020617)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '42px 24px',
                textAlign: 'center',
            }}
        >
            <div>
                {event.event_type && (
                    <div
                        style={{
                            display: 'inline-flex',
                            marginBottom: '18px',
                            padding: '7px 14px',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(255,255,255,0.18)',
                            backdropFilter: 'blur(8px)',
                            fontSize: '13px',
                            fontWeight: '900',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        {event.event_type}
                    </div>
                )}

                <p
                    style={{
                        fontSize: '15px',
                        fontWeight: '800',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        opacity: 0.9,
                        marginBottom: '10px',
                    }}
                >
                    You are invited
                </p>

                <h1
                    style={{
                        fontSize: 'clamp(36px, 7vw, 68px)',
                        fontWeight: '950',
                        lineHeight: '1.05',
                        marginBottom: '14px',
                    }}
                >
                    {event.title}
                </h1>

                {event.description && (
                    <p
                        style={{
                            maxWidth: '620px',
                            margin: '0 auto',
                            fontSize: '16px',
                            lineHeight: '1.7',
                            opacity: 0.95,
                        }}
                    >
                        {event.description}
                    </p>
                )}
            </div>
        </div>
    );
}

function EventInfoGrid({ event, themeColor }) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
                marginBottom: '28px',
            }}
        >
            <InfoBox
                label="Date"
                value={event.event_date || '-'}
                themeColor={themeColor}
            />
            <InfoBox
                label="Time"
                value={
                    event.event_time ? event.event_time.substring(0, 5) : '-'
                }
                themeColor={themeColor}
            />
            <InfoBox
                label="Venue"
                value={event.venue || '-'}
                themeColor={themeColor}
            />

            {event.dress_code && (
                <InfoBox
                    label="Dress Code"
                    value={event.dress_code}
                    themeColor={themeColor}
                />
            )}

            {event.contact_name && (
                <InfoBox
                    label="Contact"
                    value={event.contact_name}
                    themeColor={themeColor}
                />
            )}

            {event.contact_phone && (
                <InfoBox
                    label="Phone"
                    value={event.contact_phone}
                    themeColor={themeColor}
                />
            )}

            {event.map_link && (
                <a
                    href={event.map_link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: themeColor,
                        color: '#ffffff',
                        borderRadius: '16px',
                        padding: '16px',
                        textAlign: 'center',
                        fontWeight: '900',
                        textDecoration: 'none',
                    }}
                >
                    Open Map
                </a>
            )}
        </div>
    );
}

function GuestGreeting({ guest, invitation, themeColor }) {
    return (
        <div
            style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '24px',
                marginBottom: '22px',
            }}
        >
            <h2
                style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: '#111827',
                    marginBottom: '6px',
                }}
            >
                Hello, {guest.name}
            </h2>

            <p
                style={{
                    color: '#6b7280',
                    marginBottom: '16px',
                    lineHeight: '1.6',
                }}
            >
                Please confirm whether you can attend this event.
            </p>

            {invitation.responded_at && (
                <div
                    style={{
                        marginBottom: '16px',
                        borderRadius: '12px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '12px 14px',
                        fontWeight: '800',
                    }}
                >
                    You already responded. You can update your RSVP below.
                </div>
            )}
        </div>
    );
}

function RsvpStatus({ data, setData, errors, themeColor }) {
    return (
        <div style={{ marginBottom: '18px' }}>
            <label
                style={{
                    display: 'block',
                    fontWeight: '900',
                    color: '#374151',
                    marginBottom: '8px',
                }}
            >
                Your Response
            </label>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                }}
            >
                <RsvpOption
                    label="I will attend"
                    value="accepted"
                    checked={data.status === 'accepted'}
                    onChange={(value) => setData('status', value)}
                    themeColor={themeColor}
                />

                <RsvpOption
                    label="I cannot attend"
                    value="declined"
                    checked={data.status === 'declined'}
                    onChange={(value) => setData('status', value)}
                    themeColor={themeColor}
                />
            </div>

            {errors.status && (
                <p style={{ color: '#dc2626', marginTop: '6px' }}>
                    {errors.status}
                </p>
            )}
        </div>
    );
}

function RsvpOption({ label, value, checked, onChange, themeColor }) {
    return (
        <label
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: checked
                    ? `2px solid ${themeColor}`
                    : '1px solid #d1d5db',
                borderRadius: '14px',
                padding: '14px',
                cursor: 'pointer',
                backgroundColor: checked ? '#f9fafb' : '#ffffff',
                fontWeight: '800',
            }}
        >
            <input
                type="radio"
                value={value}
                checked={checked}
                onChange={(e) => onChange(e.target.value)}
            />
            {label}
        </label>
    );
}

function ExtraGuestCount({ data, setData, errors }) {
    return (
        <div style={{ marginBottom: '22px' }}>
            <label
                style={{
                    display: 'block',
                    fontWeight: '900',
                    color: '#374151',
                    marginBottom: '8px',
                }}
            >
                Extra Guests Count
            </label>

            <input
                type="number"
                min="0"
                max="50"
                value={data.guest_count}
                onChange={(e) => setData('guest_count', e.target.value)}
                style={inputStyle}
            />

            <p
                style={{
                    color: '#6b7280',
                    fontSize: '13px',
                    marginTop: '6px',
                }}
            >
                Enter how many additional people are coming with you.
            </p>

            {errors.guest_count && (
                <p style={{ color: '#dc2626', marginTop: '6px' }}>
                    {errors.guest_count}
                </p>
            )}
        </div>
    );
}

function QuestionField({ question, value, error, onChange, themeColor }) {
    return (
        <div style={{ marginBottom: '18px' }}>
            <label
                style={{
                    display: 'block',
                    fontWeight: '900',
                    color: '#374151',
                    marginBottom: '8px',
                }}
            >
                {question.question}
                {question.is_required && (
                    <span style={{ color: '#dc2626' }}> *</span>
                )}
            </label>

            {question.type === 'text' && (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={inputStyle}
                />
            )}

            {question.type === 'textarea' && (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows="4"
                    style={inputStyle}
                />
            )}

            {question.type === 'number' && (
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={inputStyle}
                />
            )}

            {question.type === 'select' && (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={inputStyle}
                >
                    <option value="">Select an option</option>
                    {(question.options || []).map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            )}

            {question.type === 'radio' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {(question.options || []).map((option) => (
                        <label
                            key={option}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                border:
                                    value === option
                                        ? `2px solid ${themeColor}`
                                        : '1px solid #d1d5db',
                                borderRadius: '12px',
                                padding: '10px 12px',
                                cursor: 'pointer',
                                fontWeight: '800',
                            }}
                        >
                            <input
                                type="radio"
                                value={option}
                                checked={value === option}
                                onChange={(e) => onChange(e.target.value)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {error && (
                <p style={{ color: '#dc2626', marginTop: '6px' }}>
                    {error}
                </p>
            )}
        </div>
    );
}

function InfoBox({ label, value, themeColor }) {
    return (
        <div
            style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
            }}
        >
            <p
                style={{
                    color: themeColor,
                    fontSize: '12px',
                    fontWeight: '900',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                }}
            >
                {label}
            </p>
            <p
                style={{
                    color: '#111827',
                    fontWeight: '900',
                    lineHeight: '1.4',
                }}
            >
                {value}
            </p>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    padding: '12px 14px',
};
