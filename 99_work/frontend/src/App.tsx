// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TodoProvider } from "./context/TodoContext";
import { TodoListPage } from "./pages/TodoListPage";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TodoProvider>
        <Routes>
          <Route path="/" element={<TodoListPage />} />
        </Routes>
      </TodoProvider>
    </BrowserRouter>
  );
};
