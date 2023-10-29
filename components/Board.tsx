"use client";
import useBoard from "@/hooks/useBoard";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
const Board = () => {
  const { board, handleDragEnd } = useBoard();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3"
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
