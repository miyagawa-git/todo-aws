// src/types/todo.ts
export type Todo = {
  id: number;
  title: string;
  done: boolean;
};
export type AddTodoInput = {
  title: string;
  done: boolean;
};