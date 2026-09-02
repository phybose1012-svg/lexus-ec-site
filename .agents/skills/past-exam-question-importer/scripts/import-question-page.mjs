#!/usr/bin/env node

import { access, cp, copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || value === undefined) {
      throw new Error(`Invalid argument near ${key ?? "<end>"}`);
    }
    values[key.slice(2)] = value;
  }
  return values;
}

function requireArguments(values, names) {
  const missing = names.filter((name) => !values[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required arguments: ${missing.map((name) => `--${name}`).join(", ")}`);
  }
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function extractElement(html, attributeName, sourceName) {
  const openingPattern = new RegExp(`<([a-z][a-z0-9-]*)\\b(?=[^>]*\\b${attributeName}\\b)[^>]*>`, "i");
  const opening = openingPattern.exec(html);
  if (!opening) {
    throw new Error(`${sourceName}: element with ${attributeName} was not found`);
  }

  const closingTag = `</${opening[1]}>`;
  const closingIndex = html.indexOf(closingTag, opening.index + opening[0].length);
  if (closingIndex < 0) {
    throw new Error(`${sourceName}: closing tag for ${attributeName} was not found`);
  }

  return html.slice(opening.index, closingIndex + closingTag.length);
}

function extractReconstruction(html, sourceName) {
  const match = html.match(/<script\b[^>]*\bid=["']source-reconstruction["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match) {
    throw new Error(`${sourceName}: #source-reconstruction JSON was not found`);
  }

  try {
    return JSON.parse(match[1]);
  } catch (error) {
    throw new Error(`${sourceName}: invalid reconstruction JSON (${error.message})`);
  }
}

function assertSafeFragment(fragment, sourceName) {
  const unsafePatterns = [
    /<(script|iframe|object|embed|form|input|textarea|button)\b/i,
    /\son[a-z]+\s*=/i,
    /javascript\s*:/i,
    /\bsrcset\s*=/i,
    /[A-Za-z]:\\/,
  ];
  const unsafe = unsafePatterns.find((pattern) => pattern.test(fragment));
  if (unsafe) {
    throw new Error(`${sourceName}: unsafe or unsupported markup matched ${unsafe}`);
  }
}

function removeInternalSourceNotes(fragment) {
  return fragment.replace(/\s*·\s*参照:\s*[^<]*/g, "");
}

async function rewriteAndCopyAssets(fragment, sourceDir, publicRoot, packageId, sourceName) {
  const matches = [...fragment.matchAll(/\bsrc=(['"])([^'"]+)\1/gi)];
  let result = fragment;

  for (const match of matches) {
    const originalUrl = match[2];
    if (/^(?:data:|https?:|\/)/i.test(originalUrl)) {
      throw new Error(`${sourceName}: external or absolute asset URL is unsupported (${originalUrl})`);
    }

    const sourceAsset = path.resolve(sourceDir, originalUrl);
    const sourceRoot = path.resolve(sourceDir) + path.sep;
    if (!sourceAsset.startsWith(sourceRoot)) {
      throw new Error(`${sourceName}: asset escapes the source directory (${originalUrl})`);
    }
    await access(sourceAsset);

    const relativeAsset = path.relative(sourceDir, sourceAsset);
    const destination = path.join(publicRoot, "assets", "past-exams", packageId, relativeAsset);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(sourceAsset, destination);

    const publicUrl = `/assets/past-exams/${packageId}/${toPosix(relativeAsset)}`;
    result = result.replaceAll(originalUrl, publicUrl);
  }

  return result;
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  requireArguments(args, [
    "source-dir",
    "output",
    "public-root",
    "university-id",
    "university-name",
    "year",
    "subject-id",
    "subject-name",
    "subject-english",
    "exam-label",
    "stage-label",
    "duration-label",
    "source-reference",
  ]);

  const sourceDir = path.resolve(args["source-dir"]);
  const outputPath = path.resolve(args.output);
  const publicRoot = path.resolve(args["public-root"]);
  const indexPath = path.join(sourceDir, "index.html");
  const indexHtml = await readFile(indexPath, "utf8");
  const indexReconstruction = extractReconstruction(indexHtml, "index.html");
  const packageId = indexReconstruction.package_id;
  if (!packageId) {
    throw new Error("index.html: reconstruction package_id is missing");
  }

  const sourceBuildKind = indexHtml.match(/\bdata-build-kind=["']([^"']+)["']/i)?.[1] ?? "unknown";
  const publicationCandidate = /\bdata-publication-candidate\b/i.test(indexHtml);
  const sharedSource = extractElement(indexHtml, "data-question-shared-instructions", "index.html");
  assertSafeFragment(sharedSource, "index.html shared instructions");
  const sharedInstructionsHtml = await rewriteAndCopyAssets(
    removeInternalSourceNotes(sharedSource),
    sourceDir,
    publicRoot,
    packageId,
    "index.html shared instructions",
  );

  const questionFiles = (await readdir(sourceDir))
    .filter((name) => /^major-question-\d+\.html$/i.test(name))
    .sort((left, right) => left.localeCompare(right, "en", { numeric: true }));
  if (questionFiles.length === 0) {
    throw new Error("No major-question-*.html files were found");
  }

  const questions = [];
  let needsHumanReview = Boolean(indexReconstruction.review?.needs_human_review);
  for (const filename of questionFiles) {
    const html = await readFile(path.join(sourceDir, filename), "utf8");
    const reconstruction = extractReconstruction(html, filename);
    if (reconstruction.package_id !== packageId) {
      throw new Error(`${filename}: package_id does not match ${packageId}`);
    }

    const pageRecord = reconstruction.document?.pages?.[0];
    if (!pageRecord?.major_question_id || !pageRecord?.label) {
      throw new Error(`${filename}: major-question reconstruction metadata is incomplete`);
    }
    needsHumanReview ||= Boolean(reconstruction.review?.needs_human_review);

    const sourceFragment = extractElement(html, "data-major-question-id", filename);
    assertSafeFragment(sourceFragment, filename);
    const questionHtml = await rewriteAndCopyAssets(
      removeInternalSourceNotes(sourceFragment),
      sourceDir,
      publicRoot,
      packageId,
      filename,
    );
    questions.push({
      id: pageRecord.major_question_id,
      label: pageRecord.label,
      order: Number(pageRecord.order),
      sourcePageIds: pageRecord.source_page_ids ?? [],
      html: questionHtml,
    });
  }

  questions.sort((left, right) => left.order - right.order);

  const katexSource = path.join(sourceDir, "assets", "katex");
  const katexDestination = path.join(publicRoot, "assets", "vendor", "katex");
  await access(katexSource);
  await mkdir(path.dirname(katexDestination), { recursive: true });
  await cp(katexSource, katexDestination, { recursive: true, force: true });

  const routePath = `/past-exam-library/${args["university-id"]}/${args.year}/${args["subject-id"]}/questions/`;
  const output = {
    schemaVersion: "lexus-ec.past-exam-question-page.v1",
    packageId,
    route: {
      university: args["university-id"],
      year: args.year,
      subject: args["subject-id"],
      path: routePath,
    },
    university: {
      id: args["university-id"],
      name: args["university-name"],
    },
    exam: {
      year: args.year,
      label: args["exam-label"],
      stage: args["stage-label"],
      duration: args["duration-label"],
    },
    subject: {
      id: args["subject-id"],
      name: args["subject-name"],
      english: args["subject-english"],
    },
    document: {
      role: "questions",
      pageUnit: indexReconstruction.document?.page_unit ?? "major_question",
      sharedInstructionsHtml,
      questions,
    },
    source: {
      reference: toPosix(args["source-reference"]),
      buildKind: sourceBuildKind,
      contentProvenance: indexReconstruction.content_provenance ?? "unknown",
      publicationCandidate,
      rightsStatus: args["rights-status"] ?? "review_required",
      needsHumanReview,
    },
    links: {
      universityLibrary: `/past-exam-library/${args["university-id"]}/`,
      analysis: args["analysis-path"] ?? null,
      universityInformation: args["university-information-path"] ?? null,
    },
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stdout.write(
    `${JSON.stringify({ output: outputPath, packageId, questionCount: questions.length, rightsStatus: output.source.rightsStatus })}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exitCode = 1;
});
