import { uniqueNamesGenerator, adjectives, animals, NumberDictionary } from 'unique-names-generator';

export function getResourceSize(url: string): number | undefined {
    const entry = window?.performance?.getEntriesByName(url)?.[0] as PerformanceResourceTiming | undefined;
    if (entry) {
        const size = entry?.encodedBodySize;
        return size || undefined;
    } else {
        return undefined;
    }
}

export function getNetlifyContext(): string | undefined {
    return process.env.CONTEXT;
}

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const uniqueNamesConfig = {
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2
};

export function uniqueName(): string {
    return uniqueNamesGenerator(uniqueNamesConfig) + "-" + randomInt(100, 999);
}

export const uploadDisabled: boolean = process.env.NEXT_PUBLIC_DISABLE_UPLOADS?.toLowerCase() === "true"; 