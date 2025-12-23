import { Request,Response, NextFunction } from "express";
import { todoService } from "../service/todoService";

export const getTodos = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const todos = await todoService.getTodos();
        res.json(todos);
    }catch (err){
        next(err);
    }
};

export const postTodo = async (req:Request, res:Response, next:NextFunction) => {
    try{
         console.log("POST /api/todos body:", req.body); // ★ログ
const { title, done } = req.body as { title?: string; done?: boolean };
const created = await todoService.addTodo(req.body);

        res.status(201).json(created);        
    }catch (err){    
    next(err);
    }
};
export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("DELETE /api/todos params:", req.params); // ★ログ

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id parameter" });
    }

    const deleted = await todoService.deleteTodo(id);

    // 削除件数が 0 のときは NotFound を返す
    if (deleted === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // 204: No Content（削除成功）
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

