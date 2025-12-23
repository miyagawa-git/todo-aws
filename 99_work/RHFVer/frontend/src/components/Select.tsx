import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
} from "@mui/material";

type FormState = {
  prefecture: string;
  city: string;
  category: string;
};

export const MultiSelects = () => {
  const [form, setForm] = useState<FormState>({
    prefecture: "",
    city: "",
    category: "",
  });

  const handleChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target; // ★ name がキーになる
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ display: "grid", gap: 2, width: 320 }}>
      <FormControl fullWidth>
        <InputLabel id="pref-label">都道府県</InputLabel>
        <Select
          labelId="pref-label"
          label="都道府県"
          name="prefecture"
          value={form.prefecture}
          onChange={handleChange}
        >
          <MenuItem value=""><em>未選択</em></MenuItem>
          <MenuItem value="tokyo">東京</MenuItem>
          <MenuItem value="osaka">大阪</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="city-label">市区町村</InputLabel>
        <Select
          labelId="city-label"
          label="市区町村"
          name="city"
          value={form.city}
          onChange={handleChange}
        >
          <MenuItem value=""><em>未選択</em></MenuItem>
          <MenuItem value="shinjuku">新宿</MenuItem>
          <MenuItem value="umeda">梅田</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="cat-label">カテゴリ</InputLabel>
        <Select
          labelId="cat-label"
          label="カテゴリ"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <MenuItem value=""><em>未選択</em></MenuItem>
          <MenuItem value="a">A</MenuItem>
          <MenuItem value="b">B</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
export default MultiSelects;

// ポイント（ここが事故防止）
// Select に 必ず name を付ける
// value={form.xxx} を 必ず渡す
// onChange={handleChange}（() => handleChange は絶対NG）
// 方式B：handleChange("prefecture") のようにキーを渡す（型が強い）
// name を信じたくない/独自コンポで name が落ちる場合に強いです。
// const handleChange =
//   (key: keyof FormState) => (e: SelectChangeEvent) => {
//     setForm((prev) => ({ ...prev, [key]: e.target.value }));
//   };
// // 使う側
// <Select value={form.prefecture} onChange={handleChange("prefecture")} />
// <Select value={form.city} onChange={handleChange("city")} />
// <Select value={form.category} onChange={handleChange("category")} />