import { useEffect } from "react";
import type { Movie } from "../types/movie";

interface MovieDetailModalProps {
    movie: Movie;
    onClose: () => void;
}

const MovieDetailModal = ({ movie, onClose }: MovieDetailModalProps) => {
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
    const fallbackImage = 'https://placehold.co/600x400';

    //ESC로 닫기
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', onKeyDown); //keydown이 발생하면 onKeyDown 실행
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const imdbUrl = `https://www.imdb.com/find?q=${movie.title}`;

    const handleOpenImdb = () => {
        window.open(imdbUrl, '_blank', 'noopener,noreferrer')
    }
    
    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
            onClick={onClose}
        >
            <div 
                className='w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='relative h-70 w-full bg-gray-100'>
                    <img
                        src={movie.backdrop_path ? `${imageBaseUrl}${movie.backdrop_path}` : fallbackImage}
                        alt={`${movie.title} 포스터`}
                        className='h-full w-full object-cover'
                    />

                    <button 
                        onClick={onClose}
                        className='absolute right-3 top-3 rounded-3xl bg-black/70 px-3 py-2 text-sm font-semibold text-white hover:bg-black'
                    >
                        X
                    </button>

                    <div className='absolute bottom-3 left-3 p-2'>
                        <div className='font-bold text-white text-2xl pb-1'>
                            {movie.title}
                        </div>
                        <div className='text-white text-md'>
                            {movie.original_title}
                        </div>
                    </div>
                </div>

                <div className='h-100 w-full flex flex-row p-8'>
                    <div className='w-1/3 flex-shrink-0 h-dvh'>
                        <img
                            src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImage}
                            alt={`${movie.title} 포스터`}
                            className='h-75 w-50 object-cover rounded-lg'
                        />
                    </div>
                    <div className='flex flex-col pl-5'>
                        <div className='flex flex-row items-center gap-2 pb-6'>
                            <div className='text-blue-600/80 font-semibold text-xl'>
                                {movie.vote_average.toFixed(1)}
                            </div>
                            <div className='text-gray-600 text-sm'>
                                ({movie.vote_count}개의 평가)
                            </div>
                        </div>

                        <div className='pb-2'>
                            개봉일 | {movie.release_date || '정보 없음'}
                        </div>

                        <div className='pb-5'>
                            인기도 | {movie.popularity} / 10.0
                        </div>

                        <div className='flex flex-col items-center'>
                            <div className='font-semibold p-2'>
                                줄거리
                            </div>
                            <div className='text-gray-600'>
                                {movie.overview.length > 100 
                                    ? `${movie.overview.slice(0, 160)}...`
                                    : movie.overview}
                            </div>
                            
                        </div>

                        <div className='flex gap-2 mt-4'>
                            <button 
                                className='bg-blue-600/80 border border-blue-600/80 px-2 py-1 text-white rounded-lg'
                                onClick={handleOpenImdb}>
                                IMDB에서 검색
                            </button>

                            <button 
                                className='bg-white border border-blue-600/80 px-2 py-1 text-blue-600/80 rounded-lg'
                                onClick={onClose}>
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieDetailModal;