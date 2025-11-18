import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, delay: number = 500): T {
  // 최종적으로 throttling이 저장된 값 저장
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // useRef의 lastExecuted: 마지막으로 실행된 시간을 기록하는 변수
  // useState로 최종 실행 시간을 기록하면 리렌더링되면서 없어진다.
  const lastExecuted = useRef<number>(Date.now());

  // value, delay가 변경될 때 아래 로직 실행
  useEffect(() => {
    // 현재 시각과 lastExecuted.current에 저장된 마지막 시각 + delay를 비교
    // 충분한 시간이 지났다면 업데이트
    if (Date.now() >= lastExecuted.current + delay) {
      // 충분한 시간이 지남: 현재 시각으로 lastExecuted 업데이트
      lastExecuted.current = Date.now();

      // 최신 value를 throttledValute에 저장해서 컴포넌트 리렌더링
      setThrottledValue(value);
    } else {
      // 시간이 덜 지남: delay 시간 후에 최신 value로 업데이트
      const timerId = setTimeout(() => {
        // 타이머가 만료되면, 마지막 업데이트 시간을 현재 시간으로 갱신
        lastExecuted.current = Date.now();

        // 최신 value를 throttledValue에 저장해서 컴포넌트 리렌더링
        setThrottledValue(value);
      }, delay);

      // CleanUp Function 이펙트가 재실행되기 전에 타이머가 실행되지 않았다면
      // 기존 타이머를 clearTimeout으로 취소하여 중복 업데이트 방지
      return () => clearTimeout(timerId);
    }
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;
