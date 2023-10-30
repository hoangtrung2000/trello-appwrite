import { database } from "@/appwrite";
import { getTodosGroupedByColumns } from "@/lib";
import { create } from "zustand";

interface BoardState {
  board: Board;
  searchString: string;
  getBoard: () => void;
  setBoard: (board: Board) => void;
  setSearchString: (searchString: string) => void;
  updateDb: (todo: Todo, columnId: TypeColumn) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypeColumn, Column>(),
  },
  searchString: "",

  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },

  setBoard: (board) => set({ board }),
  setSearchString: (searchString) => set({ searchString }),

  updateDb: async (todo, columnId) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      },
    );
  },
}));
