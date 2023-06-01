import router from '.';

export async function redirectToError(error: string | null = null) {
    return await router.push({ name: 'error', query: { error: error } });
}

export async function redirectToForbid() {
    return await router.push({ name: 'accessDenied' });
}

export async function redirectToNotFound() {
    return await router.push({ name: 'notFound' });
}
