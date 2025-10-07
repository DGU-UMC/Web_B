import axios from "axios";
import { useEffect, useState } from "react";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

function MoviePage() {
  const { category } = useParams<{
    category: string;
  }>();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState(false); // 로딩 상태
  const [isError, setIsError] = useState(false); // 에러 상태
  const [page, setPage] = useState(1); // 페이지네이션

  useEffect(() => {
    // TODO: Abort Controller 중복 요청 처리
    const fetchMovies = async (url: string, options: object) => {
      setIsPending(true); // 로딩 시작

      try {
        // const { data } = await axios(url, options);
        const { data } = await axios.get<MovieResponse>(url, options); // GET 요청임을 명시
        setMovies(data.results);
      } catch {
        setIsError(true); // 에러 발생
      } finally {
        setIsPending(false); // 로딩 끝
      }
    };

    const url = `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
      },
    };

    fetchMovies(url, options);
  }, [page, category]); // useEffect에 page 전달: page값이 바뀔 때만 실행

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
          className="cursor-pointer bg-pink-300 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}

export default MoviePage;
