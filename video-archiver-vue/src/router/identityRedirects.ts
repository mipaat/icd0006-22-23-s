import router from ".";

export async function redirectToLogin(returnUrl: string | null = null) {
    return await router.push(router.resolve({ name: "login", params: { returnUrl: returnUrl ?? router.currentRoute.value.fullPath } }));
}

export async function redirectToSelectAuthor(returnUrl: string | null = null) {
    return await router.push(router.resolve({ name: "selectAuthor", params: { returnUrl: returnUrl ?? router.currentRoute.value.fullPath } }));
}