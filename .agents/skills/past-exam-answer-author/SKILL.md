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
- Keep `contentProvenance` equal to `original_editorial` and `restrictedSourceCopied` equal to `false`. The build script rejects other values.

## Workflow

1. Solve every subquestion from the question page and record the answer-key slots.
2. Write concise explanations as `prose`, `formula`, `note`, `steps`, `table`, and `result` blocks. Put inline TeX inside `\(...\)` and display TeX in `formula.latex`.
3. Run `scripts/build-answer-page.mjs --source <authoring-json> --output <generated-json>` from the site repository root.
4. Do not edit generated JSON by hand. Fix the authoring source or builder and regenerate.
5. Link the generated route from the question page and university table. Verify answer slots, formulas, anchors, `noindex`, and print output.

The generic route discovers `frontend/src/data/generated/pastExamAnswers/*.json` automatically. Add university-specific rendering only when the common block model cannot express the explanation.
