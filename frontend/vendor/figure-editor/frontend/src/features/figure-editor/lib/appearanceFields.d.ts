export declare const SHARED_EDITABLE_FIELDS: readonly ["fillColor", "strokeColor", "strokeWidth", "strokeDasharray", "fontSize", "r", "width", "height", "cornerRadius", "rx", "ry", "rotation", "scale", "startArrowhead", "startArrowheadSize", "endArrowhead", "endArrowheadSize", "flipStartArrowhead"];
export declare function withEditablePolygonColorFields(body: string, shapeType: string): string;
/**
 * 生成元が既定値を省略していても、ユーザーが見た目を編集できる body を返す。
 * 表示用の補完であり、実データにはユーザーが値を変更した時だけ追加される。
 */
export declare function withEditableAppearanceFields(body: string, shapeType: string): string;
