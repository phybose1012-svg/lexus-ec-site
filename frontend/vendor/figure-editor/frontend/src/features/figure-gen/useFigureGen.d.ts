import type { FigureGenSession } from "./types";
/** 生成セッションの購読フック（orchestrator は immutable 更新なのでそのまま返せる） */
export declare function useFigureGen(): FigureGenSession | null;
