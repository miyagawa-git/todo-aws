import { Todo, TodoCreationAttributes} from "../entity/Todo";

export const todoRepository = {
    findAll: () => {
        return Todo.findAll({ order:[["id", "DESC"]]});
    },
    create: ( data: TodoCreationAttributes) => {
        return Todo.create(data);
    },
};