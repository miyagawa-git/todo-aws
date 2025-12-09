// src/context/TodoContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Todo } from "../types/todo";
import { todoApi } from "../api/todoApi";

type TodoContextValue = {
  todos: Todo[];
  loading: boolean;
  reload: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
};

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await todoApi.getTodos();
      setTodos(data);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string) => {
    await todoApi.addTodo(title);
    await reload();
  };

  useEffect(() => {
    void reload();
  }, []);

  return (
    <TodoContext.Provider value={{ todos, loading, reload, addTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used within TodoProvider");
  return ctx;
};
