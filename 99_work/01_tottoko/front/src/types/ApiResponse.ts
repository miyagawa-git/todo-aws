//<T>この型は、あとから“中身の型”を差し込める型テンプレート
export type APIResponse<T> = {
  statuscode: number;
  data: T | null;
};
