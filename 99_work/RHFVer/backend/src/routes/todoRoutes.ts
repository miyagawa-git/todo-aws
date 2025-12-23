// src/routes/todoRoutes.ts
import { Router } from "express";
import { getTodos, postTodo ,deleteTodo} from "../controller/todoController";

export const todoRouter = Router();

todoRouter.get("/", getTodos);
todoRouter.post("/", postTodo);
todoRouter.delete("/:id", deleteTodo);
