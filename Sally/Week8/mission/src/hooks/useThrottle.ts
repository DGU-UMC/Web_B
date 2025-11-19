// useThrottle : 주어진 함수가 자주 호출될 때
// 최소 interval 간격으로만 실행되도록 throttled function을 반환한다.

import { useCallback, useRef } from "react";

function useThrottle<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number = 500
): T {
  // 마지막으로 실행된 시간을 기록하는 ref
  // useRef 사용하면 컴포넌트가 리렌더링 되어도 값이 유지되고, 변경되어도 리렌더링을 트리거하지 않는다.
  const lastExecuted = useRef<number>(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  // throttled function을 useCallback으로 메모이제이션하여 불필요한 리렌더링 방지
  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      // 마지막 실행 시간부터 delay 시간이 지났는지 확인
      if (now >= lastExecuted.current + delay) {
        // 충분한 시간이 지났으면 즉시 실행
        lastExecuted.current = now;
        callback(...args);
      } else {
        // 아직 시간이 지나지 않았으면, 남은 시간 후에 실행하도록 스케줄링
        // 기존 타이머가 있으면 취소
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        // 남은 시간 후에 실행
        const remainingTime = delay - (now - lastExecuted.current);
        timeoutId.current = setTimeout(() => {
          lastExecuted.current = Date.now();
          callback(...args);
          timeoutId.current = null;
        }, remainingTime);
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
}

export default useThrottle;
