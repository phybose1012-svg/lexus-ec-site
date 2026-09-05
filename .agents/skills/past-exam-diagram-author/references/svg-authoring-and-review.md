# SVG authoring and review

Read this reference when drawing or revising a past-exam SVG. Apply the shared rules first, then the relevant subject checks. These constraints preserve the successful mathematics and physics figure workflow without freezing one university's layout.

## Establish the drawing contract

Before writing coordinates, list:

- the figure ID and whether it appears in the question, answer, or both;
- the relation the reader must understand;
- givens that determine geometry or topology;
- named points, quantities, units, directions, polarities, and choice order;
- which distances/angles are exact and which parts are schematic or exaggerated;
- equations or answer steps that the figure must agree with.

If a required relation cannot be derived from the published conditions, keep a placeholder and report the missing fact. A visually plausible guess is not a reconstruction.

## Build deterministically

- Generate the SVG and manifest from a package-specific `.mjs` source. Running it twice without input changes must produce identical files.
- Calculate coordinates from the stated function or geometry when possible. Keep formulas and named constants beside the drawing code so reviewers can audit them.
- Use a `viewBox` matching the intrinsic `width` and `height`, a white base, non-scaling strokes, and package-local assets. Do not include `<image>`, `<foreignObject>`, scripts, event handlers, external links, or remote fonts.
- Prefer small composable primitives for lines, arrows, dimensions, points, paths, mathematical text, and escaped ordinary text. Keep package-specific topology in the package generator rather than hiding it in a universal template.
- Use stable, descriptive lowercase IDs. Prefix answer-only figures with `ans-` when that helps distinguish their role.

## Match the page's mathematics typography

SVGs loaded through `<img>` do not reliably inherit page fonts. Embed the shipped `KaTeX_Main-Regular` and `KaTeX_Math-Italic` WOFF2 faces as data URLs in every SVG that contains mathematical labels.

- Put variables in KaTeX Math italic.
- Put digits, operators, delimiters, and upright symbols in KaTeX Main.
- Put Japanese annotations in the site's Japanese sans-serif stack.
- Represent subscripts with a smaller, baseline-shifted span. Do not fake a subscript by moving an entire label manually.
- Match the TeX command used in the page. Visually similar Unicode characters are not interchangeable. Use the shipped KaTeX runtime to inspect the actual HTML glyph when needed; for example, `\phi` renders `ϕ`, while `\varphi` renders `φ`.
- Add a package regression assertion for an ambiguous symbol or convention so a later edit cannot silently change it.

## Place labels for reading, not decoration

- Reserve clear space for labels while designing the geometry. Do not place text and hope that font changes will still fit.
- No curve, axis, guide, boundary, arrow, dimension line, point marker, or neighboring label may pass through a glyph.
- Relocate the label into nearby clear space first. Add a short leader line when relocation weakens association. Use an opaque label backing only when neither option preserves meaning.
- Keep labels inside the viewBox with enough breathing room for italic overhangs and subscripts.
- Keep related labels aligned and use a restrained, consistent type scale. Do not shrink a single difficult label until it becomes less legible than the surrounding page.
- After every coordinate or font change, rasterize the whole package and inspect all labels. A local change can alter embedded fonts or shared primitives across every asset.

## Mathematics checks

- Plot functions from their formulas. Split sampled paths at discontinuities and clip extreme values instead of drawing a false bridge across an asymptote.
- Calculate extrema, intersections, asymptotes, centers, radii, and constructed points independently and assert useful numerical invariants in tests.
- Distinguish a mathematical construction from a merely illustrative placement. When a drawing is not to scale, say so in alt text or caption where that affects interpretation.
- Preserve point order and incidences. A label placed on the wrong side of a line can change the implied geometry even when the calculation is correct.
- For combinatorial layouts, preserve the number and order of cases; do not let decorative spacing imply an additional case.

## Physics checks

- Establish the coordinate system and positive directions before drawing arrows. Check arrowheads after every transform or mirroring operation.
- For circuits and induction diagrams, verify terminal order, polarity, winding orientation, current direction, magnetic-flux direction, switch state, and which components are connected or open.
- For mechanics/orbits, verify the attracting center, distance measured from that center, velocity direction, and which bodies remain after a separation.
- For optics, verify surface order, curvature, focus/center locations, ray direction, phase-reversal assumptions, and whether thickness or gap has been exaggerated.
- For graphs, verify interval endpoints, signs, discontinuities, baseline, and exact choice labels. A polished line graph with the wrong sign is still wrong.

## Semantics and registration

- The SVG must contain a nonempty `<title>` and use `role="img"` with `aria-labelledby`.
- Manifest `alt` text should express the relationship needed to understand the question or solution, not merely say “図” or repeat the caption.
- Keep the caption short and reader-facing. Mention “模式図” or scale exaggeration when the distinction matters.
- Use the manifest's intrinsic dimensions in rendered HTML to prevent layout shift and preserve print sizing.
- A manifest registers an original editorial asset; it does not grant publication rights to the surrounding past-exam content.

## Review sequence

1. Run the generator twice and confirm the second run produces no diff.
2. Run `validate-figure-package.mjs` with a temporary QA directory.
3. Inspect the contact sheet for global consistency, then inspect every changed PNG at original detail.
4. Compare the drawing contract with the published question and the equations in the answer.
5. Run package-specific invariants, question/answer tests, and the site build.
6. Check the final page and print output when the requested change affects responsive sizing, page breaks, or print-only styling.

When a review reveals a reusable failure mode, add the smallest general rule here and a focused automated assertion where the invariant is machine-checkable. Keep problem-specific coordinates and answers in the package generator/tests.
