import { database, storage, ID } from "@/appwrite";
import { getTodosGroupedByColumns, uploadImage } from "@/lib";
import { create } from "zustand";

interface BoardState {
  board: Board;
  searchString: string;
  newTaskInput: string;
  newTaskType: TypeColumn;
  image: File | null;
  getBoard: () => void;
  addTask: (todo: string, columnId: TypeColumn, image: File | null) => void;
  setBoard: (board: Board) => void;
  setNewTaskInput: (newTaskInput: string) => void;
  setSearchString: (input: string) => void;
  setImage: (image: File | null) => void;
  setTaskType: (type: TypeColumn) => void;
  updateDb: (todo: Todo, columnId: TypeColumn) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypeColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypeColumn, Column>(),
  },
  searchString: "",
  newTaskInput: "",
  newTaskType: "todo",
  image: null,

  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },

  addTask: async (todo: string, columnId: TypeColumn, image: File | null) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    const { $id } = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      },
    );
    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };
      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

  setBoard: (board) => set({ board }),
  setNewTaskInput: (input: string) => {
    set({ newTaskInput: input });
  },
  setSearchString: (searchString) => set({ searchString }),
  setTaskType: (type: TypeColumn) => set({ newTaskType: type }),
  setImage: (image: File | null) => set({ image }),

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
  deleteTask: async (taskIndex: number, todo: Todo, id: TypeColumn) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
    );
  },
}));
