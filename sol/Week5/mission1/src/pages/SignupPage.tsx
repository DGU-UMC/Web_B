import z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ResponseSignupDto } from "../types/auth";
import { postSignup } from "../apis/auth";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 최대 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 최대 20자 이하여야 합니다." }),
    name: z.string().min(1, { message: "이름은 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"], // 에러를 표시할 필드
  });

type FormField = z.infer<typeof schema>;

const SingupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormField>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    const { ...rest } = data;

    const response: ResponseSignupDto = await postSignup(rest);

    console.log(response);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        <input
          {...register("email")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.email ? "border-red-500" : "border-gray-300"}`}
          type={"email"}
          placeholder={"이메일"}
        />
        {errors?.email && (
          <div className="text-red-500 text-sm">{errors.email.message}</div>
        )}

        <input
          {...register("password")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.password ? "border-red-500" : "border-gray-300"}`}
          type={"password"}
          placeholder={"비밀번호"}
        />

        {errors?.password && (
          <div className="text-red-500 text-sm">{errors.password.message}</div>
        )}

        <input
          {...register("passwordCheck")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.passwordCheck ? "border-red-500" : "border-gray-300"}`}
          type={"password"}
          placeholder={"비밀번호 확인"}
        />

        {errors?.passwordCheck && (
          <div className="text-red-500 text-sm">
            {errors.passwordCheck.message}
          </div>
        )}

        <input
          {...register("name")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.name ? "border-red-500" : "border-gray-300"}`}
          type={"name"}
          placeholder={"이름"}
        />
        {errors?.name && (
          <div className="text-red-500 text-sm">{errors.name.message}</div>
        )}

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitted}
          className="w-full bg-[#807bff] text-white font-bold py-2 rounded-sm disabled:bg-[#ccc] hover:bg-[#665fff] "
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default SingupPage;
