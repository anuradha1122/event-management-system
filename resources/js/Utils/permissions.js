export function hasRole(auth, role) {
    const roles = auth?.roles || auth?.user?.roles || [];

    return roles.includes(role);
}

export function can(auth, permission) {
    const roles = auth?.roles || auth?.user?.roles || [];
    const permissions = auth?.permissions || auth?.user?.permissions || [];

    // Super Admin can do everything in frontend UI
    if (roles.includes('Super Admin')) {
        return true;
    }

    return permissions.includes(permission);
}
