---
name: past-exam-answer-author
description: Build independently written Lexus EC answer-and-explanation pages for the Astro past-exam library. Use when adding or refreshing an answers page; do not copy restricted source prose or source images.
---

# Past Exam Answer Author

Create answer pages from an independently written, structured JSON source and compile them into the generic past-exam answer route.

## Rights boundary

- Treat internal answer reconstructions as verification material only.
- Do not copy their prose, tables, diagrams, crops, or page images.
- Mathematical answers and identities may be checked against them, but derive the solution from the published question and write the explanation afresh.
- Do not remove a pedagogically necessary table or diagram merely because its source asset is restricted. Reconstruct tables from the mathematics in semantic HTML, and reserve unresolved diagrams with an original `figurePlaceholder` block for later replacement.
- Preserve the solution path implied by linked subquestions. Put an alternative method after the intended method instead of silently replacing it.
- Keep `contentProvenance` equal to `original_editorial` and `restrictedSourceCopied` equal to `false`. The build script rejects other values.

## Workflow

1. Solve every subquestion from the question page and record the answer-key slots.
2. Inventory every source table and figure by purpose before writing. Decide whether each is required, useful, or safely unnecessary; never infer that absence of a publishable asset means absence of the visual concept.
   - For authoring or editorial revision, read [Explanation review](references/explanation-review.md). Review the question-to-solution logic separately from formatting, and repeat the review after corrections.
3. Write concise explanations as `prose`, `formula`, `note`, `steps`, `table`, `figure`, `figurePlaceholder`, and `result` blocks. Put inline TeX inside `\(...\)` and display TeX in `formula.latex`.
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
4. Run `npm run past-exam:answers` from `frontend` to regenerate all answer pages and resolve canonical purpose labels. The site build also runs this step so library changes cannot leave older labels in generated pages. For a single source, use `.agents/skills/past-exam-answer-author/scripts/build-answer-page.mjs --source <authoring-json> --output <generated-json>` from the site repository root.
5. Do not edit generated JSON by hand. Fix the authoring source or builder and regenerate.
6. Link the generated route from the question page and university table. Verify answer slots, formulas, anchors, table semantics, placeholder dimensions, `noindex`, and print output.
   - After changing the generator or purpose library, run `npm run past-exam:answers:test` from `frontend`. Missing or unknown IDs and duplicate library entries must fail validation. Automated checks do not establish logical correctness; complete the editorial passes in the review reference as well.

The generic route discovers `frontend/src/data/generated/pastExamAnswers/*.json` automatically. Add university-specific rendering only when the common block model cannot express the explanation.
