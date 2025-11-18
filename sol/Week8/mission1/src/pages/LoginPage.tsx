import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validates";

export default function LoginPage() {
  const { login, accessToken, loginError, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [navigate, accessToken]);

  const { values, touched, errors, getInputProps } =
    useForm<UserSigninInformation>({
      initialValues: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    await login(values);
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${
              errors?.email && touched?.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
          type="email"
          placeholder="이메일"
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}
        <input
          {...getInputProps("password")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${
              errors?.password && touched?.password
                ? "border-red-500"
                : "border-gray-300"
            }`}
          type="password"
          placeholder="비밀번호"
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled || isLoggingIn}
          className="w-full bg-[#807bff] text-white font-bold py-2 rounded-sm disabled:bg-[#ccc] hover:bg-[#665fff] "
        >
          {isLoggingIn ? "로그인 중..." : "로그인"}
        </button>
        {loginError && (
          <div className="text-red-500 text-sm text-center">{loginError}</div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-[#807bff] text-white font-bold py-2 rounded-sm disabled:bg-[#ccc] hover:bg-[#665fff] "
        >
          <div className="flex items-center justify-center gap-4">
            <img src={"/google.svg"} alt="Google Logo" />
            <span>구글 로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
}
