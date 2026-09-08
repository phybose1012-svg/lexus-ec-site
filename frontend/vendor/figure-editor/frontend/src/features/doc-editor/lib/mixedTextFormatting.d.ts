export interface ToolbarFontSizeValue {
    points: string;
    raw: string;
    label: string;
}
export declare function displayPositiveNumber(value: number, fallback: number): string;
export declare function numericAttributeValue(value: unknown): string;
export declare function sameNumericValue(left: string, right: string): boolean;
export declare function canonicalNumericSelectValue(current: string, inherited: string, options: readonly string[]): string;
export declare function toolbarFontSizeValue(value: unknown): ToolbarFontSizeValue;
