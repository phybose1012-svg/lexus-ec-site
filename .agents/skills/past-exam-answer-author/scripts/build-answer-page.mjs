import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || value === undefined) {
      throw new Error("Arguments must be supplied as --key value pairs");
    }
    args[key.slice(2)] = value;
  }
  return args;
}

function requireValue(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInlineMath(value, label) {
  const text = requireValue(value, label);
  let output = "";
  let cursor = 0;

  while (cursor < text.length) {
    const start = text.indexOf("\\(", cursor);
    if (start === -1) {
      output += escapeHtml(text.slice(cursor));
      break;
    }
    output += escapeHtml(text.slice(cursor, start));
    const end = text.indexOf("\\)", start + 2);
    if (end === -1) throw new Error(`${label} has an unclosed inline formula`);
    const latex = text.slice(start + 2, end).trim();
    requireValue(latex, `${label} inline formula`);
    output += `<span class="math-inline" data-katex="${escapeHtml(latex)}" data-display-mode="false">${escapeHtml(latex)}</span>`;
    cursor = end + 2;
  }

  return output;
}

function renderVariationTrend(value, label) {
  const match = value.match(/^\[\[trend:(increase|decrease):(concave-down|concave-up)\]\]$/);
  if (!match) return null;

  const [, direction, concavity] = match;
  const labels = {
    "increase:concave-down": "増加・上に凸",
    "decrease:concave-down": "減少・上に凸",
    "decrease:concave-up": "減少・下に凸",
    "increase:concave-up": "増加・下に凸",
  };
  const paths = {
    "increase:concave-down": {
      curve: "M6 30 C18 15 37 7 58 6",
      head: "M50 3 L59 6 L53 13",
    },
    "decrease:concave-down": {
      curve: "M6 6 C29 7 48 17 58 30",
      head: "M50 27 L59 31 L56 22",
    },
    "decrease:concave-up": {
      curve: "M6 6 C16 20 35 29 58 30",
      head: "M51 25 L59 30 L52 34",
    },
    "increase:concave-up": {
      curve: "M6 30 C29 29 48 19 58 6",
      head: "M50 9 L59 5 L57 14",
    },
  };
  const key = `${direction}:${concavity}`;
  const trend = paths[key];
  if (!trend) throw new Error(`${label} has an unsupported variation trend`);

  return `<span class="answer-trend" role="img" aria-label="${labels[key]}"><svg viewBox="0 0 64 36" aria-hidden="true" focusable="false"><path class="answer-trend__curve" d="${trend.curve}"/><path class="answer-trend__head" d="${trend.head}"/></svg></span>`;
}

function renderTableCell(value, label, variant) {
  if (typeof value !== "string") throw new Error(`${label} must be a string`);
  if (variant === "variation") {
    if (value.trim() === "") return "";
    if (value.trim() === "[[no-value]]") {
      return '<svg class="answer-table__diagonal" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><line x1="0" y1="0" x2="100" y2="100" vector-effect="non-scaling-stroke"/></svg>';
    }
    const trend = renderVariationTrend(value.trim(), label);
    if (trend) return trend;
  }
  return renderInlineMath(value, label);
}

function renderTable(block, label) {
  if (!Array.isArray(block.headers) || block.headers.length === 0) {
    throw new Error(`${label} must include headers`);
  }
  if (!Array.isArray(block.rows) || block.rows.length === 0) {
    throw new Error(`${label} must include rows`);
  }
  const headers = block.headers
    .map((header, index) => `<th scope="col">${renderTableCell(header, `${label} header ${index + 1}`, block.variant)}</th>`)
    .join("");
  const variant = block.variant === undefined ? "" : requireValue(block.variant, `${label} variant`);
  if (variant && variant !== "variation") {
    throw new Error(`${label} has unsupported table variant ${variant}`);
  }
  const rows = block.rows
    .map((row, rowIndex) => {
      if (!Array.isArray(row) || row.length !== block.headers.length) {
        throw new Error(`${label} row ${rowIndex + 1} has the wrong number of cells`);
      }
      return `<tr>${row
        .map((cell, cellIndex) => {
          const content = renderTableCell(cell, `${label} row ${rowIndex + 1} cell ${cellIndex + 1}`, variant);
          if (variant === "variation" && cellIndex > 0 && cell.trim() === "[[no-value]]") {
            return `<td class="answer-table__no-value" aria-label="値なし">${content}</td>`;
          }
          return variant === "variation" && cellIndex === 0
            ? `<th scope="row">${content}</th>`
            : `<td>${content}</td>`;
        })
        .join("")}</tr>`;
    })
    .join("");
  const caption = block.caption
    ? `<caption>${renderInlineMath(block.caption, `${label} caption`)}</caption>`
    : "";
  const variantClass = variant ? ` answer-table-scroll--${variant}` : "";
  const tableVariantClass = variant ? ` answer-table--${variant}` : "";
  return `<div class="table-scroll answer-table-scroll${variantClass}" role="region" tabindex="0"><table class="source-table answer-table${tableVariantClass}">${caption}<thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderFigurePlaceholder(block, label) {
  const assetId = requireValue(block.assetId, `${label} assetId`);
  if (!/^[a-z0-9-]+$/.test(assetId)) throw new Error(`${label} assetId is invalid`);
  const title = requireValue(block.title, `${label} title`);
  const description = requireValue(block.description, `${label} description`);
  const size = block.size ?? "landscape";
  if (!["wide", "landscape", "square"].includes(size)) {
    throw new Error(`${label} has unsupported placeholder size ${size}`);
  }
  const caption = block.caption ? requireValue(block.caption, `${label} caption`) : title;
  return `<figure class="answer-figure-placeholder is-${size}" data-figure-placeholder="true" data-figure-id="${escapeHtml(assetId)}"><div class="answer-figure-placeholder__frame" role="img" aria-label="${escapeHtml(`${title}（図版準備中）`)}"><span>図版準備中</span><strong>ここに「${escapeHtml(title)}」が入ります</strong><p>${escapeHtml(description)}</p></div><figcaption>${escapeHtml(caption)}</figcaption></figure>`;
}

function renderBlock(block, label) {
  if (!block || typeof block !== "object") throw new Error(`${label} must be an object`);

  if (block.type === "prose") {
    return `<p class="prose">${renderInlineMath(block.text, `${label} text`)}</p>`;
  }
  if (block.type === "formula") {
    const latex = requireValue(block.latex, `${label} latex`);
    return `<div class="formula answer-formula" data-katex="${escapeHtml(latex)}" data-display-mode="true">${escapeHtml(latex)}</div>`;
  }
  if (block.type === "note") {
    return `<aside class="source-note answer-note"><strong>${escapeHtml(requireValue(block.label, `${label} label`))}</strong><p>${renderInlineMath(block.text, `${label} text`)}</p></aside>`;
  }
  if (block.type === "result") {
    return `<p class="answer-result"><strong>結論</strong><span>${renderInlineMath(block.text, `${label} text`)}</span></p>`;
  }
  if (block.type === "steps") {
    if (!Array.isArray(block.items) || block.items.length === 0) {
      throw new Error(`${label} must include items`);
    }
    return `<ol class="answer-steps">${block.items
      .map((item, index) => `<li>${renderInlineMath(item, `${label} item ${index + 1}`)}</li>`)
      .join("")}</ol>`;
  }
  if (block.type === "table") return renderTable(block, label);
  if (block.type === "figurePlaceholder") return renderFigurePlaceholder(block, label);

  throw new Error(`${label} has unsupported type ${block.type}`);
}

function renderAnswerKey(major) {
  if (!Array.isArray(major.answerKey) || major.answerKey.length === 0) {
    throw new Error(`${major.id} must include an answer key`);
  }
  const questions = major.answerKey
    .map((question, questionIndex) => {
      const questionLabel = requireValue(question.label, `${major.id} answer key ${questionIndex + 1} label`);
      if (!Array.isArray(question.entries) || question.entries.length === 0) {
        throw new Error(`${major.id} ${questionLabel} must include answer entries`);
      }
      const entries = question.entries
        .map((entry, entryIndex) => {
          const mark = requireValue(entry.mark, `${major.id} ${questionLabel} entry ${entryIndex + 1} mark`);
          const value = requireValue(entry.value, `${major.id} ${questionLabel} entry ${entryIndex + 1} value`);
          return `<span class="answer-key__slot" aria-label="${escapeHtml(`${mark}: ${value}`)}"><span class="answer-key__mark">${escapeHtml(mark)}</span><span class="answer-key__value">${escapeHtml(value)}</span></span>`;
        })
        .join("");
      return `<div class="answer-key__question"><dt class="answer-key__question-label">${escapeHtml(questionLabel)}</dt><dd class="answer-key__slots">${entries}</dd></div>`;
    })
    .join("");
  return `<section class="answer-key-panel" aria-labelledby="${escapeHtml(major.id)}-answer-key"><h3 id="${escapeHtml(major.id)}-answer-key">解答</h3><dl class="answer-key">${questions}</dl></section>`;
}

function renderMajor(major, index) {
  const id = requireValue(major.id, `major question ${index + 1} id`);
  const label = requireValue(major.label, `${id} label`);
  if (!/^major-question-\d{2}$/.test(id)) throw new Error(`${id} is not a valid major-question id`);
  if (!Array.isArray(major.sections) || major.sections.length === 0) {
    throw new Error(`${id} must include explanation sections`);
  }
  const sections = major.sections
    .map((section, sectionIndex) => {
      const title = requireValue(section.title, `${id} section ${sectionIndex + 1} title`);
      if (!Array.isArray(section.blocks) || section.blocks.length === 0) {
        throw new Error(`${id} section ${sectionIndex + 1} must include blocks`);
      }
      const sectionId = `${id}-section-${String(sectionIndex + 1).padStart(2, "0")}`;
      const blocks = section.blocks
        .map((block, blockIndex) => renderBlock(block, `${id} section ${sectionIndex + 1} block ${blockIndex + 1}`))
        .join("");
      return `<section class="answer-explanation-section" aria-labelledby="${sectionId}"><h3 id="${sectionId}">${escapeHtml(title)}</h3>${blocks}</section>`;
    })
    .join("");
  const html = `<article class="source-page-card major-question-card answer-major-card" id="${escapeHtml(id)}" data-major-question-id="${escapeHtml(id)}"><div class="page-kicker">${escapeHtml(label)}・解答解説</div><h2>${escapeHtml(label)} 解答・解説</h2>${renderAnswerKey(major)}<div class="answer-explanation">${sections}</div></article>`;
  return {
    id,
    label,
    order: Number(major.order ?? index + 1),
    html,
  };
}

const args = parseArgs(process.argv.slice(2));
const sourcePath = path.resolve(requireValue(args.source, "--source"));
const outputPath = path.resolve(requireValue(args.output, "--output"));
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

if (source.schemaVersion !== "lexus-past-exam-answer-source.v1") {
  throw new Error("Unsupported answer source schemaVersion");
}
if (source.source?.contentProvenance !== "original_editorial") {
  throw new Error("Answer pages must use original_editorial provenance");
}
if (source.source?.restrictedSourceCopied !== false) {
  throw new Error("restrictedSourceCopied must be false");
}
if (!Array.isArray(source.document?.majorQuestions) || source.document.majorQuestions.length === 0) {
  throw new Error("document.majorQuestions must not be empty");
}

const seenIds = new Set();
const majorQuestions = source.document.majorQuestions.map((major, index) => {
  const rendered = renderMajor(major, index);
  if (seenIds.has(rendered.id)) throw new Error(`Duplicate major-question id ${rendered.id}`);
  seenIds.add(rendered.id);
  return rendered;
});

const output = {
  schemaVersion: "lexus-past-exam-answer-page.v1",
  packageId: requireValue(source.packageId, "packageId"),
  route: source.route,
  university: source.university,
  exam: source.exam,
  subject: source.subject,
  document: {
    role: "answers",
    pageUnit: "major_question",
    majorQuestions,
  },
  source: source.source,
  links: source.links,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Built ${majorQuestions.length} answer sections: ${path.relative(process.cwd(), outputPath)}`);
