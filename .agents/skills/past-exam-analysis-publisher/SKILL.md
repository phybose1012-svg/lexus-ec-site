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

## Editorial pass

- Keep the evidence snapshot separate from `src/data/pastExamAnalysisSources/<package-id>.json`, which supplies concise titles, summaries, study actions and subquestion notes. Never hand-edit generated pages.
- Preserve difficulty ratings, priority decisions and prerequisite reasoning. A short dependent question is not automatically a good starting point; say which earlier result it needs.
- Prefer a one-line takeaway, major-question summaries, a compact subquestion priority table and a small comparison chart. Use only representations that help students decide what to solve or review. Do not add an entire raw report behind accordions merely to avoid editing it.
- Graph counts as counts, not point shares. Retain the source's numeric scale and aggregation, and disclose editorial/provisional assumptions adjacent to the graph. Do not invent scores, percentages, time estimates or annual trends to make a chart.
- Beside the difficulty distribution, explicitly show `小問の合計 N問`, calculated from the imported questions. Use the full labels `基本レベル`, `基本＋αレベル`, `標準レベル`, `発展レベル` in legends and tables; let the `レベル` suffix wrap on narrow screens instead of abbreviating it.
- The current requirement bars preserve the report's 0–5, provisional-point-weighted scores. They are neither official marks nor observed success rates. If changing an aggregation is genuinely useful, label it and keep a trace to the original.
- Preserve target-score analysis as a distinct, concise section when it exists in the source. Shorten repeated explanation, not this entire dimension of the analysis. Show each profile's target, a practical question-selection route and the provisional scoring/time basis. Keep detailed calculation conditions expandable rather than removing caveats.
- Distinguish the theoretical maximum, the target after its profile-specific factor/rounding, and the points/time of the practical selection. Do not label the maximum plan's time as the target plan's time. These are editorial simulations, not official subquestion marks, pass cutoffs, measured correctness rates or guaranteed scores. Import numbers instead of typing them into editorial copy; preserve the factors, initial decision-time accounting and dependency rules.
- Use the current answer page when making method-specific study advice: preserve the intended skill while naming the actual published method. Record substantive editorial adaptations in `editorialNotes`.

## Generate and verify

- Run `npm run past-exam:analyses`, `npm run past-exam:analyses:test`, and the normal site build. The build regenerates analyses from local snapshots, without depending on another checkout.
- Check coverage of all major questions/subquestions, chart values and totals, target arithmetic and selected-question totals/time, dependency-aware priority notes, review status, and links in both directions. Question and answer pages discover matching analyses through `pastExamAnalyses.ts`; update the university/year row too.
- Follow the existing site's authorized staging publication flow. This skill does not independently authorize publication or require a hosting-provider migration.
