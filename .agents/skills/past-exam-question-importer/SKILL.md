---
name: past-exam-question-importer
description: Import semantic public-candidate past-exam question HTML into the Lexus EC Astro past-exam library. Use when adding or refreshing a university/year/subject question page from the shidai-igakubu-gokaku-dokuhon source project; do not use for answer or analysis pages.
---

# Past Exam Question Importer

Turn the source project's reviewed semantic question HTML into a consistent Lexus EC question page without manually retyping exam content.

## Source contract

Use a source directory shaped like:

```text
source-html/generated/public-candidate/questions/
├─ index.html
└─ major-question-*.html
```

The index must contain `data-question-shared-instructions`. Each major-question file must contain `data-major-question-id` and an embedded `#source-reconstruction` JSON record. Treat missing markers, unsafe markup, unresolved assets, and package-ID mismatches as import failures rather than guessing.

## Workflow

1. Read the source package's `issues.json`, reconstruction metadata, and publication banner. Preserve `needs_human_review` and rights state in the generated data.
2. Run `scripts/import-question-page.mjs` from the site repository root with the source directory, output JSON, public asset root, route metadata, and a repository-relative source reference. When a reviewed source needs a narrow display correction, pass a package override file with `--overrides` instead of editing generated JSON.
3. Do not edit the generated JSON by hand. Fix the source or importer and regenerate it.
4. The generic Astro route discovers generated JSON automatically. Add a university-specific adapter only when the source cannot satisfy the common semantic contract, not merely because the university name or exam route differs.
5. Link the new question page from the university/year/subject table, then verify the route, all major-question anchors, KaTeX rendering hooks, generated metadata, and `noindex` policy.

Do not infer the exam's visible question count or taxonomy from the number of imported reader files. Shared-stem groups may store `問題14〜16` in one section. Count the numbered assessment items, and make the question, answer, analysis, print and SEO surfaces agree. If the source labels individual items as `問題N`, call them 問題 and report the reader grouping separately; do not invent “大問16題” from 16 storage sections when the paper actually has 25 questions.

The importer rewrites every inequality into Japanese school notation: `\le`, `\leq`, `\leqslant` and ≤ become `\leqq`/≦, and the `\ge` family becomes `\geqq`/≧. Upstream transcriptions routinely use `\le`; ≤ and ≥ are never used up to university entrance level, so the published page must not inherit them. Commands that merely share the prefix, such as `\left` and `\gets`, are untouched.

The importer removes a direct `page-kicker` from each major-question fragment because the following `h2` already names the major question. Do not restore labels such as “第1問・大問別問題” above the same “第1問” heading.

## Publication boundary

`public-candidate` means structurally ready for a publication review, not rights-approved. A staging URL protected only by `noindex` is still externally reachable. Do not push question content whose source says publication is prohibited or whose rights status is `review_required` until the user or responsible editor explicitly approves that shared staging publication.

## Standard command

Run from the site repository root, replacing metadata as needed:

```powershell
node .agents/skills/past-exam-question-importer/scripts/import-question-page.mjs `
  --source-dir <public-candidate-questions-directory> `
  --output frontend/src/data/generated/pastExamQuestions/<package-id>.json `
  --public-root frontend/public `
  --university-id <university-id> `
  --university-name <university-name> `
  --year <year> `
  --subject-id <subject-id> `
  --subject-name <subject-name> `
  --subject-english <subject-english> `
  --exam-label <exam-label> `
  --stage-label <stage-label> `
  --duration-label <duration-label> `
  --source-reference <repository-relative-source-path> `
  --overrides frontend/src/data/pastExamOverrides/<package-id>.json
```

On Windows, run this from PowerShell, or prefix the command with `MSYS_NO_PATHCONV=1` under Git Bash. Git Bash rewrites leading-slash arguments into Windows paths, which silently turns `--analysis-path /foo/` into `C:/Program Files/Git/foo/` in the generated `links`. Check `links` in the output JSON after importing.

`--overrides` is optional. Use package-scoped operations for small, reproducible presentation corrections:

