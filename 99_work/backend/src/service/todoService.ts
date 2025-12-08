import { todoRepository } from "../repository/todoRepository";

export const todoService = {
    getTodos: async () => {
        return await todoRepository.findAll();
    },

    addTodo: async (title: string) =>{
        if(!title || title.length < 1) {
            throw new Error("タイトルは必須です");
        }

        return await todoRepository.create({ title });
    }
}