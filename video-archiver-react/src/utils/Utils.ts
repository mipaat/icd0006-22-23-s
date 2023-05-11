import { AxiosResponse } from "axios";
import { DateTime } from "luxon";

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