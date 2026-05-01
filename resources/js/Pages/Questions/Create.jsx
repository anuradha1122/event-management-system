import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ event }) {
    const { data, setData, post, processing, errors } = useForm({
        question: '',
        type: 'text',
        options: '',
        is_required: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('events.questions.store', event.id));
    };

    const needsOptions = data.type === 'select' || data.type === 'radio';

    return (
        <AuthenticatedLayout>
            <Head title={`Add Question - ${event.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Add RSVP Question
                            </h1>
                            <p className="text-sm text-gray-500">
                                Event: {event.title}
                            </p>
                        </div>

                        <Link
                            href={route('events.questions.index', event.id)}
                            style={{
                                color: '#374151',
                                fontWeight: '700',
                                textDecoration: 'none',
                            }}
                        >
                            Back
                        </Link>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded bg-white p-6 shadow"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Question
                            </label>
                            <input
                                type="text"
                                value={data.question}
                                onChange={(e) =>
                                    setData('question', e.target.value)
                                }
                                className="mt-1 w-full rounded border-gray-300 shadow-sm"
                                placeholder="Example: Meal preference?"
                            />
                            {errors.question && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.question}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Question Type
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 shadow-sm"
                            >
                                <option value="text">Short Text</option>
                                <option value="textarea">Long Text</option>
                                <option value="number">Number</option>
                                <option value="select">Dropdown</option>
                                <option value="radio">Radio Buttons</option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        {needsOptions && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Options
                                </label>
                                <textarea
                                    value={data.options}
                                    onChange={(e) =>
                                        setData('options', e.target.value)
                                    }
                                    rows="5"
                                    className="mt-1 w-full rounded border-gray-300 shadow-sm"
                                    placeholder={`Chicken\nFish\nVegetarian`}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Add one option per line.
                                </p>
                                {errors.options && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.options}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.is_required}
                                    onChange={(e) =>
                                        setData('is_required', e.target.checked)
                                    }
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Required question
                                </span>
                            </label>
                            {errors.is_required && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.is_required}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: processing
                                        ? '#6b7280'
                                        : '#111827',
                                    color: '#ffffff',
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    border: '1px solid #111827',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                            >
                                Save Question
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
