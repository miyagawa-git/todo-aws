// src/api/todoApi.ts
import { apiClient } from "./client";
import type { Todo } from "../types/todo";

export const todoApi = {
  getTodos: async (): Promise<Todo[]> => {
    const res = await apiClient.get<Todo[]>("/todos");
    return res.data;
  },
  addTodo: async (title: string): Promise<Todo> => {
    console.log("call POST /api/todos", title); // ★ログ
    const res = await apiClient.post<Todo>("/todos", { title });
    return res.data;
  },
};
