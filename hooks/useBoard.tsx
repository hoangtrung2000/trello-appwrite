import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DropResult } from "react-beautiful-dnd";

type useBoardResult = {
  board: Board;
  handleDragEnd: (result: DropResult) => void;
};

const useBoard = (): useBoardResult => {
  const [board, getBoard, setBoard, updateDb] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoard,
    state.updateDb,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    // Check if user dragged card outside of board
    if (!destination) return;
    // Handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [remove] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, remove);
      const rearrangedColumns = new Map(entries); // copy entries variable but is a map object
      setBoard({ ...board, columns: rearrangedColumns });
    }

    const columns = Array.from(board.columns.entries());

    const startColIndex = columns[Number(source.droppableId)]; //  ex: droppableId: 0 -> [key: "todo", value: object]
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0], // ex: key: "todo"
      todos: startColIndex[1].todos, // ex: value: object
    };
    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);
    // Dragging in the column
    if (startCol.id === finishCol.id) {
      newTodos.splice(destination.index, 0, todoMoved);

      const newCol: Column = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
      setBoard({ ...board, columns: newColumns });
    } else {
      const finishTodos = finishCol.todos;
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, { id: finishCol.id, todos: finishTodos });

      updateDb(todoMoved, finishCol.id);

      setBoard({ ...board, columns: newColumns });
    }
  };

  return { board, handleDragEnd };
};

export default useBoard;
