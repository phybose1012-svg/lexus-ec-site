/**
 * Penrose 3.3 does not render arrowheads for Polyline. Keep the editable Style
 * untouched and convert only arrowed Polyline blocks in the compile-time copy.
 */
export declare function compilePolylineArrowsInStyle(style: string): string;
