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

`--overrides` is optional. Use package-scoped operations for small, reproducible presentation corrections:

- `replace-text` replaces an exact string and fails unless `expectedMatches` is met.
- `promote-inline-fractions` applies display-style fraction sizing to every inline formula in scope that contains `\\frac`.
- `flatten-introduction` preserves the semantic source order while joining introductory prose and fact lists into one naturally wrapping paragraph.
- `wrap-introduction` wraps the content between the first `h2` and `h3` in a named class for compact introductory layout.

Keep override files declarative and narrowly scoped to a major-question ID. If an operation changes the meaning of the question rather than its presentation, fix and re-review the source package instead.

The importer copies only referenced content assets plus the shared local KaTeX runtime. If a package needs non-HTML figures, keep their rights state explicit.

## Independently drawn figures and subject-specific notes

- When creating, regenerating, or correcting original diagrams, follow the project-local [Past Exam Diagram Author](../past-exam-diagram-author/SKILL.md). It owns the SVG typography, deterministic generation, collision review, and figure-package validation; this importer owns registration and replacement in question HTML.
- To replace source crop slots with original diagrams, pass `--figure-manifest frontend/src/data/pastExamFigures/<package-id>.json`. The shared renderer validates package-scoped asset paths, IDs, dimensions, alt text and captions, then replaces matching `data-crop-id` figures. Missing mappings fail; do not silently drop a required diagram.
- The manifest uses `lexus-past-exam-figures.v1`, `contentProvenance: original_editorial`, `restrictedSourceCopied: false`, and `items` containing `id`, `src`, `width`, `height`, `alt`, `caption`. A manifest does not grant rights to source material. Draw from the mathematical conditions; do not embed restricted crops inside an SVG.
- Iwate 2025 physics uses `frontend/scripts/build-iwate-2025-physics-figures.mjs` to regenerate its 10 original assets and manifest. This geometry is package-specific; the registration and HTML rendering are shared.
- Optional `printNotes` in the override file replaces the mathematics-specific print notes. Derive instructions, single-/multiple-choice rules and combined-subject time from the current exam, not the preceding page.
- After a physics import, run the normal build and `npm run past-exam:physics:test` from `frontend`. This checks static artifacts and mathematical invariants, not browser layout or human editorial approval.
