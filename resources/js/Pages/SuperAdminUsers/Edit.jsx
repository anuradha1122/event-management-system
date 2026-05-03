import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, selectedUser, roles = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: selectedUser?.name || '',
        email: selectedUser?.email || '',
        role: selectedUser?.role || '',
    });

    const cardStyle = {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '14px',
        padding: '22px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
    };

    const inputStyle = {
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '10px 12px',
        fontSize: '14px',
        outline: 'none',
        background: '#ffffff',
    };

    const labelStyle = {
        display: 'block',
        color: '#334155',
        fontSize: '13px',
        fontWeight: '800',
        marginBottom: '6px',
    };

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

    const errorStyle = {
        marginTop: '6px',
        color: '#dc2626',
        fontSize: '13px',
        fontWeight: '700',
    };

    const submit = (e) => {
        e.preventDefault();

        put(route('super-admin.users.update', selectedUser.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit User" />

            <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
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
                                    fontSize: '32px',
                                    lineHeight: '38px',
                                    fontWeight: '900',
                                    color: '#0f172a',
                                    margin: 0,
                                }}
                            >
                                Edit User
                            </h1>

                            <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>
                                Update user details and role.
                            </p>
                        </div>

                        <Link href={route('super-admin.users.index')} style={buttonStyle('#0f172a')}>
                            Back to Users
                        </Link>
                    </div>

                    <section style={cardStyle}>
                        <form onSubmit={submit}>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        style={inputStyle}
                                    />
                                    {errors.name && <div style={errorStyle}>{errors.name}</div>}
                                </div>

                                <div>
                                    <label style={labelStyle}>Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        style={inputStyle}
                                    />
                                    {errors.email && <div style={errorStyle}>{errors.email}</div>}
                                </div>

                                <div>
                                    <label style={labelStyle}>Role</label>
                                    <select
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="">Select Role</option>

                                        {(roles || []).map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.role && <div style={errorStyle}>{errors.role}</div>}
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '10px',
                                    flexWrap: 'wrap',
                                    marginTop: '22px',
                                }}
                            >
                                <Link href={route('super-admin.users.index')} style={buttonStyle('#64748b')}>
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        ...buttonStyle('#16a34a'),
                                        opacity: processing ? 0.6 : 1,
                                    }}
                                >
                                    {processing ? 'Updating...' : 'Update User'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
