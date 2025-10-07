import axios from "axios";
import { useEffect, useState } from "react";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";

function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // const fetchMovies = async (url: string, options: object) => {
    //   const response = await fetch(url, options);
    //   const data = await response.json();
    //   setMovies(data.results);
    // };

    const fetchMovies = async (url: string, options: object) => {
      // const { data } = await axios(url, options);
      const { data } = await axios.get<MovieResponse>(url, options); // GET 요청임을 명시

      setMovies(data.results);
    };

    const url =
      "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
      },
    };

    fetchMovies(url, options);
  }, []); // useEffect에 빈 배열 전달: MoviePage가 처음 마운트 될 때만 실행

  return (
    <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies &&
        movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
    </div>
  );
}

export default MoviePage;
