export function hasRole(auth, role) {
    return auth?.roles?.includes(role);
}

export function hasAnyRole(auth, roles = []) {
    return roles.some((role) => auth?.roles?.includes(role));
}

export function can(auth, permission) {
    return auth?.permissions?.includes(permission);
}

export function canAny(auth, permissions = []) {
    return permissions.some((permission) =>
        auth?.permissions?.includes(permission)
    );
}
