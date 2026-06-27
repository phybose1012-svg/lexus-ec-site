import fs from "node:fs";
import path from "node:path";

const workspace = path.resolve(process.cwd(), "..");
const reportDir = path.join(workspace, "reports");
const auditPath = path.join(reportDir, "mobile-linebreak-audit.json");
const priorityJsonPath = path.join(reportDir, "mobile-linebreak-priority.json");
const priorityMdPath = path.join(reportDir, "mobile-linebreak-priority.md");

const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));

const textIssuePattern =
  /heading-too-many-lines|single-char-line|orphan-particle|bad-line-start|bad-line-end|control-too-many-lines|tiny-last-line/;
const tableSelectorPattern = /^(table|thead|tbody|tfoot|tr|td|th)\b/i;
const chromeSelectorPattern = /(toc|breadcrumb|desktop-nav|mobile-nav|site-header)/i;

function isPriorityTextIssue(element) {
  const selector = element.selector || "";
  const issues = element.issues || [];
  const hasPriorityIssue = issues.some((issue) => textIssuePattern.test(issue));
  if (!hasPriorityIssue) return false;

  return (
    /^h[1-6]\b/i.test(selector) ||
    /button|\.button|nav a|home-hero|article-hero|section-heading|fixed-page/i.test(selector)
  );
}

function isPriorityOverflow(element) {
  const selector = element.selector || "";
  if (tableSelectorPattern.test(selector)) return false;
  if (chromeSelectorPattern.test(selector)) return false;
  const rightOverflow = Number(element.rightOverflow || 0);
  const leftOverflow = Number(element.leftOverflow || 0);
  return rightOverflow > 2 || leftOverflow > 2;
}

function pageKind(route) {
  if (route === "/") return "home";
  if (/^\/(?:access|teacher|medical-english-training|books|voice|company|contact|privacy)/.test(route)) {
    return "fixed-page";
  }
  if (/^\/\d{4}-/.test(route)) return "post";
  if (/interview|合格/.test(route)) return "voice-interview";
  return "other";
}

function severityOf(pageOverflow, textIssues, overflows) {
  if (pageOverflow) return "P0";
  if (overflows.some((item) => Math.max(item.rightOverflow || 0, item.leftOverflow || 0) >= 120)) return "P1";
  if (textIssues.some((item) => item.issues.some((issue) => /heading-too-many-lines|control-too-many-lines/.test(issue)))) {
    return "P1";
  }
  if (textIssues.length || overflows.length) return "P2";
  return "P3";
}

const priorityPages = [];

for (const page of audit.results || []) {
  const textIssues = (page.elementIssues || [])
    .filter(isPriorityTextIssue)
    .map((element) => ({
      selector: element.selector,
      text: element.text,
      issues: element.issues.filter((issue) => textIssuePattern.test(issue)),
      lines: element.lines,
    }));

  const overflows = (page.overflowElements || []).filter(isPriorityOverflow);
  if (!page.pageOverflow && textIssues.length === 0 && overflows.length === 0) continue;

  const severity = severityOf(page.pageOverflow, textIssues, overflows);
  priorityPages.push({
    route: page.route,
    title: page.title,
    kind: pageKind(page.route),
    severity,
    pageOverflow: page.pageOverflow,
    textIssueCount: textIssues.length,
    overflowCount: overflows.length,
    firstTextIssue: textIssues[0] || null,
    firstOverflow: overflows[0] || null,
    textIssues,
    overflows,
  });
}

priorityPages.sort((a, b) => {
  const severityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
  const bySeverity = severityOrder[a.severity] - severityOrder[b.severity];
  if (bySeverity) return bySeverity;
  return b.textIssueCount + b.overflowCount - (a.textIssueCount + a.overflowCount);
});

const summary = priorityPages.reduce(
  (acc, page) => {
    acc.bySeverity[page.severity] = (acc.bySeverity[page.severity] || 0) + 1;
    acc.byKind[page.kind] = (acc.byKind[page.kind] || 0) + 1;
    return acc;
  },
  { bySeverity: {}, byKind: {} },
);

const report = {
  auditedAt: audit.auditedAt,
  generatedAt: new Date().toISOString(),
  viewport: audit.viewport,
  pages: audit.pages,
  priorityPages: priorityPages.length,
  summary,
  pagesByPriority: priorityPages,
};

fs.writeFileSync(priorityJsonPath, JSON.stringify(report, null, 2));

const escapeCell = (value = "") => String(value).replace(/\|/g, " / ").replace(/\n/g, " ");
const firstIssueText = (page) => {
  if (page.pageOverflow) return "ページ全体の横はみ出し";
  if (page.firstTextIssue) {
    const issue = page.firstTextIssue.issues[0] || "text-wrap";
    return `${issue}: ${page.firstTextIssue.text}`;
  }
  if (page.firstOverflow) {
    return `overflow ${Math.max(page.firstOverflow.rightOverflow || 0, page.firstOverflow.leftOverflow || 0)}px: ${
      page.firstOverflow.text
    }`;
  }
  return "";
};

const md = [
  "# Mobile Line Break Priority Report",
  "",
  `Audited: ${report.auditedAt}`,
  `Generated: ${report.generatedAt}`,
  "",
  `- Pages: ${report.pages}`,
  `- Priority pages: ${report.priorityPages}`,
  `- P0: ${summary.bySeverity.P0 || 0}`,
  `- P1: ${summary.bySeverity.P1 || 0}`,
  `- P2: ${summary.bySeverity.P2 || 0}`,
  "",
  "## Priority List",
  "",
  "| Priority | Kind | Route | Text issues | Overflow | First issue |",
  "| --- | --- | --- | ---: | ---: | --- |",
  ...priorityPages
    .slice(0, 220)
    .map(
      (page) =>
        `| ${page.severity} | ${page.kind} | ${page.route} | ${page.textIssueCount} | ${page.overflowCount} | ${escapeCell(
          firstIssueText(page).slice(0, 180),
        )} |`,
    ),
  "",
  "## Notes",
  "",
  "- Table cell overflow is excluded here because many generated article tables are intentionally horizontally scrollable on mobile.",
  "- The full raw audit remains in `reports/mobile-linebreak-audit.json`.",
  "",
].join("\n");

fs.writeFileSync(priorityMdPath, md);

console.log(
  JSON.stringify(
    {
      pages: report.pages,
      priorityPages: report.priorityPages,
      bySeverity: summary.bySeverity,
      byKind: summary.byKind,
      jsonPath: priorityJsonPath,
      mdPath: priorityMdPath,
    },
    null,
    2,
  ),
);
