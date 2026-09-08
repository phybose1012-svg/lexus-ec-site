import type { RegionTask } from "./types";
/**
 * A generated SVG may reach the document only after the corresponding figure
 * tab has been durably saved. `done-pending` still requires applyPending().
 */
export declare function canPublishFigureResult(status: RegionTask["status"]): boolean;
/**
 * A reserved tab can be overwritten automatically only while its exact stored
 * bundle is still the one created for this task. Being non-active does not
 * imply that the user has not edited it.
 */
export declare function canAutoCommitReservedFigureTab(tabIsActive: boolean, reservedBundleRevision: string | undefined, currentBundleRevision: string | undefined): boolean;
/**
 * Starting a new session disposes the current in-memory session. In
 * particular, done-pending has not reached tab storage yet and must never be
 * discarded without explicit confirmation.
 */
export declare function requiresSessionReplacementConfirmation(status: RegionTask["status"], hasUncommittedResult?: boolean): boolean;
