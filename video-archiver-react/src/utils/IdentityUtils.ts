export function isReturnablePath(path: string): boolean {
    path = path.toLowerCase();
    for (const noRedirectString of ['login', 'register', 'pendingApproval']) {
        if (path.includes(noRedirectString)) return true;
    }
    return false;
}