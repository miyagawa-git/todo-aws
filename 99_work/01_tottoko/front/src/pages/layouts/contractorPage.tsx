import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
import type { Contractor } from "../../types/contractor";
import { useSearchParams } from "react-router-dom";
//import type { students } from "../../types/student";

import { useContractor } from "../../services/useContractor";

export const ContractorDetailPage: React.FC = () => {
  const [params] = useSearchParams();
  const contractorId = Number(params.get("contractorId"));
  const operatorId = Number(params.get("operatorId"));

  const { contractor, loading, reload } = useContractor();
  const { control, register, handleSubmit, reset } = useForm<Contractor>({
    defaultValues: {
      lastName: "",
      firstName: "",
      lastNameKana: "",
      firstNameKana: "",
      phone: "",
      birthDate: "",
    },
  });

  // API取得後を想定した正攻法
  useEffect(() => {
    // 数値で取れないなら叩かない（NaN対策）
    if (!Number.isFinite(contractorId) || !Number.isFinite(operatorId)) return;
    void reload(contractorId, operatorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractorId, operatorId]);
  //   if (!contractor) return; // ★ nullガード必須
  //   reset(contractor.contractor);
  // }, [contractor, reset]);
  // ② 取得できたらフォームへ流し込み（※ return より上！）
  useEffect(() => {
    console.log("effect: reset", contractor);
    if (!contractor) return;

    reset({
      lastName: contractor.contractor.lastName ?? "",
      firstName: contractor.contractor.firstName ?? "",
      lastNameKana: contractor.contractor.lastNameKana ?? "",
      firstNameKana: contractor.contractor.firstNameKana ?? "",
      phone: contractor.contractor.phone ?? "",
      birthDate: contractor.contractor.birthDate ?? "",
    });
  }, [contractor, reset]);
  const onSubmit = async (values: Contractor) => {
    console.log("保存:", values);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!contractor) {
    return null;
  }
  console.log("contractor from context:", contractor);
  console.log("contractor.students:", contractor.students);
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">会員情報管理</Typography>

        {/* 親の情報 */}
        <Typography sx={{ mt: 2 }}>親の情報</Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="お名前" fullWidth {...register("lastName")} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="フリガナ"
              fullWidth
              {...register("lastNameKana")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="電話番号" fullWidth {...register("phone")} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <TextField
                  label="生年月日"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...field}
                />
              )}
            />
          </Grid>
        </Grid>

        {/* 子の情報 */}
        <Typography sx={{ mt: 4 }}>お子さまの情報</Typography>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2}>
          {contractor.students.map((student) => (
            <Paper key={student.studentId} variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 3 }}>
                  <b>お名前</b>
                  <br />
                  {student.lastName} {student.firstName}
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <b>フリガナ</b>
                  <br />
                  {student.lastNameKana} {student.firstNameKana}
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <b>電話番号</b>
                  <br />
                  {student.phone}
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <b>生年月日</b>
                  <br />
                  {student.birthDate}
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ textAlign: "right" }}>
                  <Button size="small" variant="contained" sx={{ mr: 1 }}>
                    編集
                  </Button>
                  <Button size="small" color="error" variant="contained">
                    削除
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>

        <Button sx={{ mt: 2 }}>＋ 子どもを追加</Button>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
          <Button color="error" variant="contained">
            退会
          </Button>

          <Button
            color="success"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            保存
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};
