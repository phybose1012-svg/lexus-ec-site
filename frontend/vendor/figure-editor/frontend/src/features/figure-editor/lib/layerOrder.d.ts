export type LayerOrderCommand = "bringForward" | "bringToFront" | "sendBackward" | "sendToBack";
/**
 * SVG の実在パスを、保存済みの背面→前面順へ統合する。
 * 保存順にまだ存在しないパスは新規オブジェクトなので、現在の相対順を保ったまま
 * 末尾（最前面）へ追加する。
 */
export declare function reconcileLayerOrder(renderedPaths: readonly string[], savedOrder: readonly string[]): string[];
/**
 * 新規パス（領域塗りつぶし）を「anchors のうち最も背面にあるものの 1 つ後ろ」へ
 * 登録した順序を返す。境界の線・ラベルは塗りの上に残り、背景画像など anchors より
 * 背面のオブジェクトは塗りの後ろに留まる（不透明な背景の裏に塗りを沈めない）。
 * anchors が 1 つも order に無ければ末尾へ足す。未登録パスは末尾=最前面と
 * 解釈されるため（reconcileLayerOrder）、それらよりは背面に収まる。
 */
export declare function insertBehindAnchors(order: readonly string[], newPath: string, anchorPaths: readonly string[]): string[];
/**
 * 新規パス（挿入画像）を最背面として登録した順序を返す。描画順は substance の
 * 宣言順（追加した順）に従うため、layerOrder に載せない限り新規シェイプは
 * 最前面に出てしまう。先頭 1 件を登録すれば、残りは描画順のまま後ろへ補完される。
 */
export declare function insertAtBack(order: readonly string[], newPath: string): string[];
/**
 * 選択中レイヤーを背面→前面配列の中で移動する。
 * 複数選択では相対順を維持し、1段移動は各選択要素が隣接する未選択要素を
 * 1つだけ追い越す。
 */
export declare function moveSelectedLayers(order: readonly string[], selectedPaths: readonly string[], command: LayerOrderCommand): string[];
