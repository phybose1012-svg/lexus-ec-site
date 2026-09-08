export interface SessionPoolOwnership {
    acquire(sessionId: string): boolean;
    release(sessionId: string): void;
    owns(sessionId: string): boolean;
}
/**
 * Tracks runners by session rather than with one process-wide boolean.
 * A retry in the same session reuses its current runner, while a replacement
 * session can start immediately even if an obsolete request is still settling.
 */
export declare function createSessionPoolOwnership(): SessionPoolOwnership;