- `replace-text` replaces an exact string and fails unless `expectedMatches` is met.
- `promote-inline-fractions` applies display-style fraction sizing to every inline formula in scope that contains `\\frac`.
- `flatten-introduction` preserves the semantic source order while joining introductory prose and fact lists into one naturally wrapping paragraph.
- `wrap-introduction` wraps the content between the first `h2` and `h3` in a named class for compact introductory layout.

Keep override files declarative and narrowly scoped to a major-question ID or to `shared` instructions. If an operation changes the meaning of the question rather than its presentation, fix and re-review the source package instead.

## Marked-choice layout

- Preserve marked choices as a semantic list with each mark and value in the same `listitem`. A visually tabular layout does not make the choices relational data, so do not replace the list with an HTML `table` solely for presentation.
- Inspect the number of choices and the widest rendered expression before choosing columns. For a fixed set of ten compact choices, a proven starting profile is five columns by two rows on desktop and print, and two columns by five rows on mobile.
- Scope a special choice grid to `data-past-exam-package`; `.structured-list--values` is shared by packages with different content structures and must not be globally redefined for one exam.
- Keep the mark visually distinct from its value. On narrow screens, place the mark in a short top band and the expression below when a side-by-side mark reduces usable formula width.
- Verify the widest choices at desktop, 390px, 360px, and 320px. Confirm that neither the page nor the list overflows horizontally, formulas remain legible without unintended line breaks, source order is unchanged, and print keeps each choice list together where practical.

## Source defect escalation

When a semantic transcription or explanation defect is found, do not hide it in a display override and do not spend the library-build session repairing the separate source repository. Use independently verified content on the Lexus side only when the correct value follows unambiguously from the published problem, and create a handoff prompt for a dedicated source-repair session.

A source defect must not stop unrelated library work. Continue every section and task that does not depend on the uncertain value, including route scaffolding, metadata, original diagrams, styling, tests, and independently authored answers. Never publish or guess the affected question content: keep the route or section review-gated and `noindex`, identify the precise blocked boundary, and let the dedicated repair session make the canonical source change. Re-run the import after that repair before clearing the boundary.

Audit the complete in-scope package, including every relevant question and answer page, so the prompt reports all detected defects, not only the first failure. For each defect include the source page, canonical-data location, current value, expected value, and mathematical or visual evidence. The prompt must also name the repository/package, required local instructions, canonical-first repair rule, generated artifacts to rebuild, stale-value search, package validators and browser QA, unchanged rights/review gates, allowed Git scope, and the completion report expected from the repair session. Save the complete prompt as a reviewable Markdown artifact beside the library work. If evidence is insufficient, request an open issue rather than a guessed correction.

The importer copies only referenced content assets plus the shared local KaTeX runtime. If a package needs non-HTML figures, keep their rights state explicit.

## Independently drawn figures and subject-specific notes

- When creating, regenerating, or correcting original diagrams, follow the project-local [Past Exam Diagram Author](../past-exam-diagram-author/SKILL.md). It owns the SVG typography, deterministic generation, collision review, and figure-package validation; this importer owns registration and replacement in question HTML.
- To replace source crop slots with original diagrams, pass `--figure-manifest frontend/src/data/pastExamFigures/<package-id>.json`. The shared renderer validates package-scoped asset paths, IDs, dimensions, alt text and captions, then replaces matching `data-crop-id` figures. Missing mappings fail; do not silently drop a required diagram.
- The manifest uses `lexus-past-exam-figures.v1`, `contentProvenance: original_editorial`, `restrictedSourceCopied: false`, and `items` containing `id`, `src`, `width`, `height`, `alt`, `caption`. A manifest does not grant rights to source material. Draw from the mathematical conditions; do not embed restricted crops inside an SVG.
- Iwate 2025 physics uses `frontend/scripts/build-iwate-2025-physics-figures.mjs` to regenerate its 10 original assets and manifest. This geometry is package-specific; the registration and HTML rendering are shared.
- Optional `printNotes` in the override file replaces the mathematics-specific print notes. Derive instructions, single-/multiple-choice rules and combined-subject time from the current exam, not the preceding page.
- After a physics import, run the normal build and `npm run past-exam:physics:test` from `frontend`. This checks static artifacts and mathematical invariants, not browser layout or human editorial approval.
