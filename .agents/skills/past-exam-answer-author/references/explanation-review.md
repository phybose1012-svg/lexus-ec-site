# Explanation review for Lexus past-exam answers

Use this when creating or revising an explanation, and on later editorial review rounds. Preserve the approved table conventions and the problem's intended solution path. These are review lenses, not a mandate to make every explanation longer.

## Pass 1: What is this subquestion asking for?

- Read the published question, not just the current answer. Identify its requested outputs: a value, coordinate, number of solutions, probability, proof, etc.
- Trace each calculation to an output or a necessary intermediate result. Ask: why does the reader need this step here?
- If a calculation is preparation for a later subquestion, either move it there or explicitly name that later purpose before the calculation. Do not silently solve a different question inside the current one.
- Reusing an earlier result is valid; identify where it was established. Anticipating a later conclusion as if already proved is circular.
- Example: extrema use the sign of the first derivative. Computing the second derivative in the same section is acceptable for a shared table only with an explicit explanation that it prepares the next question on inflection points.

## Pass 2: Do the steps actually follow?

- For each “therefore”, equivalence, substitution, or theorem, check the premise is given, proved, or explicitly cited from an earlier subquestion.
- Before saying “代入します”, display or unambiguously identify the equation receiving the values. If deriving that equation requires squaring or expanding, show that bridge first; listing values alone does not identify a substitution target.
- When converting a vector equation into a distance or squared-distance calculation, preserve the Lexus teaching sequence: take the magnitudes of both sides, square the resulting scalar equality, expand with dot products, then substitute the known magnitudes and dot products. Show the magnitude bars and the symbolic expansion, rather than jumping directly from a vector equality to a numeric squared length. Distinguish vector magnitude from scalar absolute value in the prose. Equal-distance conditions for a circumcenter likewise need the norm equalities before their squared equations.
- Check domains, nonzero divisors, square-root signs, excluded solutions, interval endpoints, and necessity versus sufficiency. A zero derivative is a candidate, not by itself an extremum or inflection point.
- Define variables before use and keep the same quantity attached to each symbol. Distinguish a point's x-coordinate, its y-coordinate, and a function value.
- Name geometric angles/segments when an unexplained “equal angles” or “apply the theorem” obscures the inference. Check point order before replacing a segment length by a difference.
- For counting arguments, verify cases are exhaustive and disjoint, impossible cases are excluded for a stated reason when not immediate, and the denominator uses equally likely outcomes.
- Repair the smallest missing bridge; do not replace the intended method or add an unrelated alternative just to avoid a difficult step.

## Pass 3: Does each displayed formula earn its space?

- Remove display blocks that merely repeat an immediately available table value or the following conclusion without adding a calculation or a necessary explanation.
- Deleting a display does not mean deleting needed reasoning. A coordinate still needs both components; cite a table value or give a short inline substitution if that is the missing basis.
- Example: omit a standalone centered `f(0)=0` when the table already gives the value and the conclusion states the inflection point. Refer to the table in the prose instead.
- Retain nontrivial calculations, changes of viewpoint, or useful derivations even when their final value is repeated in the conclusion. Do not delete formulas automatically by length, simplicity, or character count.
- Avoid an identical prose conclusion immediately followed by the same result box. Use the prose for the reason and the box for the result.
- Each colored formula block represents one meaningful calculation purpose. Read `frontend/src/data/pastExamFormulaPurposes.json`, reuse a matching `purposeId`, and add a label only if its purpose is genuinely distinct. Prefer a concrete purpose or method over labels such as “式”, “計算”, or “解説”.
- Do not manufacture synonym variants. Adding a label does not fix a wrong location or a missing premise. Combine adjacent same-purpose calculations only if doing so improves readability.
- Name an operation so students can see its purpose: for example, use “漸近線を求めるための式変形” for the rewrite into a linear term plus a remainder, not the vague “関数を分解する”. Update a canonical label in the library when improving its wording, rather than creating a synonymous entry.

## Repeat and gradually improve

1. Run these passes after the draft or substantive revision.
2. After fixes, reread from the question again with a fresh goal: verify the new prose does not introduce circular references, remove a necessary premise, or repeat the conclusion.
3. Before publication, verify requested outputs and answer-key slots still agree; required tables/diagrams remain; tags describe the actual operations; screen and print preserve the same meaning.
4. On subsequent review rounds, record concrete failures and their smallest reusable correction here. Keep problem-specific conclusions out of general rules. Do not claim that a script has verified prose logic, and do not create an unattended review schedule unless the user requests one.

Stop a round when its concrete findings are resolved and rereading reveals no new issue; report any unresolved mathematical uncertainty rather than repeatedly rewriting good explanations.
