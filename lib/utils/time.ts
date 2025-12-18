/**
 * Get start of today in UTC milliseconds
 */
export function getStartOfDayUtc(): number {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    return startOfDay.getTime();
}

/**
 * Get current time in UTC milliseconds
 */
export function getCurrentUtc(): number {
    return Date.now();
}

/**
 * Get UTC timestamp for N days ago
 */
export function getDaysAgoUtc(days: number): number {
    const now = Date.now();
    return now - (days * 24 * 60 * 60 * 1000);
}

/**
 * Get UTC timestamp for start of week
 */
export function getStartOfWeekUtc(): number {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff, 0, 0, 0, 0);
    return startOfWeek.getTime();
}