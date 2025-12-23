// src/pages/TodoListPage.tsx
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { useTodos } from "../context/TodoContext";
import { TodoItem } from "../components/TodoItem";

import {
  Box,
  Button,
  Container,
  List,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";

type TodoFormValues = {
  title: string;
  done: boolean;
};

// location.state の型（必要に応じてあなたの実データに寄せて変更してOK）
type LocationState = {
  titleFromRoute?: string;
  doneFromRoute?: boolean;
};

export const TodoRHFPage: React.FC = () => {
  const { todos, loading, addTodo } = useTodos();

  // useLocation で「2項目」を受け取る
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  // 2項目を useMemo で「1つの初期値」にまとめる
  const defaultValues: TodoFormValues = useMemo(
    () => ({
      title: state.titleFromRoute ?? "",
      done: state.doneFromRoute ?? false,
    }),
    [state.titleFromRoute, state.doneFromRoute]
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<TodoFormValues>({
    mode: "onSubmit",
    defaultValues,
  });

  const onSubmit = async (values: TodoFormValues) => {
    // 既存 addTodo で登録（title + done）
    // 空チェックはここでやる（UI側に寄せるなら required でもOK）
    if (!values.title.trim()) return;

    await addTodo(values);
    //     await addTodo({
    //   title: values.title.trim(),
    //   done: values.done,
    // });

    // 送信後リセット（done は false に戻す例）
    reset({ title: "", done: false });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        Todo List
      </Typography>

      {/* RHF + MUI: form */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}
      >
        <TextField
          fullWidth
          size="small"
          label="Todo title"
          {...register("title")}
        />

        {/* boolean は Controller 経由で Switch を繋ぐのが安全 */}
        <Controller
          name="done"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="done"
              control={
                <Switch
                  checked={field.value}
                  onChange={(_, checked) => field.onChange(checked)}
                />
              }
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
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
