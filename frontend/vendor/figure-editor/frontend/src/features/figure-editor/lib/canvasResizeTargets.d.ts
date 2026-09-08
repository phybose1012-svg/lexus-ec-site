export interface CanvasResizePathPlan {
    /**
     * Only visible owners contribute to the fitted content bounds. A temporarily
     * hidden construction/helper must not unexpectedly change the framing chosen
     * from what the user can currently see.
     */
    boundsPaths: string[];
    /**
     * Every object receives the transform derived from those bounds. Otherwise a
     * hidden object would reappear at its old position, size and stroke width.
     */
    transformPaths: string[];
}
/**
 * Separate "what determines the fit" from "what receives the fit".
 *
 * Hidden SVG owners have no stable client rect, so bounds remain based on the
 * visible subset. The resulting transform is nevertheless a canvas-wide edit
 * and must be committed to every object, including hidden ones.
 */
export declare function canvasResizePathPlan(paths: readonly string[], hiddenPaths: ReadonlySet<string>): CanvasResizePathPlan;
