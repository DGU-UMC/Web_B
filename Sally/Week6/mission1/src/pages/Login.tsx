import { useContext } from "react";
import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValues: { email: "", password: "" },
      validate: validateSignin,
    });

  const handlesubmit = async () => {
    await login(values);
  };

  // const handleGoogleLogin = () => {
  //   window.location.href =
  //     import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  // };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
    Object.values(values).some((value) => value === ""); //입력 값이 비어있으면 true

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
          <h2 className="text-3xl font-bold text-center">로그인</h2>
        </header>
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block py-1 text-xl text-gray-700">
              이메일
            </label>
            <input
              {...getInputProps("email")}
              id="email"
              name="email"
              type="email"
              placeholder="이메일"
              required
              className={`border border-gray-300 w-full px-3 py-2 focus:border-gray-500 rounded-sm
              ${
                errors?.email && touched?.email
                  ? "border-red-500 bg-red-200"
                  : "border-gray-300"
              }`}
            />
            {errors?.email && touched?.email && (
              <div className="text-sm text-red-500 pt-1">{errors.email}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block py-1 text-xl text-gray-700"
            >
              비밀번호
            </label>
            <input
              {...getInputProps("password")}
              id="password"
              name="password"
              type={"password"}
              placeholder="비밀번호"
              required
              className={`border border-gray-300 w-full px-3 py-2  focus:border-gray-500 rounded-sm
              ${
                errors?.password && touched?.password
                  ? "border-red-500 bg-red-200"
                  : "border-gray-300"
              }`}
            />
            {errors?.password && touched?.password && (
              <div className="text-sm text-red-500 pt-1">{errors.password}</div>
            )}
          </div>
          <button
            type="button"
            disabled={isDisabled}
            onClick={handlesubmit}
            className="mt-10 w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-xl font-medium text-white bg-rose-300 hover:bg-rose-400 disabled:bg-gray-300 "
          >
            로그인
          </button>
          <button
            type="button"
            // disabled={isDisabled}
            onClick={handleGoogleLogin}
            className="mt-10 w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-xl font-medium text-white bg-rose-300 hover:bg-rose-400 disabled:bg-gray-300 "
          >
            <img
              src={"/src/assets/google.png"}
              alt="구글로고"
              className="w-6 h-6 mr-2 pt-1"
            />
            구글 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
