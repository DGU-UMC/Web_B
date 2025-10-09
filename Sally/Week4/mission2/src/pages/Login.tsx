import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSingin } from "../utils/validate";

const Login = () => {
  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValues: { email: "", password: "" },
      validate: validateSingin,
    });

  const handlesubmit = () => {
    console.log(values);
    alert("로그인 되었습니다!");
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
    Object.values(values).some((value) => value === ""); //입력 값이 비어있으면 true

  return (
    <div className="pt-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-md gap-3 flex flex-col">
        <h2 className="text-3xl font-bold text-center">로그인</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block py-1 text-xl text-gray-700">
              이메일
            </label>
            <input
              {...getInputProps("email")}
              name="email"
              type="email"
              placeholder="이메일"
              required
              className={`border border-gray-300 w-full px-3 py-2 focus:border-gray-500 focus:border-indigo-500 rounded-sm
              ${
                errors?.email && touched?.email
                  ? "border-red-500 bg-red-200"
                  : "border-gray-300"
              }`}
            />
            {errors?.email && touched?.email && (
              <div className="text-sm text-red-500">{errors.email}</div>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block py-1 text-xl text-gray-700">
              비밀번호
            </label>
            <input
              {...getInputProps("password")}
              name="password"
              type={"password"}
              placeholder="비밀번호"
              required
              className={`border border-gray-300 w-full px-3 py-2 focus:border-gray-500 focus:border-indigo-500 rounded-sm
              ${
                errors?.password && touched?.password
                  ? "border-red-500 bg-red-200"
                  : "border-gray-300"
              }`}
            />
            {errors?.password && touched?.password && (
              <div className="text-sm text-red-500">{errors.password}</div>
            )}
          </div>
          <div>
            <button
              type="button"
              disabled={isDisabled}
              onClick={handlesubmit}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-xl font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 "
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
