---
name: past-exam-analysis-publisher
description: Turn saved Lexus past-exam analysis HTML into concise, data-backed analysis pages in the existing Astro past-exam library. Use for analysis pages, not question transcription or answer derivations.
---

# Past Exam Analysis Publisher

Keep the saved report intact. Publish a separate, student-facing summary using white surfaces, restrained accents, and the existing problem/answer/analysis navigation.

## Source and extraction

- Locate the matching university/year/subject report. The first supported report is `preview-html/public-preview/index.html`, with `analysis.json` alongside its parent preview directory in the source package.
- Read the HTML's review banner, assessment explanations, and the companion metadata. A `public-preview` directory is not editorial approval. Preserve review status and the staging `noindex` policy; do not infer permission to deploy to production.
- From `frontend`, run `node scripts/import-past-exam-analysis.mjs --html <saved-html> --metadata <analysis.json> --source-ref <source-project-relative-html-path> --output src/data/pastExamAnalysisEvidence/<package-id>.json`.
- This adapter extracts difficulty, priority, reasons and major-question chart values from HTML; checks package identity and values against its companion metadata; and records the source hash. Unsupported report structure must fail rather than silently omit sections. For another structure, extend the adapter with tests, not a university-name exception.

## Editorial pass

- Keep the evidence snapshot separate from `src/data/pastExamAnalysisSources/<package-id>.json`, which supplies concise titles, summaries, study actions and subquestion notes. Never hand-edit generated pages.
- Preserve difficulty ratings, priority decisions and prerequisite reasoning. A short dependent question is not automatically a good starting point; say which earlier result it needs.
- Prefer a one-line takeaway, major-question summaries, a compact subquestion priority table and a small comparison chart. Use only representations that help students decide what to solve or review. Do not add an entire raw report behind accordions merely to avoid editing it.
- Graph counts as counts, not point shares. Retain the source's numeric scale and aggregation, and disclose editorial/provisional assumptions adjacent to the graph. Do not invent scores, percentages, time estimates or annual trends to make a chart.
- The current requirement bars preserve the report's 0–5, provisional-point-weighted scores. They are neither official marks nor observed success rates. If changing an aggregation is genuinely useful, label it and keep a trace to the original.
- Omit assumption-heavy target/efficiency simulations when they obscure the core reading task. Keep the underlying source and clearly distinguish omission from recalculation. Do not remove a caveat while retaining the number that needs it.
- Use the current answer page when making method-specific study advice: preserve the intended skill while naming the actual published method. Record substantive editorial adaptations in `editorialNotes`.

## Generate and verify

- Run `npm run past-exam:analyses`, `npm run past-exam:analyses:test`, and the normal site build. The build regenerates analyses from local snapshots, without depending on another checkout.
- Check coverage of all major questions/subquestions, chart values and totals, dependency-aware priority notes, review status, and links in both directions. Question and answer pages discover matching analyses through `pastExamAnalyses.ts`; update the university/year row too.
- Follow the existing site's authorized staging publication flow. This skill does not independently authorize publication or require a hosting-provider migration.
