import type { IBaseArchiveEntity } from '@/dto/IBaseArchiveEntity';
import type { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';
import type { RouteLocationNormalized } from 'vue-router';

export function isBoolean(value: any): value is boolean {
    return value === true || value === false;
}

export function isAxiosResponse<TResponse = any>(value: any): value is AxiosResponse<TResponse> {
    if (value === undefined || value === null) return false;
    const axiosResponse = value as AxiosResponse;
    return (
        axiosResponse.config !== undefined &&
        axiosResponse.data !== undefined &&
        axiosResponse.status !== undefined &&
        axiosResponse.statusText !== undefined
    );
}

export function getDateString(date: Date | null): string {
    date ??= new Date();
    return DateTime.fromJSDate(date).toISO({ includeOffset: false })!;
}

export function getDateFromDateString(dateString: string): Date {
    return DateTime.fromISO(dateString).toJSDate();
}

export function handleBaseArchiveEntity(entity: IBaseArchiveEntity) {
    if (entity.addedToArchiveAt) {
        entity.addedToArchiveAt = new Date(entity.addedToArchiveAt);
    }
    if (entity.lastFetchOfficial) {
        entity.lastFetchOfficial = new Date(entity.lastFetchOfficial);
    }
    if (entity.lastSuccessfulFetchOfficial) {
        entity.lastSuccessfulFetchOfficial = new Date(entity.lastSuccessfulFetchOfficial);
    }
    if (entity.lastFetchUnofficial) {
        entity.lastFetchUnofficial = new Date(entity.lastFetchUnofficial);
    }
    if (entity.lastSuccessfulFetchUnofficial) {
        entity.lastSuccessfulFetchUnofficial = new Date(entity.lastSuccessfulFetchUnofficial);
    }
}

export const NoRedirectPaths = ["login", "notFound", "error", "accessDenied", "pendingApproval", "register", "selectAuthor", "login"];

export function validateRedirectRoute(route: RouteLocationNormalized): RouteLocationNormalized | null {
    return isValidRedirectRoute(route) ? route : null;
}

export function isValidRedirectRoute(route: RouteLocationNormalized): boolean {
    if (!route.name) return false;
    return !NoRedirectPaths.includes(route.name.toString());
}

export function encodeURIComponentNullable(value: string | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    return encodeURIComponent(value);
}

export function decodeURIComponentNullable(value: string | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    return decodeURIComponent(value);
}