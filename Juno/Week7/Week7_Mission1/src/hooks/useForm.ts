import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
  initialValue: T; // {"email": "", "password": ""}
  validate: (values: T) => Record<keyof T, string>; // 유효성 검증
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>(); // {"email": false, "password": true}
  const [errors, setErrors] = useState<Record<string, string>>(); // {"email": "이메일은 반드시 @를 포함", "password": "8자 이상"}

  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values, // 기존값 유지
      [name]: text, // 변경된 값 반영
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const getInputProps = (name: keyof T) => {
    const value = values[name];

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors); // 오류 메시지 업데이트
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;
