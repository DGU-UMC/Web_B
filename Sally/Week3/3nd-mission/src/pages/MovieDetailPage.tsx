import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Movie, Credits } from "../types/movie";
import LoadingSpinner from "../components/LoadingSpinner";

export const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      try {
        const [movieResponse, creditsResponse] = await Promise.all([
          axios<Movie>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios<Credits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
        ]);
        setMovie(movieResponse.data);
        setCredits(creditsResponse.data);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <span className="text-red-500">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-lg">{movie.overview}</p>
          <div className="flex gap-4">
            <span className="font-bold">개봉일:</span>
            <span>{movie.release_date}</span>
          </div>
          <div className="flex gap-4">
            <span className="font-bold">평점:</span>
            <span>{movie.vote_average}</span>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">출연진</h2>
        <div className="grid grid-cols-5 md:grid-cols-5 gap-2 mt-4">
          {credits?.cast.slice(0, 10).map((cast) => (
            <div key={cast.cast_id} className="flex flex-col items-center">
              <img
                src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
                alt={cast.name}
                className="w-32 h-32 object-cover rounded-full"
              />
              <span className="font-bold mt-2">{cast.name}</span>
              <span className="text-sm">{cast.character}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">제작진</h2>
        <div className="grid grid-cols-5 md:grid-cols-5 gap-2 mt-4">
          {credits?.crew.slice(0, 10).map((crew) => (
            <div key={crew.credit_id} className="flex flex-col items-center">
              <img
                src={`https://image.tmdb.org/t/p/w200${crew.profile_path}`}
                alt={crew.name}
                className="w-32 h-32 object-cover rounded-full"
              />
              <span className="font-bold mt-2">{crew.name}</span>
              <span className="text-sm">{crew.job}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
