import { useEffect, useState } from "react";
import { type MovieResponse } from "../types/movie.ts";
import MovieCard from "../components/MovieCard.tsx";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";
import { useParams } from "react-router";
import { useCustomFetch } from "../hooks/useCustomFetch.ts";

export default function MoviePage() {
  // 로딩, 에러 상태는 훅이 관리
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [isPending, setIsPending] = useState(false);
  // const [isError, setIsError] = useState(false);

  // 페이지 상태
  const [page, setPage] = useState(1);

  const { category } = useParams<{ category: string }>();

  const fetchUrl = category
    ? `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
    : null;

  const {
    data: movieResponse,
    isPending,
    isError,
  } = useCustomFetch<MovieResponse>(fetchUrl);

  const movies = movieResponse?.results || [];

  useEffect((): void => {
    setPage(1);
  }, [category]);

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center gap-6 mt-5">
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={(): void => setPage((prev): number => prev - 1)}
        >{`<`}</button>
        <span>{page} 페이지</span>
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
          onClick={(): void => setPage((prev): number => prev + 1)}
        >{`>`}</button>
      </div>

      {isPending && (
        <div className="flex justify-center items-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="p-10 gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
