---
name: past-exam-staging-batch
description: Import existing semantic past-exam packages serially into the Lexus staging library, preserving completed editorial pages and separating source defects for a repair session. Use for user-authorized bulk staging drafts, not independently authored finished explanations or production publication.
---

# Serial staging import

This mode is for the user's explicit workflow: bring existing HTML packages into the shared staging site, while a separate correction session handles fine review. A projected learner edition is not a newly solved, independently authored answer. Never stamp it `original_editorial` or report it as mathematically verified.

## Boundaries

- Keep the source repository read-only. `public-candidate/questions` is the question source; `editorial-explanations.json` with `provenance: editorial_adaptation` is the separately identified learner edition, not `generated/internal/source-answers` or the raw reconstruction. Preserve source reference/hash and the human-review status.
- Shared staging needs user authorization; a `noindex` URL is still reachable. The 2026-09-09 user instruction authorizes immediate staging pushes of this batch, not production publication or a claim that rights review is complete.
- Restrict imported answer snapshots to staging review. Do not copy restricted crops. Keep each required figure's position, aspect ratio and semantic description as a visible placeholder until an independently drawn figure is ready. A placeholder means unfinished work, not “figure unnecessary”.
- Preserve existing `pastExamAnswerSources/<id>.json` packages. They are independently authored and human-refined. The batch adapter must refuse to overwrite them. Do not overwrite another contributor's new package while pushing.
- Source IDs are not unique across exam stages. Use the full directory tuple university/year/method/stage/subject as identity. Retain established default URLs; additional variants get separate URL segments and university-table rows. Validate all three cross-links by package ID.

## Scripts (run from frontend)

1. `node scripts/audit-past-exam-batch.mjs <source-repository>` records the exact 67-package starting inventory and extraction failures.
2. `node scripts/import-past-exam-batch.mjs <source-repository> [package-id-or-university-id]` imports serially and writes resumable status plus per-package repair prompts. No omitted argument starts parallel agents.
3. `npm run build` regenerates source projections and analyses using tracked local snapshots; it must not require the source checkout in CI.
4. `node scripts/audit-past-exam-math.mjs` checks TeX syntax using the deployed KaTeX runtime, including each formula's actual display mode. It does not verify the mathematics.
5. Run batch, analysis, answer, notation, UI and SEO tests after the build completes. Then inspect desktop/mobile rendering and print. Keep machine checks and actual visual review distinct in reports.
6. Run `node scripts/report-past-exam-batch.mjs` after a targeted import to refresh the summary and handoff index. The importer updates the per-package ledger but does not refresh these aggregate files. Do not hand-edit remaining counts or report local, unpushed figures as deployed.

## Localize failures

- Unverifiable target arithmetic must not block otherwise valid difficulty/priority evidence. `deferTargets` extracts that evidence, requires `targetReviewStatus: source-repair-required`, and leaves a visible target section without invented scores. It must never silently recompute the source report into a different plan.
- Missing analysis data shows a pending page, not a 0-point chart or fabricated priorities. Missing explanation data shows a pending page, not a guessed answer key.
- A malformed table reserves only that table, preserving surrounding explanations. Record page ID, major ID, caption and observed column counts.
- A Windows-path check must not reject legitimate TeX such as `C:\ (x-7)^2=17` or `\alpha:\beta`. Check actual local-path structure and URL attributes without weakening script/event-handler rejection.
- Imported formula-purpose labels are deduplicated in `pastExamBatch/formula-purposes.json` and remain marked for editorial review. When refining a package, reuse the reviewed shared purpose library; migrate only distinct useful labels into it.

## Continue the figure queue serially

- The first independently drawn batch examples are `build-aichi-2025-mathematics-figures.mjs` and `build-aichi-2025-physics-figures.mjs`. The physics example uses `scripts/lib/past-exam-svg-author.mjs` for only the shared SVG envelope, local KaTeX faces and hand-edited-figure protection. Geometry and invariants belong in the package generator/test.
- Register a manifest under the normalized **library** package ID. Crop IDs must match exactly. The answer adapter resolves registered originals automatically and retains every unmatched placeholder. The question importer permits partial manifests **only** with `--defer-crops true`; otherwise missing IDs still fail. Do not remove that strict default or the duplicate-ID guard.
- After generating and visually reviewing figures, run the targeted importer for that package, then build, tests, math audit and report. This updates both question placement and the pending-figure ledger. Do not merely hand-edit generated page JSON or the counts.
- A crop may combine a spatial figure and a numeric reference table. Replacing the image alone must not drop the table. Keep the spatial part in SVG; independently calculate/verify the table as semantic HTML. The IUHW physics generator writes a scoped `pastExamBatch/question-supplements/<library-package-id>.json` containing exact-match importer operations, which the batch importer merges into its generated overrides. Preserve source meaning and provenance, require the expected match count, and remove the supplement once repaired upstream HTML supplies that same table.
- When an imported learner edition omits a necessary table, a small independently verified addition may use `pastExamBatch/answer-supplements/<library-package-id>.json` (`lexus-answer-supplement.v1`). The Kitasato mathematics generator is the example: `sourceSha256` must match the learner snapshot, each `insert-after` anchor must match exactly once, and additions stay within that major question. The shared adapter accepts only prose/tables, retains the imported edition's provenance and records the supplement separately. Do not edit generated snapshots or widen matching to make a repaired source pass; review/remove obsolete additions after upstream changes to avoid duplicated tables.
- For imported variation tables, use the established `[[no-value]]` marker and verify the actual diagonal SVG is rendered, not just an empty styled cell. Size the table for its own column count; a short derivative table should not inherit a wide concavity table's minimum width. Check computed styles on the built page because stylesheet order can defeat a seemingly scoped rule.
- Dense choice diagrams may remain too small on mobile even after reducing columns. Check actual glyph size, not just page overflow; a package-scoped horizontal figure scroller with a visible hint can preserve legibility. Do not apply its minimum width to print or unrelated figures.
- Question-only answer axes must remain blank. Show solution curves/coordinates only in answer figures. Test signs, point order and the time direction of phase trajectories separately from SVG syntax.
- Normalize local analysis authoring snapshots to the existing Japanese inequality policy as well as the rendered output. Preserve source evidence and content provenance; a typography conversion is not a new independent explanation.
- Read `docs/handoffs/past-exam-batch/continuation.md` before the next package. After verified staging pushes, append what was actually drawn, tested and deployed. Temporary QA PNGs belong under `frontend/reports/`, not in production assets or Git.

## Handoff and completion

Use `pastExamBatch/status.json`, upstream open issues, `math-audit.json`, and `docs/handoffs/past-exam-batch/<id>.md`. Report counts separately: routes created, substantive question/answer/analysis bodies, deferred targets, pending diagrams, and source packages missing material. Creating three route shells is not completing three bodies.

Before pushing, fetch and integrate staging without force-push; build and test the actual combined tree. Verify deployment using real staged URLs. Leave a precise continuation log for unfinished figures or source repairs. The batch runner is resumable, but does not run itself after the session stops.
