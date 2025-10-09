import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Movie } from "../types/movie";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const [movieDetail, setMovieDetail] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setLoading(false);
      setError("유효하지 않은 영화 ID입니다.");
      return;
    }

    const fetchMovieDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get<Movie>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovieDetail(data);
      } catch (e) {
        console.error("영화 상세 정보를 불러오는 데 실패했습니다.", e);
        setError("영화 정보를 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (loading) {
    return (
      <div className="text-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  if (!movieDetail) {
    return <div className="text-center p-8">영화를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetail.backdrop_path})`,
            filter: "brightness(65%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col md:flex-row items-start gap-10">
          {movieDetail.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
              alt={movieDetail.title}
              className="w-[280px] md:w-[320px] rounded-2xl shadow-2xl shrink-0"
            />
          )}

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 whitespace-nowrap">
              {movieDetail.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-white mb-4 font-bold text-xl">
              <span>⭐ {movieDetail.vote_average?.toFixed(1)}</span>
              <span>|</span>
              <span>{movieDetail.release_date}</span>
            </div>

            <p className="text-white leading-relaxed font-bold text-lg max-w-2xl">
              {movieDetail.overview}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MovieDetailPage;
