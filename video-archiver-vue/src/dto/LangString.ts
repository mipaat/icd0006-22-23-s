export class LangString extends Map<string, string> {
    defaultCulture = "en-US";

    translate(culture: string = "en-US"): string | null {
        if (this.size === 0) return null;
        culture = culture.trim().toLowerCase().replace("_", "-");

        const secondLevelMatches = [] as string[];
        const thirdLevelMatches = [] as string[];
        const defaultCultureNormalized = this.defaultCulture.trim().toLowerCase().replace("_", "-");
        let defaultCultureMatch1 = null as string | null;
        let defaultCultureMatch2 = null as string | null;
        let defaultCultureMatch3 = null as string | null;

        for (const entry of this.entries()) {
            const key = entry[0].toLowerCase().replace("_", "-");
            const value = entry[1];

            if (key === culture) {
                return value;
            }
            if (culture.startsWith(key)) {
                secondLevelMatches.push(value);
                continue;
            }
            if (key.split("-")[0] === culture.split("-")[0]) {
                thirdLevelMatches.push(value);
                continue;
            }

            if (culture !== defaultCultureNormalized && defaultCultureMatch1 === null) {
                if (key === defaultCultureNormalized) {
                    defaultCultureMatch1 = value;
                    continue;
                }
                if (defaultCultureMatch2 === null) {
                    if (defaultCultureNormalized.startsWith(key)) {
                        defaultCultureMatch2 = value;
                        continue;
                    }
                    if (defaultCultureMatch3 === null && key.split("-")[0] === defaultCultureNormalized.split("-")[0]) {
                        defaultCultureMatch3 = value;
                        continue;
                    }
                }
            }
        }

        if (secondLevelMatches.length > 0) return secondLevelMatches[0];
        if (thirdLevelMatches.length > 0) return thirdLevelMatches[0];

        return defaultCultureMatch1 ?? defaultCultureMatch2 ?? defaultCultureMatch3 ?? this.getUnknown() ?? this.getAny();
    }

    getUnknown(): string | null {
        return this.get("__UNKNOWN__") ?? null;
    }

    getAny(): string | null {
        return Array.from<string>(this.values())[0];
    }
}

export function newLangString(source: object | null): LangString | null {
    if (source === null) return null;
    const result = new LangString();
    for (const prop of Object.entries(source)) {
        result.set(prop[0], prop[1]);
    }
    return result;
}