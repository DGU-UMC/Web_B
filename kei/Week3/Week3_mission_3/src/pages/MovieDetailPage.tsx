// src/pages/MovieDetailPage.tsx
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

interface Cast { 
    id: number; 
    name: string; 
    character: string; 
    profile_path: string | null; 
    order: number; 
}

interface Crew { 
    id: number; 
    name: string; 
    job: string; 
    profile_path: string | null; 
}

interface Credits { 
    cast: Cast[]; 
    crew: Crew[]; 
}

const formatRuntime = (min?: number) => {
  if (!min && min !== 0) return '';
  const h = Math.floor(min / 60), m = min % 60;
  return h ? `${h}시간 ${m}분` : `${m}분`;
};

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const [detail, setDetail] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const TOKEN = import.meta.env.VITE_TMDB_KEY;
    const headers = { Authorization: `Bearer ${TOKEN}`, accept: 'application/json' };

    (async () => {
      try {
        setIsLoading(true);
        const [dRes, cRes] = await Promise.all([
          axios.get<MovieDetails>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, { headers }),
          axios.get<Credits>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, { headers }),
        ]);
        setDetail(dRes.data);
        setCredits(cRes.data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [movieId]);

  if (isError) {
      return (
          <div className="p-6 text-red-500">
              영화 상세 정보를 불러오는 중 오류가 발생!
          </div>
      )
  }

  if (isLoading || !detail) {
      return (
          <div className="p-6 text-gray-400">
              불러오는 중...
          </div>
      )
  }

  const director = credits?.crew.find((p) => p.job === 'Director');
  const topCast = (credits?.cast ?? []).sort((a, b) => a.order - b.order).slice(0, 10);

  return (
    <div className="pb-12">
      <div className="relative w-full overflow-hidden">
        {detail.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/w1280${detail.backdrop_path}`} 
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
            {detail.tagline && <p className="italic text-gray-300 mt-1">{detail.tagline}</p>}
          </div>
        </div>
      </div>

      <div className="p-6">
        {detail.overview && <p className="text-gray-400 leading-relaxed">{detail.overview}</p>}
        {detail.genres?.length > 0 && (
          <div className="mt-4 text-gray-450">장르: {detail.genres.map((g) => g.name).join(' / ')}</div>
        )}
      </div>

      <div className="px-6">
        <h2 className="text-xl font-bold text-white mb-4">감독 / 출연</h2>

        {director && (
          <div className="mb-6 flex items-center gap-3">
            <img 
                src={director.profile_path ? `https://image.tmdb.org/t/p/w1280${director.profile_path}` : '/placeholder.png'} 
                alt={director.name} 
                className="w-16 h-16 rounded-full object-cover" 
            />
            <div>
              <p className="text-black">{director.name}</p>
              <p className="text-gray-400 text-sm">Director</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {topCast.map((c) => (
            <div key={c.id} className="flex flex-col items-center">
              <img 
                src={c.profile_path ? `https://image.tmdb.org/t/p/w1280${c.profile_path}` : '/placeholder.png'} 
                alt={c.name} 
                className="w-20 h-20 rounded-full object-cover" 
              />
              <p className="mt-1 text-black text-sm text-center line-clamp-1">{c.name}</p>
              <p className="text-gray-400 text-xs text-center line-clamp-1">{c.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}