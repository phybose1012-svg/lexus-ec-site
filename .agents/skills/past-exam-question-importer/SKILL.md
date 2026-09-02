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
2. Run `scripts/import-question-page.mjs` from the site repository root with the source directory, output JSON, public asset root, route metadata, and a repository-relative source reference.
3. Do not edit the generated JSON by hand. Fix the source or importer and regenerate it.
4. The generic Astro route discovers generated JSON automatically. Add a university-specific adapter only when the source cannot satisfy the common semantic contract, not merely because the university name or exam route differs.
5. Link the new question page from the university/year/subject table, then verify the route, all major-question anchors, KaTeX rendering hooks, generated metadata, and `noindex` policy.

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
  --source-reference <repository-relative-source-path>
```

The importer copies only referenced content assets plus the shared local KaTeX runtime. If a package needs non-HTML figures, keep their rights state explicit and use a package-specific adapter only when generic asset copying is insufficient.
