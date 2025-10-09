import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { postSignup } from "../apis/auth";
import { useState } from "react";

const schema = z
  .object({
    // email: z.string().email({ message: "올바른 형식이 아닙니다." }), // z.string().email() deprecated
    email: z.email({ error: "올바른 형식이 아닙니다." }), // message deprecated
    password: z
      .string()
      .min(8, {
        error: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        error: "비밀번호는 20자 이하여야 합니다.",
      }),
    passwordCheck: z
      .string()
      .min(8, {
        error: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        error: "비밀번호는 20자 이하여야 합니다.",
      }),
    name: z.string().min(1, { error: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    error: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

function SignupPage() {
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [isPasswordValidated, setIsPasswordValidated] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema), // 오류 메시지 띄우기
    mode: "onBlur",
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;
    const response = await postSignup(rest);
    console.log(response);
    navigate(`/`);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full gap-4">
      <div className="relative flex flex-col gap-3 justify-center items-center">
        <span
          onClick={() => navigate(`/`)}
          className="text-2xl font-bold absolute top-3 left-1 cursor-pointer"
        >
          {"<"}
        </span>
        <span className="text-xl font-bold p-4 text-center">회원가입</span>
        {!isEmailValidated && (
          <>
            <input
              {...register("email")}
              className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
              type="email"
              placeholder="이메일"
            />
            {errors?.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
            <button
              type="button"
              onClick={async () => {
                if (await trigger("email")) {
                  setIsEmailValidated((prev) => !prev);
                  setInputEmail(watch("email"));
                }
              }}
              disabled={isSubmitting || !!errors.email || watch("email") === ""}
              className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </>
        )}

        {isEmailValidated && !isPasswordValidated && (
          <>
            <span className="text-base font-normal">✉️ {inputEmail}</span>
            <input
              {...register("password")}
              className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${
              errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"
            }`}
              type="password"
              placeholder="비밀번호"
            />
            {errors?.password && (
              <div className="text-red-500 text-sm">
                {errors.password.message}
              </div>
            )}
            <input
              {...register("passwordCheck")}
              className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${
              errors?.passwordCheck
                ? "border-red-500 bg-red-200"
                : "border-gray-300"
            }`}
              type="password"
              placeholder="비밀번호"
            />
            {errors?.passwordCheck && (
              <div className="text-red-500 text-sm">
                {errors.passwordCheck.message}
              </div>
            )}
            <button
              type="button"
              onClick={async () => {
                if (await trigger(["password", "passwordCheck"])) {
                  setIsPasswordValidated((prev) => !prev);
                }
              }}
              disabled={
                isSubmitting ||
                !!errors.password ||
                !!errors.passwordCheck ||
                watch("password") === "" ||
                watch("passwordCheck") === ""
              }
              className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </>
        )}
        {isEmailValidated && isPasswordValidated && (
          <>
            <div className="m-4 w-[150px] h-[150px] rounded-[50%] bg-gray-500 "></div>
            <input
              {...register("name")}
              className={`border border-gray-200 w-[300px] p-3 focus:border-blue-300 rounded-sm
            ${errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"}`}
              type="name"
              placeholder="이름"
            />
            {errors?.name && (
              <div className="text-red-500 text-sm">{errors.name.message}</div>
            )}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !!errors.name || watch("name") === ""}
              className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SignupPage;
