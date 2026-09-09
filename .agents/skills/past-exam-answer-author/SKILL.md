---
name: past-exam-answer-author
description: Build independently written Lexus EC answer-and-explanation pages for the Astro past-exam library. Use when adding or refreshing an answers page; do not copy restricted source prose or source images.
---

# Past Exam Answer Author

Create answer pages from an independently written, structured JSON source and compile them into the generic past-exam answer route.

For an explicitly requested bulk staging import of already-edited learner editions, use [Past Exam Staging Batch](../past-exam-staging-batch/SKILL.md) instead. That separate projection mode preserves `editorial_adaptation_import` provenance and unfinished review status; it must not satisfy or bypass this skill's independently-authored completion contract.

## Rights boundary

- Treat internal answer reconstructions as verification material only.
- Do not copy their prose, tables, diagrams, crops, or page images.
- Mathematical answers and identities may be checked against them, but derive the solution from the published question and write the explanation afresh.
- Do not remove a pedagogically necessary table or diagram merely because its source asset is restricted. Reconstruct tables from the mathematics in semantic HTML, and reserve unresolved diagrams with an original `figurePlaceholder` block for later replacement.
- Preserve the solution path implied by linked subquestions. Put an alternative method after the intended method instead of silently replacing it.
- Keep `contentProvenance` equal to `original_editorial` and `restrictedSourceCopied` equal to `false`. The build script rejects other values.

## Workflow

1. Solve every subquestion from the question page and record the answer-key slots.
   - If an internal reconstruction disagrees with that independent derivation or with the source image, do not copy the defect or silently repair the separate source repository during the library build. Use the verified result in the original Lexus explanation when the mathematics is unambiguous, keep the review gate active, and record the source defect for a dedicated repair handoff.
2. Inventory every source table and figure by purpose before writing. Decide whether each is required, useful, or safely unnecessary; never infer that absence of a publishable asset means absence of the visual concept.
   - For authoring or editorial revision, read [Explanation review](references/explanation-review.md). Review the question-to-solution logic separately from formatting, and repeat the review after corrections.
3. Write concise explanations as `prose`, `formula`, `note`, `steps`, `table`, `figure`, `figurePlaceholder`, and `result` blocks. Put inline TeX inside `\(...\)` and display TeX in `formula.latex`.
   - Answer-key values remain escaped plain text by default so existing packages keep their current presentation. When every value in a package is authored as TeX, set document-level `answerKeyValueRendering` to `"math"`; write each `entry.value` as TeX without `\(...\)` delimiters. The builder then emits an empty inline `data-katex` target, preventing raw commands such as `\frac` from appearing visibly before the shared math renderer runs. Do not enable this mode for a mixed prose-and-math answer key without first expressing every value as valid TeX.
   - Let each major question begin with its `h2`. Do not add an eyebrow label such as “第1問・解答解説” immediately above a heading that already says “第1問 解答・解説”.
   - Japanese school mathematics writes the inequalities as ≦ and ≧ — the sign over a full equals sign. The international ≤ and ≥, which shorten that equals sign to a single rule, are not used anywhere up to university entrance level and must never be published. Write `\leqq` and `\geqq` in TeX. The builder normalizes `\le`, `\leq`, `\leqslant`, `\ge`, `\geq`, `\geqslant`, ≤ and ≥ on read, so a slip cannot reach a page, but author the correct form. Run `npm run past-exam:notation` to rewrite authored sources and `npm run past-exam:notation:test` to prove no source, generated file, figure or built page carries the forbidden forms.
   - Every retained `formula` block requires a `purposeId` from the repository's `frontend/src/data/pastExamFormulaPurposes.json`. Read existing labels and `useWhen` descriptions first; reuse the matching ID. Add a new stable ID, concise label, and distinct usage description only when no existing entry fits. Do not create per-page spellings or free-text label overrides.
   - Remove an unnecessary display block before assigning tags. A tag is not a reason to keep a redundant formula. Keep any premises needed for the conclusion, inline or in a meaningful calculation block.
   - Use `table.variant: "variation"` for an HTML increase/decrease and concavity table. Follow the conventional Japanese layout: alternate point and interval columns in the `x` row, put the signs and zeros of `f'` and `f''` underneath, and put extrema, inflection points, undefined points, and curve arrows in the `f` row. Do not replace this structure with interval descriptions written across the column headings.
   - In a variation table, use `[[trend:increase:concave-down]]`, `[[trend:decrease:concave-down]]`, `[[trend:decrease:concave-up]]`, or `[[trend:increase:concave-up]]` for the curve-arrow cells. Empty point or endpoint cells are allowed.
   - In the Lexus variation-table style, mark data cells that have no value at a point outside the domain with `[[no-value]]`. The renderer draws a corner-to-corner diagonal, including in print; do not display `未定義` or treat this as an image still awaiting preparation. Keep ordinary empty cells and all actual values unchanged.
   - Preserve the approved row-label/content boundary: use a double vertical rule only on the right edge of the first column. All other gridlines are single, including the sides of diagonal-marked cells.
   - Keep curve arrows and interval columns compact, using the shared styles (currently up to 28px-wide arrows on screen and 6mm in print). Do not shrink mathematical text to accommodate oversized arrows. Preserve the same table structure in print.
   - Reuse this layout across future Lexus exam pages, not the Iwate-specific column count or values. Derive the points, intervals, signs, extrema, and inflection points from each problem; include the second-derivative row when concavity is being shown.
   - Use `figurePlaceholder` with a stable `assetId`, `title`, `description`, and `size` (`wide`, `landscape`, or `square`) while an independently redrawn figure is pending.
   - For a completed original diagram, set root `figureManifest` to the repository-relative manifest path and use `{ "type": "figure", "assetId": "<registered-id>" }`. The shared `pastExamFigures.mjs` renderer supplies semantic figure/caption markup, alt text, intrinsic dimensions and eager loading for print. Keep the drawable source or generator alongside the asset so later corrections remain reproducible.
   - When authoring or revising that diagram, follow the project-local [Past Exam Diagram Author](../past-exam-diagram-author/SKILL.md). It owns reconstruction from conditions, KaTeX-matched SVG typography, collision review, manifest validation, and subject-specific visual invariants.
