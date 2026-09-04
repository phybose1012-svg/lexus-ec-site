import fs from "node:fs";

export const defaultLibraryUrl = new URL("../../../../frontend/src/data/pastExamFormulaPurposes.json", import.meta.url);

export function indexFormulaPurposes(library) {
  if (library?.schemaVersion !== "lexus-formula-purposes.v1" || !Array.isArray(library.purposes)) {
    throw new Error("Invalid formula purpose library");
  }
  const purposes = new Map();
  const labels = new Set();
  for (const purpose of library.purposes) {
    if (!purpose || typeof purpose.id !== "string" || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(purpose.id)) {
      throw new Error("Invalid formula purpose id");
    }
    if (typeof purpose.label !== "string" || !purpose.label.trim() ||
        typeof purpose.useWhen !== "string" || !purpose.useWhen.trim()) {
      throw new Error(`Formula purpose ${purpose.id} needs a label and useWhen`);
    }
    const label = purpose.label.trim().normalize("NFKC");
    if (purposes.has(purpose.id) || labels.has(label)) {
      throw new Error(`Duplicate formula purpose id or label: ${purpose.id}`);
    }
    purposes.set(purpose.id, purpose);
    labels.add(label);
  }
  return purposes;
}

export function loadFormulaPurposes(url = defaultLibraryUrl) {
  return indexFormulaPurposes(JSON.parse(fs.readFileSync(url, "utf8")));
}
