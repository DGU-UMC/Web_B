import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import userImage from "../assets/user.png";

const schema = z
  .object({
    email: z.email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

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
    resolver: zodResolver(schema),
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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="relative flex items-center justify-center py-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 text-3xl text-gray-700 hover:text-gray-900"
          >
            {"<"}
          </button>
          <h2 className="text-3xl font-bold text-center">회원가입</h2>
        </header>

        {!isEmailValidated && (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block py-1 text-xl text-gray-700"
              >
                이메일
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                className={`border w-full px-3 py-2 focus:border-gray-500 rounded-sm ${
                  errors.email ? "border-red-500 bg-red-200" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 pt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={async () => {
                if (await trigger("email")) {
                  setIsEmailValidated(true);
                  setInputEmail(watch("email"));
                }
              }}
              disabled={isSubmitting || !!errors.email || watch("email") === ""}
              className="mt-10 w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-xl font-medium text-white bg-rose-300 hover:bg-rose-400 disabled:bg-gray-300"
            >
              다음
            </button>
          </div>
        )}

        {isEmailValidated && !isPasswordValidated && (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-2 rounded-md bg-rose-50 border border-rose-200">
              <span className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                💌 <span className="text-gray-800">{inputEmail}</span>
              </span>
            </div>

            <div className="mt-4">
              <label
                htmlFor="password"
                className="block py-1 text-xl text-gray-700"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  className={`w-full px-3 py-2 pr-10 border rounded-sm focus:border-gray-500 ${
                    errors.password
                      ? "border-red-500 bg-red-200"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "🙉"}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 pt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="passwordCheck"
                className="block py-1 text-xl text-gray-700"
              >
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  {...register("passwordCheck")}
                  id="passwordCheck"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력하세요"
                  className={`border w-full px-3 py-2 focus:border-gray-500 rounded-sm ${
                    errors.passwordCheck
                      ? "border-red-500 bg-red-200"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordCheck((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswordCheck ? "🙈" : "🙉"}
                </button>
              </div>
              {errors.passwordCheck && (
                <p className="text-sm text-red-500 pt-1">
                  {errors.passwordCheck.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={async () => {
                if (await trigger(["password", "passwordCheck"])) {
                  setIsPasswordValidated(true);
                }
              }}
              disabled={
                isSubmitting ||
                !!errors.password ||
                !!errors.passwordCheck ||
                watch("password") === "" ||
                watch("passwordCheck") === ""
              }
              className="mt-10 w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-xl font-medium text-white bg-rose-300 hover:bg-rose-400 disabled:bg-gray-300"
            >
              다음
            </button>
          </div>
        )}

        {isEmailValidated && isPasswordValidated && (
          <div className="space-y-6">
            <img
              src={userImage}
              alt="profile"
              className="block mx-auto m-4 w-[150px] h-[150px] rounded-full"
            />

            <div>
              <label
                htmlFor="name"
                className="block py-1 text-xl text-gray-700"
              >
                이름
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                className={`border w-full px-3 py-2 focus:border-gray-500 rounded-sm ${
                  errors.name ? "border-red-500 bg-red-200" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 pt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !!errors.name || watch("name") === ""}
              className="mt-10 w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-xl font-medium text-white bg-rose-300 hover:bg-rose-400 disabled:bg-gray-300"
            >
              회원가입
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
