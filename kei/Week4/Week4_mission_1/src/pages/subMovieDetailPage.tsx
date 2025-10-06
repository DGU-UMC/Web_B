// MovieDetailPage.tsx의 useEffect 안에 클린업 함수를 포함시킨 코드

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Genre { id: number; name: string; }
interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  tagline: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: Genre[];
}
interface Cast { id: number; name: string; character: string; profile_path: string | null; order: number; }
interface Crew { id: number; name: string; job: string; profile_path: string | null; }
interface Credits { cast: Cast[]; crew: Crew[]; }

const IMG = {
  poster: (p?: string | null, size: 'w200'|'w300'|'w500'='w300') =>
    p ? `https://image.tmdb.org/t/p/${size}${p}` : '/placeholder.png',
  backdrop: (p?: string | null) => (p ? `https://image.tmdb.org/t/p/w1280${p}` : ''),
};
const formatRuntime = (min?: number) => {
  if (!min && min !== 0) return '';
  const h = Math.floor(min / 60), m = min % 60;
  return h ? `${h}시간 ${m}분` : `${m}분`;
};

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  // 훅들은 무조건 최상단에서 먼저 호출
  const [detail, setDetail] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const TOKEN = import.meta.env.VITE_TMDB_KEY;
    const headers = { Authorization: `Bearer ${TOKEN}`, accept: 'application/json' };

    (async () => {
      try {
        setIsLoading(true);
        const [dRes, cRes] = await Promise.all([
          axios.get<MovieDetails>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, { headers }),
          axios.get<Credits>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, { headers }),
        ]);
        if (isMounted) {
          setDetail(dRes.data);
          setCredits(cRes.data);
        }
      } catch {
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [movieId]);

  if (isError) return <div className="p-6 text-red-500">영화 정보를 불러오는 중 오류가 발생했습니다.</div>;
  if (isLoading || !detail) return <div className="p-6 text-gray-400">불러오는 중...</div>;

  const director = credits?.crew.find((p) => p.job === 'Director');
  const topCast = (credits?.cast ?? []).sort((a, b) => a.order - b.order).slice(0, 10);

  return (
    <div className="pb-12">
      {/* Hero */}
      <div className="relative w-full overflow-hidden">
        {detail.backdrop_path && (
          <img
            src={IMG.backdrop(detail.backdrop_path)}
            alt={`${detail.title} backdrop`}
            className="w-full h-[280px] object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60 flex items-end p-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{detail.title}</h1>
            <div className="mt-2 text-gray-300">
              {detail.release_date?.slice(0, 4) || ''} · {formatRuntime(detail.runtime)}
            </div>
            {detail.tagline && <p className="italic text-gray-200 mt-1">{detail.tagline}</p>}
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="p-6">
        {detail.overview && <p className="text-gray-200 leading-relaxed">{detail.overview}</p>}
        {detail.genres?.length > 0 && (
          <div className="mt-4 text-gray-400">장르: {detail.genres.map((g) => g.name).join(' / ')}</div>
        )}
      </div>

      {/* Director & Cast */}
      <div className="px-6">
        <h2 className="text-xl font-bold text-white mb-4">감독 / 출연</h2>

        {director && (
          <div className="mb-6 flex items-center gap-3">
            <img src={IMG.poster(director.profile_path)} alt={director.name} className="w-14 h-14 rounded-full object-cover" />
            <div>
              <p className="text-white">{director.name}</p>
              <p className="text-gray-400 text-sm">Director</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {topCast.map((c) => (
            <div key={c.id} className="flex flex-col items-center">
              <img src={IMG.poster(c.profile_path)} alt={c.name} className="w-20 h-20 rounded-full object-cover" />
              <p className="mt-1 text-white text-sm text-center line-clamp-1">{c.name}</p>
              <p className="text-gray-400 text-xs text-center line-clamp-1">{c.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}





//url : 'https://api.themoviedb.org/3/movie/617126?language=en-US'
//'https://api.themoviedb.org/3/movie/617126/credits?language=en-US'

/*
    useEffect(() => {
        const fetchMovies = async () => {
            setIsPending(true);

            try {
                const TOKEN = import.meta.env.VITE_TMDB_KEY;

                const { data } = await axios.get<MovieResponse>(
                    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            accept: 'application/json',
                        },
                    }
                );

                setMovies(data.results);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };
        fetchMovies();
    }, [page, category]);

    if(isError) {
        return (
            <div>
                <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
            </div>
        )
    }

    return (
        <>
            <div className='flex items-center justify-center gap-6 mt-5'>
                <button 
                    className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
                    hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
                    cursor-pointer disabled:cursor-not-allowed'
                    disabled={page===1} 
                    onClick={() => setPage((prev) => prev - 1)}
                >
                    {`<`}
                </button>
                <span>{page} 페이지</span>
                <button 
                    className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
                    hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer'
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    {`>`}
                </button>
            </div>
            {isPending && (
                <div className='flex items-center justify-center h-dvh'>
                    <LoadingSpinner />
                </div>
            )}
            {!isPending && (
                <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                    {movies && movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie}/>
                        ))
                    }
                </div>
            )}
        </>
    );
*/


/*
{
  "genres": [
    {
      "id": 878,
      "name": "Science Fiction" <><><>
    },
    {
      "id": 12,
      "name": "Adventure" <><><>
    }
  ],
  "id": 617126,
  "original_title": "The Fantastic 4: First Steps",
  "overview": "Against the vibrant backdrop of a 1960s-inspired, retro-futuristic world, Marvel's First Family is forced to balance their roles as heroes with the strength of their family bond, while defending Earth from a ravenous space god called Galactus and his enigmatic Herald, Silver Surfer.", <><><>
  "poster_path": "/cm8TNGBGG0aBfWj0LgrESHv8tir.jpg", <><><>
  "release_date": "2025-07-22", <><><>
  "runtime": 115, <><><>
  "status": "Released", <><><>
  "tagline": "Welcome to the family.", <><><>
  "title": "The Fantastic 4: First Steps", <><><>
}

useEffect로 데이터를 호출한 다음
MoviePage.tsx의 try catch문, + error처리를 다시 한 번 해준 다음
꾸며주면 됨
   */
