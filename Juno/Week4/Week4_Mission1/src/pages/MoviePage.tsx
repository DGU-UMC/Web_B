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
    <>
      {/* TODO: component화 */}
      <div className="flex justify-center items-center gap-6 mt-5">
        <button
          className="cursor-pointer bg-pink-300 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => {
            setPage((prev) => prev - 1);
          }}
        >
          {"<"}
        </button>
        <span>{page} 페이지</span>
        <button
          className="cursor-pointer bg-pink-300 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition-all duration-200"
          onClick={() => {
            setPage((prev) => prev + 1);
          }}
        >
          {">"}
        </button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} category={category!} /> // category의 타입을 string | undefined에서 string으로 강제
          ))}
        </div>
      )}
    </>
  );
}

export default MoviePage;
