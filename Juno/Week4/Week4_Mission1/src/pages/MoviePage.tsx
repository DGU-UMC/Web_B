import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";

function MoviePage() {
  const { category } = useParams<{
    category: string;
  }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1); // 페이지네이션

  const { apiData, isPending, isError } = useCustomFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
  );

  useEffect(() => {
    if (apiData) setMovies(apiData.results);
  }, [apiData]);

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl font-extrabold">
          에러가 발생했습니다.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {/* TODO: component화 */}
      {/* <button
        aria-label="previous page"
        className="fixed left-5 top-1/2 transform -translate-y-1/2 z-50 cursor-pointer text-gray-600 text-6xl md:text-4xl sm:text-3xl p-2 rounded-full bg-transparent disabled:hidden"
        disabled={page === 1}
        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
      >
        <span className="inline-block transform scale-y-[3]">{"<"}</span>
      </button>

      <button
        aria-label="next page"
        className="fixed right-5 top-1/2 transform -translate-y-1/2 z-50 cursor-pointer text-gray-600 text-6xl md:text-4xl sm:text-3xl p-2 rounded-full bg-transparent"
        onClick={() => setPage((prev) => prev + 1)}
        disabled={page >= (apiData?.total_pages ?? Infinity)}
      >
        <span className="inline-block transform scale-y-[3]">{">"}</span>
      </button> */}

      <button
        className="fixed left-5 top-1/2 transform -translate-y-1/2 z-50 cursor-pointer text-gray-500 text-6xl md:text-4xl sm:text-3xl p-2 rounded-full bg-transparent disabled:hidden"
        disabled={page === 1}
        onClick={() => {
          setPage((prev) => prev - 1);
        }}
      >
        <span className="text-shadow-lg inline-block transform scale-y-[3]">
          {"<"}
        </span>
      </button>

      <button
        className="fixed right-5 top-1/2 transform -translate-y-1/2 z-50 cursor-pointer text-gray-500 text-6xl md:text-4xl sm:text-3xl p-2 rounded-full bg-transparent disabled:hidden"
        onClick={() => {
          setPage((prev) => prev + 1);
        }}
      >
        <span className="text-shadow-lg inline-block transform scale-y-[3]">
          {">"}
        </span>
      </button>

      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="px-20 py-10 mt-12 grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} category={category!} /> // category의 타입을 string | undefined에서 string으로 강제
          ))}
        </div>
      )}
    </div>
  );
}

export default MoviePage;
