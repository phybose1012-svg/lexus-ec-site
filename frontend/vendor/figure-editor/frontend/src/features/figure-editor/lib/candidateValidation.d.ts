export type CandidateCompileResult<Failure> = {
    ok: true;
} | {
    ok: false;
    failure: Failure;
};
export type CandidateValidation<Failure> = {
    status: "valid";
} | {
    status: "invalid";
    failure: Failure;
} | {
    status: "stale";
};
/**
 * Validates a proposed editor mutation without publishing its rendered SVG.
 *
 * Candidate compilation and visible-canvas rendering intentionally use
 * separate coordination. A background render may supersede another render,
 * but it must never silently cancel a valid editor mutation. The mutation is
 * rejected only when compilation fails or its source changed while compiling.
 */
export declare function validateCandidateTransaction<Source, Candidate, Failure>(source: Source, candidate: Candidate, getCurrentSource: () => Source, compileCandidate: (candidate: Candidate) => Promise<CandidateCompileResult<Failure>>): Promise<CandidateValidation<Failure>>;
