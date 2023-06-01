import type { IBaseArchiveEntity } from '@/dto/IBaseArchiveEntity';
import type { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';

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