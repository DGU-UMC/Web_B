import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";

const emailSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
});
type EmailForm = z.infer<typeof emailSchema>;

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
  })
  .refine((v) => v.password === v.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });
type PasswordForm = z.infer<typeof passwordSchema>;

const nameSchema = z.object({
  name: z.string().min(1, { message: "닉네임을 입력해주세요." }),
});
type NameForm = z.infer<typeof nameSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [savedEmail, setSavedEmail] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const emailForm = useForm<EmailForm>({
    defaultValues: { email: "" },
    resolver: zodResolver(emailSchema),
    mode: "onChange",
  });

  const pwForm = useForm<PasswordForm>({
    defaultValues: { password: "", passwordCheck: "" },
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const nameForm = useForm<NameForm>({
    defaultValues: { name: "" },
    resolver: zodResolver(nameSchema),
    mode: "onChange",
  });

  const handleEmailNext = emailForm.handleSubmit(({ email }) => {
    setSavedEmail(email);
    setStep(2);
  });

  const handlePwNext = pwForm.handleSubmit(({ password }) => {
    setSavedPassword(password);
    setStep(3);
  });

  const handleFinish = nameForm.handleSubmit(async ({ name }) => {
    await postSignup({ name, email: savedEmail, password: savedPassword });
    navigate("/");
  });

  const Header = (
    <div className="flex items-center justify-center gap-2 relative w-[300px] mx-auto mb-5">
      {step > 1 && (
        <button
          type="button"
          aria-label="뒤로"
          onClick={() => setStep((s) => (s === 2 ? 1 : 2))}
          className="absolute left-4 text-rose-400 hover:text-rose-400/80 text-2xl font-[800] translate-y-[1px]"
        >
          {"❮"}
        </button>
      )}
      <span className="text-2xl font-bold text-rose-400">
        {"회원가입"}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        {Header}

        {step >= 2 && (
          <div className="mb-2 text-center text-gray-300">
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded bg-indigo-400">
              ✉️ <span className="font-medium">{savedEmail}</span>
            </span>
          </div>
        )}

        {step === 1 && (
          <>
            <input
              {...emailForm.register("email")}
              className={`border w-[300px] p-[10px] rounded-sm 
                ${emailForm.formState.errors.email ? "border-red-500 bg-red-200" : "border-gray-300 bg-gray-50"}`}
              type="email"
              placeholder="이메일을 입력해주세요"
            />
            {emailForm.formState.errors.email && (
              <div className="text-red-500 text-sm">{emailForm.formState.errors.email.message}</div>
            )}

            <button
              type="button"
              onClick={handleEmailNext}
              disabled={!emailForm.formState.isValid || emailForm.formState.isSubmitting}
              className={`w-full py-3 rounded-md text-lg font-medium transition-colors
                ${emailForm.formState.isValid ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-slate-400 text-white cursor-not-allowed"}`}
            >
              다음
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="relative">
              <input
                {...pwForm.register("password")}
                className={`border w-[300px] p-[10px] pr-12 rounded-sm 
                  ${pwForm.formState.errors.password ? "border-red-500 bg-red-200" : "border-gray-300 bg-gray-50"}`}
                type={showPw ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                aria-label="비밀번호 보기/가리기"
              >
                {showPw ? "🔒" : "👀"}
              </button>
            </div>
            {pwForm.formState.errors.password && (
              <div className="text-red-500 text-sm">{pwForm.formState.errors.password.message}</div>
            )}

            <div className="relative">
              <input
                {...pwForm.register("passwordCheck")}
                className={`border w-[300px] p-[10px] pr-12 rounded-sm 
                  ${pwForm.formState.errors.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300 bg-gray-50"}`}
                type={showPw2 ? "text" : "password"}
                placeholder="비밀번호를 다시 한 번 입력해주세요"
              />
              <button
                type="button"
                onClick={() => setShowPw2((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                aria-label="비밀번호 확인 보기/가리기"
              >
                {showPw2 ? "🔒" : "👀"}
              </button>
            </div>
            {pwForm.formState.errors.passwordCheck && (
              <div className="text-red-500 text-sm">{pwForm.formState.errors.passwordCheck.message}</div>
            )}

            <button
              type="button"
              onClick={handlePwNext}
              disabled={!pwForm.formState.isValid || pwForm.formState.isSubmitting}
              className={`w-full py-3 rounded-md text-lg font-medium transition-colors
                ${pwForm.formState.isValid ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-slate-400 text-white cursor-not-allowed"}`}
            >
              다음
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300">
                IMG
              </div>
            </div>

            <input
              {...nameForm.register("name")}
              className={`border w-[300px] p-[10px] rounded-sm 
                ${nameForm.formState.errors.name ? "border-red-500 bg-red-200" : "border-gray-300 bg-gray-50"}`}
              type="text"
              placeholder="닉네임(이름)"
            />
            {nameForm.formState.errors.name && (
              <div className="text-red-500 text-sm">{nameForm.formState.errors.name.message}</div>
            )}

            <button
              type="button"
              onClick={handleFinish}
              disabled={!nameForm.formState.isValid || nameForm.formState.isSubmitting}
              className={`w-full py-3 rounded-md text-lg font-medium transition-colors
                ${nameForm.formState.isValid ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-slate-400 text-white cursor-not-allowed"}`}
            >
              회원가입 완료
            </button>
          </>
        )}
      </div>
    </div>
  );
}
