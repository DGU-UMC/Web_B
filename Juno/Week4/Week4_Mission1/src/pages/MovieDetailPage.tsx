import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { MovieDetail } from "../types/movie";
import LoadingSpinner from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";

function MovieDetailPage() {
  const { movieId } = useParams();

  const [movie, setMovie] = useState<MovieDetail | undefined>(undefined);

  const { apiData, isPending, isError } = useCustomFetch<MovieDetail>(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
  );

  useEffect(() => {
    if (apiData) setMovie(apiData);
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
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && movie && (
        <div className="relative overflow-hidden h-dvh">
          <img
            src={`https://image.tmdb.org/t/p/w1920${movie.backdrop_path}`}
            alt={`${movie.title}의 이미지`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md"></div>
          <div className="absolute bg-white/55 z-10 w-4/6 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-2xl p-4 flex justify-center items-center">
            <div className="p-6 w-1/3 overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={`${movie.title}의 이미지`}
              />
            </div>
            <div className="flex flex-col flex-1">
              <h1 className="text-3xl font-extrabold">{movie.title}</h1>
              <p className="mt-2">{movie.overview}</p>
              <div className="h-0.25 bg-black w-full mt-6 mb-6"></div>
              <span>연령제한: {movie.adult ? "성인" : "전체이용가"}</span>
              <span>개봉일자: {movie.release_date}</span>
              <span>상영시간: {movie.runtime}분</span>
            </div>
          </div>
        </div>
        // <div></div>
      )}
    </>
  );
}

export default MovieDetailPage;
