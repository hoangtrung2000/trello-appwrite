import { ID, storage, database } from "@/appwrite";

export const getTodosGroupedByColumns = async () => {
  const data = await database.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
  );
  const todos = data.documents;

  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });

    return acc;
  }, new Map<TypeColumn, Column>());

  // if columns doesn't have progress, todo and done, add them with empty todos
  const columnTypes: TypeColumn[] = ["todo", "inprogress", "done"];
  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]),
    ),
  );

  const board: Board = {
    columns: sortedColumns,
  };

  return board;
};

export const uploadImage = async (file: File) => {
  if (!file || !process.env.NEXT_PUBLIC_BUCKET_ID) return;
  const fileUploaded = await storage.createFile(
    process.env.NEXT_PUBLIC_BUCKET_ID,
    ID.unique(),
    file,
  );
  return fileUploaded;
};

export const getUrl = async (image: Image) => {
  const url = await storage.getFilePreview(image.bucketId, image.fileId);
  return url;
};
