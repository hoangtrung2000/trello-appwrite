import { getTodosGroupedByColumns } from "@/lib";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypeColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },
}));
