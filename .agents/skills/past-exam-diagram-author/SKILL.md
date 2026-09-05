---
name: past-exam-diagram-author
description: Reconstruct original, editable SVG diagrams for Lexus EC past-exam question and answer pages, including mathematical graphs, geometry, physics schematics, and TeX-consistent labels. Use when a required visual must be drawn, replaced, corrected, or validated; do not use for semantic HTML tables or decorative branding.
---

# Past Exam Diagram Author

Create deterministic SVG figures from the published mathematical or physical conditions, then register and verify them in the shared past-exam figure system. The result must remain editable and regenerable when a label, coordinate, or convention changes.

## Choose the right representation

- Use semantic HTML for increase/decrease tables, concavity tables, answer tables, and other row/column data. Follow the answer-author skill for those structures.
- Use generated SVG for graphs, geometry, circuits, optical layouts, force/direction diagrams, and other spatial relationships.
- Use a `figurePlaceholder` when the available conditions are insufficient to draw the visual faithfully. Do not invent missing geometry merely to eliminate a placeholder.

## Source and rights boundary

- Reconstruct from the public question, independently derived calculations, and verified answer conditions. A restricted crop may identify that a visual is required, but must not be traced, embedded, or copied.
- Keep `contentProvenance: original_editorial` and `restrictedSourceCopied: false`. Drawing a new SVG does not alter the source package's rights or review status.
- Preserve problem meaning before visual similarity: point order, signs, terminal orientation, arrow direction, scale caveats, and mathematical invariants are the source of truth.

## Workflow

1. Inventory every required visual by stable ID and state its job in one sentence. Record the quantities, topology, directions, labels, and any schematic/not-to-scale assumptions that the drawing must preserve.
2. Read [SVG authoring and review](references/svg-authoring-and-review.md) before creating or revising an SVG. Select the relevant mathematics or physics checks from that reference.
3. Create or update a package-specific deterministic generator at `frontend/scripts/build-<package-id>-figures.mjs`. Keep geometry calculations and reusable primitives in code; do not hand-edit generated SVGs.
4. Write assets to `frontend/public/assets/past-exams/<package-id>/figures/` and regenerate `frontend/src/data/pastExamFigures/<package-id>.json`. Use `lexus-past-exam-figures.v1`, stable lowercase IDs, intrinsic integer dimensions, meaningful alt text, and a concise caption.
5. Integrate by ID: question imports replace matching `data-crop-id` figures through their manifest; answer sources use `{ "type": "figure", "assetId": "<id>" }` and declare `figureManifest`. Missing or duplicate mappings must fail rather than disappear.
6. Run the package generator, then validate and rasterize every figure:

```powershell
node .agents/skills/past-exam-diagram-author/scripts/validate-figure-package.mjs `
  --manifest frontend/src/data/pastExamFigures/<package-id>.json `
  --public-root frontend/public `
  --qa-dir <temporary-qa-directory>
```

Inspect the contact sheet and each changed PNG at the intended screen size. Check every label, not only the latest edit. Re-run generation and inspection after any coordinate or typography change.
7. Add package-specific tests for meaning that static SVG validation cannot prove: calculated points, curve/asymptote relationships, circuit terminals and winding direction, sign conventions, choice order, and ambiguous TeX glyphs. Render the local KaTeX command when checking a glyph; do not compare by memory.
8. Run the relevant question/answer tests and the normal site build. Verify screen and print meaning. Automated checks do not replace mathematical/physical review or publication approval.

## Completion contract

A figure set is complete only when its generator is the editable source, generated assets and manifest agree, static validation passes, all rasters have been inspected for collisions, package invariants pass, and the page retains a useful text alternative. Publishing to staging or production still requires the authorization of the enclosing task.

Current reference implementations are `frontend/scripts/build-iwate-2025-mathematics-figures.mjs` and `frontend/scripts/build-iwate-2025-physics-figures.mjs`. Reuse their contracts and typography approach, not their package-specific geometry.
