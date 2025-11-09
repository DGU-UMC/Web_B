import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList(params: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, params],
    queryFn: () => getLpList(params),

    // 데이터가 신선하다고 간주하는 시간
    // 이 시간 동안은 캐시된 데이터를 그대로 사용. 컴포넌트가 마운트 되거나 참여 포커스 들어오는 경우도 재요청X
    // 5분 동안 기존 데이터를 그대로 활용해서 네트워크 요청 줄임
    staleTime: 1000 * 60 * 5,

    // 사용되지 않는 (비활성상태) 쿼리 데이터가 캐시에 남아있는 시간
    // staleTime이 지나고 데이터가 신선하지 않더라도, 일정 시간 동안 메모리에 보간
    // 그 이후 해당 쿼리가 전혀 사용되지 않으면 gcTime이 지난 후에 제거
    // 10분 동안 사용되지 않으면 해당 캐시 데이터가 삭제되어, 재요청 시 데이터 받아옴.
    gcTime: 1000 * 60 * 10,

    // 조건에 따라 쿼리를 실행 여부 제어
    // enabled: Boolean(serch)
    // refetchinterval: 1000 * 60,

    // retry: 쿼리 요청이 실패했을 때 자동으로 재시도하는 횟수 설정
    // 기본값은 3회 정도, 네트워크 오류 등 임시적인 문제 보완

    // initialData: 초기 데이터 설정
    // 컴포넌트가 렌더링 될 때 빈 데이터 구조를 미리 제공해서, 로딩 전에도 안전하게 UI를 구성할 수 있게 해준다.
    // initialData: initialLpListData,

    // 파라미터가 변경될 때 이전 데이터를 유지하여 UI 깜빡임을 줄여줌
    // ex) 페이지네이션, 필터링 등에서 유용
    // keepPreviousData: true
  });
}

export default useGetLpList;
