// src/pages/TodoListPage.tsx
import { useState ,useRef,useEffect} from "react";
import type { FormEvent } from "react";

import { useTodos } from "../context/TodoContext";
import { TodoItem } from "../components/TodoItem";
import {
  Box,
  Button,
  Container,
  List,
  TextField,
  Typography,
} from "@mui/material";
//import { useForm } from "react-hook-form";
import ClassCompo from "../components/ClassCompo";
import Oya
 from "../components/Oya";

import RHF from "../components/RHF";

export const TodoListPage: React.FC = () => {
  const { todos, loading, addTodo } = useTodos();
  const [title, setTitle] = useState("");
  useEffect(() => {
    console.log('hello useEffect')
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit called", title); // ★ここ追加
    if (!title.trim()) return;
    await addTodo(title.trim());
    setTitle("");
  };

  //非制御
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    alert(inputRef.current?.value);
  };

  //ReactHookForm


  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        Todo List
      </Typography>
クラスコンポーネント
      <ClassCompo></ClassCompo><br/>
      <Oya></Oya><br/>
      <RHF></RHF>

      非制御
      <input ref={inputRef} />
      <button onClick={handleClick}>表示</button>
    
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1, mb: 2 }}>
        制御
        <TextField
          fullWidth
          size="small"
          label="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" variant="contained">
          追加
        </Button>
      </Box>

      {loading && <Typography>Loading...</Typography>}

      <List>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </List>
    </Container>
  );
};
