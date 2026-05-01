import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Analytics({ event, summary, questionSummaries }) {
    const percentage = (value, total) => {
        if (!total || total === 0) {
            return 0;
        }

        return Math.round((value / total) * 100);
    };

    const statCards = [
        {
            label: 'Total Guests',
            value: summary.total_guests,
            color: '#111827',
            bg: '#f3f4f6',
        },
        {
            label: 'Accepted',
            value: summary.accepted_guests,
            color: '#166534',
            bg: '#dcfce7',
        },
        {
            label: 'Declined',
            value: summary.declined_guests,
            color: '#991b1b',
            bg: '#fee2e2',
        },
        {
            label: 'Pending',
            value: summary.pending_guests,
            color: '#92400e',
            bg: '#fef3c7',
        },
        {
            label: 'Total Attending',
            value: summary.total_attending,
            color: '#1d4ed8',
            bg: '#dbeafe',
        },
        {
            label: 'Invitations Sent',
            value: summary.sent_invitations,
            color: '#047857',
            bg: '#d1fae5',
        },
        {
            label: 'Not Sent',
            value: summary.not_sent_invitations,
            color: '#7c2d12',
            bg: '#ffedd5',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={`Analytics - ${event.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                RSVP Analytics
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Event: {event.title}
                            </p>

                            {(event.event_date || event.event_time || event.venue) && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {event.event_date || ''}
                                    {event.event_time ? ` at ${event.event_time}` : ''}
                                    {event.venue ? ` · ${event.venue}` : ''}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={route('events.guests.index', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#2563eb',
                                    color: '#ffffff',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                View Guests
                            </Link>

                            <Link
                                href={route('events.show', event.id)}
                                style={{
                                    display: 'inline-flex',
                                    backgroundColor: '#e5e7eb',
                                    color: '#111827',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                }}
                            >
                                Back to Event
                            </Link>
                        </div>
                    </div>

                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((card) => (
                            <div
                                key={card.label}
                                className="rounded-lg bg-white p-5 shadow"
                            >
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        backgroundColor: card.bg,
                                        color: card.color,
                                        padding: '6px 10px',
                                        borderRadius: '999px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                    }}
                                >
                                    {card.label}
                                </div>

                                <div className="mt-4 text-3xl font-bold text-gray-900">
                                    {card.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-8 rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-bold text-gray-900">
                            RSVP Status Overview
                        </h2>

                        <div className="space-y-5">
                            <ProgressRow
                                label="Accepted"
                                value={summary.accepted_guests}
                                total={summary.total_guests}
                                percent={percentage(
                                    summary.accepted_guests,
                                    summary.total_guests
                                )}
                                barColor="#16a34a"
                            />

                            <ProgressRow
                                label="Declined"
                                value={summary.declined_guests}
                                total={summary.total_guests}
                                percent={percentage(
                                    summary.declined_guests,
                                    summary.total_guests
                                )}
                                barColor="#dc2626"
                            />

                            <ProgressRow
                                label="Pending"
                                value={summary.pending_guests}
                                total={summary.total_guests}
                                percent={percentage(
                                    summary.pending_guests,
                                    summary.total_guests
                                )}
                                barColor="#f59e0b"
                            />
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="mb-5">
                            <h2 className="text-lg font-bold text-gray-900">
                                Custom Question Answer Summary
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Summary of answers submitted through the public RSVP form.
                            </p>
                        </div>

                        {questionSummaries.length > 0 ? (
                            <div className="space-y-6">
                                {questionSummaries.map((question) => (
                                    <div
                                        key={question.id}
                                        className="rounded-lg border border-gray-200 p-5"
                                    >
                                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {question.question}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Type: {question.type} · Total answers:{' '}
                                                    {question.total_answers}
                                                </p>
                                            </div>
                                        </div>

                                        {question.answers.length > 0 ? (
                                            <div className="space-y-3">
                                                {question.answers.map((answer) => (
                                                    <AnswerRow
                                                        key={`${question.id}-${answer.answer}`}
                                                        answer={answer.answer}
                                                        count={answer.count}
                                                        total={question.total_answers}
                                                        percent={percentage(
                                                            answer.count,
                                                            question.total_answers
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="rounded bg-gray-50 p-4 text-sm text-gray-500">
                                                No answers submitted yet.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="rounded bg-gray-50 p-4 text-sm text-gray-500">
                                No custom questions created for this event.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function ProgressRow({ label, value, total, percent, barColor }) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">{label}</span>
                <span className="text-gray-500">
                    {value} / {total} ({percent}%)
                </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${percent}%`,
                        backgroundColor: barColor,
                    }}
                />
            </div>
        </div>
    );
}

function AnswerRow({ answer, count, total, percent }) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">
                    {answer}
                </span>
                <span className="text-gray-500">
                    {count} / {total} ({percent}%)
                </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${percent}%`,
                        backgroundColor: '#6366f1',
                    }}
                />
            </div>
        </div>
    );
}
