import * as configJson from '../config.json';
import { type IConfig } from '../config';

const config = configJson as IConfig;

export class LocalStorageService {
    private localStorageKey: string;

    constructor() {
        this.localStorageKey = config.localStorageKey;
    }

    private getActualKey(key: string): string {
        return this.localStorageKey + "_" + key;
    }

    public removeItem(key: string): void {
        localStorage.removeItem(this.getActualKey(key));
    }

    public setItem(key: string, item: string): void {
        localStorage.setItem(this.getActualKey(key), item);
    }

    public getItem(key: string): string | null {
        return localStorage.getItem(this.getActualKey(key));
    }
}