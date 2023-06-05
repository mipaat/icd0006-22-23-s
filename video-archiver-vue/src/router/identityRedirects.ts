import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import router from '.';
import { useIdentityStore } from '@/stores/identityStore';
import { encodeURIComponentNullable, validateRedirectRoute } from '@/utils/Utils';

function getEncodedValidatedReturnUrl(returnUrl: string | null = null): string | null {
    const result = returnUrl ?? validateRedirectRoute(router.currentRoute.value)?.fullPath;
    return encodeURIComponentNullable(result);
}

export function getLoginRoute(returnUrl: string | null = null) {
    return router.resolve({
        name: 'login',
        query: { returnUrl: getEncodedValidatedReturnUrl(returnUrl) }
    });
}

export function getSelectAuthorRoute(returnUrl: string | null = null) {
    return router.resolve({
        name: 'selectAuthor',
        query: { returnUrl: getEncodedValidatedReturnUrl(returnUrl) }
    });
}

export async function redirectToLogin(returnUrl: string | null = null) {
    return await router.push(getLoginRoute(returnUrl));
}

export async function redirectToSelectAuthor(returnUrl: string | null = null) {
    return await router.push(getSelectAuthorRoute(returnUrl));
}

export async function loginNavigationGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const identityStore = useIdentityStore();
    if (!identityStore.isLoggedIn) return next(getLoginRoute(to.fullPath));
    return next();
}

export async function adminNavigationGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const identityStore = useIdentityStore();
    if (!identityStore.jwt?.isAdmin) return next({ name: 'accessDenied' });
    return next();
}
