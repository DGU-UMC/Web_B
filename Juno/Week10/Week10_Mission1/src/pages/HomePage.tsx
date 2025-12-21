import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import { useFetch } from "../hooks/useFetch";
import type { MovieFilters, MovieResponse } from "../types/movie";

const HomePage = () => {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "어벤져스",
    include_adult: false,
    language: "ko-KR",
  });

  // useMemo로 캐싱한 객체 대신 일반 객체를 넘기면, 무한히 리렌더링된다.
  // 렌더링하면서 객체가 새로 생성되고, 그 객체를 의존성 배열에 담고 있던 useFetch의 useEffect가 작동하기 때문
  const axiosRequestConfig = useMemo(() => ({ params: filters }), [filters]);
  const { data, error, isLoading } = useFetch<MovieResponse>(
    "/search/movie",
    axiosRequestConfig
  );

  // React.memo와 함께, 영화 검색 버튼 클릭 시 검색 창(MovieFilter)도 같이 리렌더링 되는 걸 방지한다.
  const handleMovieFilters = useCallback(
    (filters: MovieFilters) => {
      setFilters(filters);
    },
    [setFilters]
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container space-y-4">
      <MovieFilter onChange={handleMovieFilters} />
      {isLoading ? (
        <div>로딩 중입니다...</div>
      ) : (
        <MovieList movies={data?.results || []} />
      )}
    </div>
  );
};

export default HomePage;
