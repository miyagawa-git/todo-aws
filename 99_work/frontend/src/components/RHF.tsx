import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
};

const RHF= () => {
    // const{ register,handleSubmit} = useForm<FormValues>();
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormValues>();

    const onSubmit = (data:FormValues) =>{
        console.log("RHF:",data);
    };

    return(
// ラップした関数を渡す
        <form onSubmit={handleSubmit(onSubmit)}>
        {/* 「この input の変更を全部 react-hook-form に通知する」
        DOMに任せる（useRef管理） 
        nameはフォームデータのキー。onSubmit(data)の data.name に対応*/}
        {/* <input{...register("name")}/> */}
        <input {...register("name", { required: true })} />
        {errors.name && <p>名前は必須です</p>}

        <button type="submit" >RHF</button>

        </form>
    )
}
export default RHF;