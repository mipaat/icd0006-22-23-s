export function conformPage(page: number, maxPage: number | null = null): number {
    if (page < 0) return 0;
    if (maxPage !== null && page > maxPage) return maxPage;
    return page;
}

export function conformLimit(limit: number, maxLimit: number = 100): number {
    if (limit < 1) return 1;
    if (limit > maxLimit) return maxLimit;
    return limit;
}

export function isOnlyPage(total: number | null, limit: number): boolean {
    if (total === null) return false;
    return total < limit;
}