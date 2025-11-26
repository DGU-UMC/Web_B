import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // value, delay가 변경될 때마다 실행
  useEffect(() => {
    // delay(ms) 시간 후에 실행
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    // value가 변경되면 타이머 취소: 마지막 값만 debouncedValue에 업데이트
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
