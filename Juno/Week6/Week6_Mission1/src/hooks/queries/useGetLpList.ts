import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ cursor, order }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, order],
    queryFn: () => getLpList({ cursor, order }),
    // staleTime, gcTime을 명시하지 않으면 캐싱이 일어나지 않음
    staleTime: 5 * 60 * 1_000, // 5분
    gcTime: 10 * 60 * 1_000, // 10분
    // enabled: true, // 조건에 따라 query 실행 여부 제어
    // refetchInterval: 10 * 1_000, // 10초마다 다시 fetch, 주식 데이터 등에 사용
    // retry: 3, // query 요청이 실패했을 때 자동으로 재시도할 횟수, 기본값 3회
    // initialData: {}// query 실행 전 미리 제공할 초기 데이터 설정, 컴포넌트가 렌더링될 때 빈 데이터 구조를 미리 제공
    select: (data) => data.data.data, // 받은 query 데이터의 구조 변경
  });
}

export default useGetLpList;
