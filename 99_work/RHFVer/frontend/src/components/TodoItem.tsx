// src/components/TodoItem.tsx
import { IconButton, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "@emotion/styled";
import type { Todo } from "../types/todo";
import { useTodos } from "../context/TodoContext";

//ここがsrc/components/atoms,blocks相当
//( UI部品 )
const StyledListItem = styled(ListItem)`
  border-bottom: 1px solid #eee;
`;

type Props = {
  todo: Todo;
};

export const TodoItem = ({ todo }: Props) => {
  const { deleteTodo } = useTodos();

  return (
    <StyledListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => void deleteTodo(todo.id)}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemText primary={todo.title} secondary={todo.done ? "done" : ""} />
    </StyledListItem>
  );
};