4. Run `npm run past-exam:answers` from `frontend` to regenerate all answer pages and resolve canonical purpose labels. The site build also runs this step so library changes cannot leave older labels in generated pages. For a single source, use `.agents/skills/past-exam-answer-author/scripts/build-answer-page.mjs --source <authoring-json> --output <generated-json>` from the site repository root.
5. Do not edit generated JSON by hand. Fix the authoring source or builder and regenerate.
6. Link the generated route from the question page and university table. Verify answer slots, formulas, anchors, table semantics, placeholder dimensions, `noindex`, and print output.
   - After changing the generator or purpose library, run `npm run past-exam:answers:test` from `frontend`. Missing or unknown IDs and duplicate library entries must fail validation. Automated checks do not establish logical correctness; complete the editorial passes in the review reference as well.

The generic route discovers `frontend/src/data/generated/pastExamAnswers/*.json` automatically. Add university-specific rendering only when the common block model cannot express the explanation.

## Source-repair handoff

Before handing a defective source package to another session, audit every in-scope question and answer page so the prompt contains all detected defects rather than stopping at the first mismatch. For each item state the original page, canonical-data location, current value, expected value, and independent mathematical or visual evidence. Distinguish a transcription error from an editorial explanation that merely omits a necessary justification.

The handoff prompt must name the repository and package, required local instructions, canonical-first repair rule, generated artifacts to rebuild, stale-value search, complete answer-key and algebra recheck, package validators and desktop/mobile browser QA, unchanged rights and human-review gates, allowed Git scope, and the completion report expected from the repair session. Require unresolved cases to remain open issues instead of guessed corrections. Keep this prompt as a reviewable Markdown artifact beside the library work so the main authoring session can continue without losing the defect trail.

Do not pause the whole library build for a localized source defect. Continue independently verifiable explanations, figures, metadata, layout, and tests that do not rely on the disputed value. If the published question itself is uncertain, stop only that dependent explanation and keep it visibly review-gated and `noindex`; never infer an answer from a defective answer key. Clear the gate only after the canonical repair has been re-imported and the solution rechecked.
