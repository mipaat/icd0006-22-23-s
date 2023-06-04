import type { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';
import { IBaseArchiveEntity } from '../dto/IBaseArchiveEntity';

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

type HandleableHtmlElement = HTMLInputElement | HTMLSelectElement;
export type SimpleSetStateAction<S> = (state: S) => void;
export type UpdateStateArg<S> = (prevState: S) => S;
export type UpdateStateAction<S> = (updateStateArg: UpdateStateArg<S>) => void;
export type HandleChangeEventAction = (event: React.ChangeEvent<HandleableHtmlElement>) => void;
export type HandleChangeAction = (target: EventTarget & HandleableHtmlElement) => void;
export function handleChangeEvent<TInput>(
    event: React.ChangeEvent<HandleableHtmlElement>,
    setValue: UpdateStateAction<TInput>
) {
    handleChange(event.target, setValue);
}
export function handleChange<TInput>(
    target: EventTarget & HandleableHtmlElement,
    setValue: UpdateStateAction<TInput>
): void {
    setValue((previous: TInput) => {
        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            return { ...previous, [target.name]: target.checked };
        }
        return {
            ...previous,
            [target.name]: target.value
        };
    });
}
