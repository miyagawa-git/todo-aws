import { todoRepository } from "../repository/todoRepository";
import { Todo } from "../entity/Todo";

export const todoService = {
    getTodos: async () => {
        return await todoRepository.findAll();
    },

    addTodo: async (todo:Todo) =>{
        if(!todo.title || todo.title.length < 1) {
            throw new Error("タイトルは必須です");
        }

        return await todoRepository.create(todo);
    },
    deleteTodo: async (id: number) =>{
        return await todoRepository.deleteById( id );
    },
    
}