// src/api/todoApi.ts
import { apiClient } from "./client";
import type { ContractorDetailDto } from "../types/ContractorDetailDto";
type APIResponse<T> = { statuscode: number; data: T };

export const contractorApi = {
  getContractor: async (
    contractorId: number,
    operatorId: number
  ): Promise<ContractorDetailDto> => {
    const res = await apiClient.get<APIResponse<ContractorDetailDto>>(
      "/contractor",
      {
        params: { contractorId, operatorId },
      }
    );
    return res.data.data; // ★ data の中身だけ返す
  },
  // addTodo: async (input: AddTodoInput): Promise<Todo> => {
  //   console.log("call POST /api/todos", input.title); // ★ログ
  //   const res = await apiClient.post<Todo>("/todos", input);
  //   return res.data;
  // },
  // // バックエンドが 204 No Content を返す想定なので res.data は無し
  //   deleteTodo: async (id: number): Promise<void> => {
  //   console.log("call POST /api/todos", id); // ★ログ
  //   await apiClient.delete(`/todos/${id}`);
  // },
};
