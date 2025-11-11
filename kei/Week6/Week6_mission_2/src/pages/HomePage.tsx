import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from 'react-intersection-observer';
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";

const Homepage = () => {
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.asc);

    // const { data, isPending, isError } = useGetLpList({
    //     search,
    //     limit: 50,
    // });

    const {
        data: lps, 
        isLoading,
        isFetchingNextPage, 
        hasNextPage, 
        fetchNextPage, 
        isError,
        refetch,
    } = useGetInfiniteLpList(10, search, order);

    const handleToggleOrder = () => {
        setOrder((prev) => 
            prev === PAGINATION_ORDER.asc ? PAGINATION_ORDER.desc : PAGINATION_ORDER.asc
        );
    };

    // ref, inView
    // ref -> 특정한 HTML 요소를 감시할 수 있다. 
    // inView -> 그 요소가 화면에 보이면 true
    
    const { ref, inView } = useInView({
        threshold: 0,
    });
    
    useEffect(() => {
        if (inView) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            !isFetchingNextPage && hasNextPage && fetchNextPage();
        }
    }, [inView, isFetchingNextPage, hasNextPage, fetchNextPage]);
    

    if(isError) {
        return (
            <div className='mt-20 flex flex-col items-center gap-4 text-gray-700'>
                <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
                <button
                    onClick={() => refetch()}
                    className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded'
                >
                    다시 시도하기
                </button>
            </div>
        );
    };

    return (
        <div className='container mx-auto px-4 py-6'>
            {/* 정렬 버튼 */}
            <button
                onClick={handleToggleOrder}
                className='mb-4 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700'
            >
                {order === PAGINATION_ORDER.asc ? '최신순' : '오래된순'}
            </button>

            <input value={search} onChange={(e) => setSearch(e.target.value)} />
            
            <div 
                className={
                    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                }
            >
                {isLoading && <LpCardSkeletonList count={20} />}
                {lps?.pages
                    ?.map((page) => page.data.data)
                    ?.flat()
                    ?.map((lp) => <LpCard key={lp.id} lp={lp} />)}
                {isFetchingNextPage && <LpCardSkeletonList count={20} />}
            </div> 
            <div ref={ref} className='h-2' />
        </div>
    );
};

export default Homepage;