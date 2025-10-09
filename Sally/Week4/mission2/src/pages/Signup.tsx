import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { postSignup } from "../apis/auth";
import { useState } from "react";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    passwordCheck: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const Signup = () => {
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [isPasswordValidated, setIsPasswordValidated] = useState(false);
  const navigate = useNavigate();

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
    resolver: zodResolver(schema), //오류 메시지
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordCheck, ...rest } = data;
    try {
      const response = await postSignup(rest);
      console.log(response);
      alert("회원가입이 완료되었습니다!");
      navigate("/");
    } catch {
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="pt-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-md gap-3 flex flex-col relative">
        <div
          onClick={() => navigate(`/`)}
          className="text-2xl top-4 left-4 absolute cursor-pointer"
        >
          {"<"}
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">회원가입</h2>{" "}
        {!isEmailValidated && (
          <>
            <input
              {...register("email")}
              className={`border w-full px-3 py-2 focus:border-gray-500 rounded-sm ${
                errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"
              }`}
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
              className={`border w-full px-3 py-2 focus:border-gray-500 rounded-sm ${
                errors?.password
                  ? "border-red-500 bg-red-200"
                  : "border-gray-300"
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
              className={`border w-full px-3 py-2 focus:border-gray-500 rounded-sm ${
                errors?.passwordCheck
                  ? "border-red-500 bg-red-200"
                  : "border-gray-300"
              }`}
              type="password"
              placeholder="비밀번호 확인"
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-xl font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              다음
            </button>
          </>
        )}
        {isEmailValidated && isPasswordValidated && (
          <>
            <div className="m-4 w-[150px] h-[150px] rounded-[50%] bg-gray-500 self-center"></div>
            <input
              {...register("name")}
              className={`border w-full px-3 py-2 focus:border-gray-500 rounded-sm ${
                errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"
              }`}
              type="text"
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
};

export default Signup;
