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
        const { title} = req.body as { title?: string};
        const created = await todoService.addTodo(title ?? "");
        res.status(201).json(created);        
    }catch (err){    
    next(err);
    }
}