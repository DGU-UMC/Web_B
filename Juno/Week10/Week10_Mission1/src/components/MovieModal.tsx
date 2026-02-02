import { X } from "lucide-react";
import type { Movie } from "../types/movie";
import { imageBaseUrl } from "../constants/movie";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  toggle: () => void;
  movie: Movie;
}

const MovieModal = ({ isOpen, onClose, toggle, movie }: MovieModalProps) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-30 ${
          isOpen ? "" : "hidden pointer-events-none"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed min-w-[700px] min-h-[540px] inset-x-1/4 inset-y-24 rounded-2xl flex flex-col items-center box-border bg-gray-50 shadow-2xl z-40 ${
          isOpen ? "" : "hidden pointer-events-none"
        }`}
      >
        <div className="relative w-full h-5/12 overflow-hidden">
          {movie.backdrop_path ? (
            <img
              className="w-full"
              src={`${imageBaseUrl}${movie.backdrop_path}`}
              alt=""
            />
          ) : (
            <div className="w-full h-full bg-gray-950"></div>
          )}

          <div className="absolute inset-0 bg-black/50"></div>

          <button
            className="absolute right-2 top-2 cursor-pointer p-1 bg-gray-950 rounded-full text-gray-50"
            onClick={toggle}
          >
            <X />
          </button>

          <div className="absolute bottom-4 left-4">
            <h1 className="text-gray-50 font-extrabold text-xl">
              {movie.title}
            </h1>
            <h3 className="text-gray-50 text-sm">{movie.original_title}</h3>
          </div>

          <div className="absolute bottom-4 right-4">
            <button
              className="cursor-pointer py-2 px-4 bg-blue-500 text-white rounded-lg"
              onClick={() => {
                const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(
                  movie.original_title
                )}`;
                window.open(searchUrl, "_blank", "noopener,noreferrer");
              }}
            >
              IMDb에서 검색
            </button>
          </div>
        </div>

        <div className="w-full flex-1 overflow-hidden px-4 space-x-4 flex items-center">
          <img
            className="h-10/12 rounded-lg"
            src={`${imageBaseUrl}${movie.poster_path}`}
            alt=""
          />
          <div className="flex-col flex-1">
            <div className="flex items-center">
              <h2 className="text-lg font-bold">
                {movie.vote_average.toFixed(1)}
              </h2>
              <h4 className="ml-2 text-gray-500">{`(${movie.vote_count} 평가)`}</h4>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-lg">개봉일</h4>
              <h5>{movie.release_date}</h5>
              <h4 className="text-lg mt-2">인기도</h4>
              <h5>{movie.popularity}</h5>
              <h4 className="text-lg mt-2">줄거리</h4>
              <p className="text-sm text-gray-700">
                {movie.overview.length > 150
                  ? `${movie.overview.slice(0, 150)}...`
                  : movie.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieModal;
