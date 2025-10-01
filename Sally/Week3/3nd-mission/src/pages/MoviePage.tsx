import { useEffect, useState } from "react";
import axios from "axios";
import type { MovieResponse, Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  //로딩상태
  const [isLoading, setIsLoading] = useState(false);
  //에러상태
  const [isError, setIsError] = useState(false);
  //페이지
  const [page, setPage] = useState(1);

  const { category } = useParams<{
    category: string;
  }>();

  useEffect(() => {
    const fetchMoives = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMoives();
  }, [page, category]);
  if (isError)
    return (
      <div>
        <span text-red-500>에러가 발생했습니다.</span>
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
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
