export class PendingApprovalError extends Error {
}

export function isPendingApprovalError(value: any): value is PendingApprovalError {
    if (value === undefined || value === null) return false;
    return value instanceof PendingApprovalError;
}