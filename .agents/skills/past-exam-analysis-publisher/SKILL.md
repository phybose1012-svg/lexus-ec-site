---
name: past-exam-analysis-publisher
description: Turn saved Lexus past-exam analysis HTML into concise, data-backed analysis pages in the existing Astro past-exam library. Use for analysis pages, not question transcription or answer derivations.
---

# Past Exam Analysis Publisher

Keep the saved report intact. Publish a separate, student-facing summary using white surfaces, restrained accents, and the existing problem/answer/analysis navigation.

## Source and extraction

- Locate the matching university/year/subject report. The first supported report is `preview-html/public-preview/index.html`, with `analysis.json` alongside its parent preview directory in the source package.
- Read the HTML's review banner, assessment explanations, and the companion metadata. A `public-preview` directory is not editorial approval. Preserve review status and the staging `noindex` policy; do not infer permission to deploy to production.
- From `frontend`, run `node scripts/import-past-exam-analysis.mjs --html <saved-html> --metadata <analysis.json> --derived <derived.json> --source-ref <source-project-relative-html-path> --output src/data/pastExamAnalysisEvidence/<package-id>.json`.
- This adapter extracts difficulty, priority, reasons, major-question chart values and target results from HTML; checks package identity and values against its companion metadata; and records the source hash. Target reports require `derived.json` to recover selected question IDs, checked against HTML totals, canonical provisional points/time and prerequisites. Unsupported report structure must fail rather than silently omit sections. For another structure, extend the adapter with tests, not a university-name exception.
- `calculation_policy.scoring.basis` must be `provisional_editorial`: the subquestion points are always an editorial estimate. `calculation_policy.time_budget.basis` may be either `provisional_editorial` (a per-subject split of a combined-subject slot, as in Iwate's 60 minutes inside a 120-minute English/mathematics block) or `official_subject` (the exam publishes that subject's own limit, as in Juntendo's 70-minute mathematics paper). The adapter records the choice as `targetAnalysis.timeBudgetBasis`, and the analysis page words the target section accordingly — never call a published limit an assumption, and never present estimated points as official.

## Editorial pass

- Keep the evidence snapshot separate from `src/data/pastExamAnalysisSources/<package-id>.json`, which supplies concise titles, summaries, study actions and subquestion notes. Never hand-edit generated pages.
- Preserve difficulty ratings, priority decisions and prerequisite reasoning. A short dependent question is not automatically a good starting point; say which earlier result it needs.
- Preserve the approved page order: exam overview, target scores, major-question features, solving priorities, preparation. Separate sections using the shared logo strips and restrained background changes. Do not reintroduce the removed ability-comparison or source/methodology sections.
- The overview pie represents provisional point shares, not question counts. Label sectors in points. Show major-question count, subquestion count and subject/whole-exam totals; show each difficulty as `基本レベル N問（推定：X点）` without extra percentage rows. Derive all counts and points from the evidence.
- Use the full labels `基本レベル`, `基本＋αレベル`, `標準レベル`, `発展レベル`; do not replace 基本 with 基礎. Preserve the source's numeric scale and aggregation in the evidence even when that chart is not displayed.
- Preserve target-score analysis as a distinct, concise section. Show each profile's target and a practical selection route. Do not restore the removed calculation-conditions block or maximum-times-factor slogans. Keep necessary provisional/time-budget caveats brief and adjacent to the figures.
- Distinguish the theoretical maximum, the target after its profile-specific factor/rounding, and the points/time of the practical selection. Do not label the maximum plan's time as the target plan's time. These are editorial simulations, not official subquestion marks, pass cutoffs, measured correctness rates or guaranteed scores. Import numbers instead of typing them into editorial copy; preserve the factors, initial decision-time accounting and dependency rules.
- Use the current answer page when making method-specific study advice: preserve the intended skill while naming the actual published method. Record substantive editorial adaptations in `editorialNotes`.

## Cross-subject calculation contracts

- Validate the subject's actual assessment axes via `analysisAxesFor`, not mathematics' axes by default. Add unsupported subjects explicitly with a test; do not silently reinterpret radar columns.
- Preserve the source time model's rounding order: adjust and round each subquestion's judgment/execution time to one decimal, then sum. Rounding only the final total changes plans that contain half-minute tasks.
- A maximum plan need not contain every initially prioritized question. Compare ID sets; if questions must be removed, show an explicit replacement route rather than presenting added questions as sufficient. Check points, time budget and prerequisite closure after the replacement.
- Distinguish official combined-subject exam time from provisional per-subject allocation. Whole-exam totals must be supplied for that exam; do not copy mathematics' previous total. If a source assumption looks implausible, retain its values and flag the specific assumption for editorial review instead of adjusting its multipliers without authority.

## Generate and verify

- Run `npm run past-exam:analyses`, `npm run past-exam:analyses:test`, and the normal site build. The build regenerates analyses from local snapshots, without depending on another checkout.
- Check coverage of all major questions/subquestions, chart values and totals, target arithmetic and selected-question totals/time, dependency-aware priority notes, review status, and links in both directions. Question and answer pages discover matching analyses through `pastExamAnalyses.ts`; update the university/year row too.
- Follow the existing site's authorized staging publication flow. This skill does not independently authorize publication or require a hosting-provider migration.
