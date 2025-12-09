// src/components/TodoItem.tsx
import { ListItem, ListItemText } from "@mui/material";
import styled from "@emotion/styled";
import type { Todo } from "../types/todo";

const StyledListItem = styled(ListItem)`
  border-bottom: 1px solid #eee;
`;

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  return (
    <StyledListItem>
      <ListItemText primary={todo.title} secondary={todo.done ? "done" : ""} />
    </StyledListItem>
  );
};
