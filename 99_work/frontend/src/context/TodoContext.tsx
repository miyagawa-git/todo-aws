// src/context/TodoContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Todo } from "../types/todo";
import { todoApi } from "../api/todoApi";

//状態管理

type TodoContextValue = {
  todos: Todo[];
  loading: boolean;
  reload: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
};

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    setLoading(true);
    //TODO:失敗時のエラーハンドリング追加error state
    try {
      const data = await todoApi.getTodos();
      setTodos(data);
    } finally {
      setLoading(false);
    }
  };

  //TODO:「GET再取得」を消せる（通信効率と体感速度が上がる）。
  // add/delete で reload せずローカル更新にする（or どちらかだけ reload にする）
  //addTodo は返ってきた Todo を setTodos([created, ...prev]) で足せる
  const addTodo = async (title: string) => {
    await todoApi.addTodo(title);
    await reload();
  };

  //deleteTodo は setTodos(prev => prev.filter(t => t.id !== id)) で消せる
  const deleteTodo = async (id: number) => {
    await todoApi.deleteTodo(id);
    await reload();
  };

  useEffect(() => {
    void reload();
  }, []);

  return (
    <TodoContext.Provider value={{ todos, loading, reload, addTodo ,deleteTodo}}>
      {children}
    </TodoContext.Provider>
  );
};
// useTodos() を カスタムフックとして切り出し
export const useTodos = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used within TodoProvider");
  return ctx;
};
