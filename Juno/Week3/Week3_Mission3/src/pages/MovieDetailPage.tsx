import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { MovieDetail } from "../types/movie";
import LoadingSpinner from "../components/LoadingSpinner";

function MovieDetailPage() {
  const { movieId } = useParams();

  const [movie, setMovie] = useState<MovieDetail | undefined>(undefined);
  const [isPending, setIsPending] = useState(false); // 로딩 상태

  useEffect(() => {
    const fetchMovies = async (url: string, options: object) => {
      setIsPending(true); // 로딩 시작

      try {
        // const { data } = await axios(url, options);
        const { data } = await axios.get<MovieDetail>(url, options); // GET 요청임을 명시
        setMovie(data);
      } finally {
        setIsPending(false); // 로딩 끝
      }
    };

    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
      },
    };

    fetchMovies(url, options);
  }, [movieId]);

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
          <div className="absolute bg-white/75 z-10 w-4/6 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-2xl p-4 flex justify-center items-center">
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
      )}
    </>
  );
}

export default MovieDetailPage;
