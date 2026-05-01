import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ event }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: event.title || '',
        description: event.description || '',
        event_date: event.event_date || '',
        event_time: event.event_time ? event.event_time.substring(0, 5) : '',
        venue: event.venue || '',
        event_type: event.event_type || '',
        theme_color: event.theme_color || '#111827',
        cover_image: null,
        dress_code: event.dress_code || '',
        contact_name: event.contact_name || '',
        contact_phone: event.contact_phone || '',
        map_link: event.map_link || '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('events.update', event.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${event.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Edit Event
                        </h1>

                        <Link
                            href={route('events.show', event.id)}
                            style={linkStyle}
                        >
                            Back
                        </Link>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded bg-white p-6 shadow"
                    >
                        <SectionTitle title="Basic Event Details" />

                        <TextInput
                            label="Event Title"
                            value={data.title}
                            onChange={(value) => setData('title', value)}
                            error={errors.title}
                        />

                        <TextareaInput
                            label="Description"
                            value={data.description}
                            onChange={(value) => setData('description', value)}
                            error={errors.description}
                        />

                        <div className="grid gap-5 md:grid-cols-2">
                            <TextInput
                                type="date"
                                label="Event Date"
                                value={data.event_date}
                                onChange={(value) => setData('event_date', value)}
                                error={errors.event_date}
                            />

                            <TextInput
                                type="time"
                                label="Event Time"
                                value={data.event_time}
                                onChange={(value) => setData('event_time', value)}
                                error={errors.event_time}
                            />
                        </div>

                        <TextInput
                            label="Venue"
                            value={data.venue}
                            onChange={(value) => setData('venue', value)}
                            error={errors.venue}
                        />

                        <SectionTitle title="Invitation Design Details" />

                        <div className="grid gap-5 md:grid-cols-2">
                            <SelectInput
                                label="Event Type"
                                value={data.event_type}
                                onChange={(value) => setData('event_type', value)}
                                error={errors.event_type}
                                options={[
                                    ['', 'Select type'],
                                    ['Wedding', 'Wedding'],
                                    ['Meeting', 'Meeting'],
                                    ['Birthday', 'Birthday'],
                                    ['Party', 'Party'],
                                    ['Religious Event', 'Religious Event'],
                                    ['Other', 'Other'],
                                ]}
                            />

                            <TextInput
                                type="color"
                                label="Theme Color"
                                value={data.theme_color}
                                onChange={(value) => setData('theme_color', value)}
                                error={errors.theme_color}
                            />
                        </div>

                        {event.cover_image && (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Current Cover Image
                                </label>
                                <img
                                    src={`/storage/${event.cover_image}`}
                                    alt={event.title}
                                    style={{
                                        width: '220px',
                                        height: '120px',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                    }}
                                />
                            </div>
                        )}

                        <FileInput
                            label="Change Cover Image"
                            onChange={(file) => setData('cover_image', file)}
                            error={errors.cover_image}
                        />

                        <div className="grid gap-5 md:grid-cols-2">
                            <TextInput
                                label="Dress Code"
                                value={data.dress_code}
                                onChange={(value) => setData('dress_code', value)}
                                error={errors.dress_code}
                                placeholder="Example: Formal / Smart Casual"
                            />

                            <TextInput
                                label="Google Maps Link"
                                value={data.map_link}
                                onChange={(value) => setData('map_link', value)}
                                error={errors.map_link}
                                placeholder="https://maps.google.com/..."
                            />
                        </div>

                        <SectionTitle title="Contact Details" />

                        <div className="grid gap-5 md:grid-cols-2">
                            <TextInput
                                label="Contact Name"
                                value={data.contact_name}
                                onChange={(value) => setData('contact_name', value)}
                                error={errors.contact_name}
                            />

                            <TextInput
                                label="Contact Phone"
                                value={data.contact_phone}
                                onChange={(value) => setData('contact_phone', value)}
                                error={errors.contact_phone}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                style={buttonStyle(processing)}
                            >
                                Update Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SectionTitle({ title }) {
    return (
        <div className="border-b border-gray-200 pb-2">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>
    );
}

function TextInput({
    label,
    value,
    onChange,
    error,
    type = 'text',
    placeholder = '',
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full rounded border-gray-300 shadow-sm"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

function TextareaInput({ label, value, onChange, error }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows="4"
                className="mt-1 w-full rounded border-gray-300 shadow-sm"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

function SelectInput({ label, value, onChange, error, options }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full rounded border-gray-300 shadow-sm"
            >
                {options.map(([optionValue, optionLabel]) => (
                    <option key={optionValue} value={optionValue}>
                        {optionLabel}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

function FileInput({ label, onChange, error }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => onChange(e.target.files[0])}
                className="mt-1 w-full rounded border border-gray-300 p-2 shadow-sm"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

const linkStyle = {
    color: '#374151',
    fontWeight: '700',
    textDecoration: 'none',
};

function buttonStyle(processing) {
    return {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: processing ? '#6b7280' : '#111827',
        color: '#ffffff',
        padding: '10px 18px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '700',
        border: '1px solid #111827',
        cursor: processing ? 'not-allowed' : 'pointer',
    };
}
