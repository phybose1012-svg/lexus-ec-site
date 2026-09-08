export { importSvgToPenroseTrio, SvgImportRejection, type SvgImportOptions, type SvgImportResult, type SvgImportStatus, type SvgImportVerification, } from "./importSvg.js";
export { DEFAULT_SVG_IMPORT_LIMITS, type SvgImportLimits, type SvgRejectionKind, } from "./limits.js";
export type { ArrowHeadKind, ClipRect, ImportWarning, ImportedDocument, ImportedGeometry, ImportedMarker, ImportedObject, ImportedStyle, ImportedText, ImportedTextRun, Point, UnsupportedElement, } from "./model.js";
export { parseSvgDocument, type ParseOptions } from "./parse.js";
export { buildTrio, fitCanvas, SVG_IMPORT_VARIATION, type BuildTrioOptions, type BuildTrioResult, type LabelPlacement, type TrioObjectMapping, } from "./toTrio.js";
export { readRenderedLabels, refineLabelPlacement, type CompileTrio, type RefineResult, } from "./refine.js";
export { createCanvasMeasurer } from "./canvasMeasure.js";
export { alignedCenterX, buildLabelLayout, containsJapanese, cssFontOf, estimateText, sanitizeForStyle, type LabelLayout, type LabelPiece, type LabelWarning, type MeasureText, type TextMeasurement, } from "./text.js";
