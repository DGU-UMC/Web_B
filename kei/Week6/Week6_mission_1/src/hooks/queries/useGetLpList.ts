import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { PagiNationDto } from '../../types/common';
import { getLpList } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
// import type { ResponseLpListDto } from '../../types/lp';

// const initialLpListData: ResponseLpListDto = {
//     status: true,
//     statusCode: 200,
//     message: '',
//     data: {
//         data: [],
//     },
//     nextCursor: 0,
//     hasNext: false,
// };

function useGetLpList({ search, order, limit }: PagiNationDto) {
    return useQuery({
        queryKey:[QUERY_KEY.lps, search, order],
        queryFn: () => 
            getLpList({
                cursor: 0,
                search,
                order,
                limit,
            }),

            staleTime: 1000 * 60 * 5, // 5분

            gcTime: 100 * 60 * 10, // 10분

            // enabled: Boolean(search),

            //initialData: initialLpListData,

            placeholderData: keepPreviousData,

            select: (data) => data.data.data,
    });
}

export default useGetLpList;