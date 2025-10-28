import { useEffect, useState } from "react";
import type { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category } = useParams<{ category: string }>();

  const { data, isLoading, isError } = useCustomFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
  );

  useEffect(() => {
    setPage(1);
  }, [category]);

  if (isError)
    return (
      <div>
        <span className="text-red-500">에러가 발생했습니다.</span>
      </div>
    );

  return (
    <>
      <div>
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="mr-2 px-4 py-2 bg-pink-300 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {`<`}
        </button>
        <span>{page} 페이지</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="ml-2 px-4 py-2 bg-pink-300 text-white rounded"
        >
          {`>`}
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-dvh">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <div className="py-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data?.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
