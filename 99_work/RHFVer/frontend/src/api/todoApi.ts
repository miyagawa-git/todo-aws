// src/api/todoApi.ts
import { apiClient } from "./client";
import type { Todo,AddTodoInput } from "../types/todo";

export const todoApi = {
  getTodos: async (): Promise<Todo[]> => {
    const res = await apiClient.get<Todo[]>("/todos");
    return res.data;
  },
  addTodo: async (input: AddTodoInput): Promise<Todo> => {
    console.log("call POST /api/todos", input.title); // ★ログ
    const res = await apiClient.post<Todo>("/todos", input);
    return res.data;
  },
  // バックエンドが 204 No Content を返す想定なので res.data は無し
    deleteTodo: async (id: number): Promise<void> => {
    console.log("call POST /api/todos", id); // ★ログ
    await apiClient.delete(`/todos/${id}`);
  },
};
