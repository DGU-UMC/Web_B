export type UserSigninInformation = {
  email: string;
  password: string;
};

function validateUser(values: UserSigninInformation) {
  const errors = {
    email: "",
    password: "",
  };
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i.test(values.email)) {
    errors.email = "이메일 형식이 올바르지 않습니다.";
  }
  if (values.password.length < 8 || values.password.length > 20) {
    errors.password = "비밀번호는 최소 8자 이상, 최대 20자여야 합니다.";
  }
  return errors;
}

function validateSingin(values: UserSigninInformation) {
  return validateUser(values);
}

export { validateSingin };
