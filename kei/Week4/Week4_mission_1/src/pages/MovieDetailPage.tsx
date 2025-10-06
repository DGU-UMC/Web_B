import { useParams } from 'react-router-dom';
import { MovieDetails, Credits } from '../types/movie'
import useCustomFetch from '../hooks/useCustomfetch';

const formatRuntime = (min?: number) => {
  if (!min && min !== 0) return '';
  const h = Math.floor(min / 60), m = min % 60;
  return h ? `${h}시간 ${m}분` : `${m}분`;
};

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
  const creditUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`;

  const details = useCustomFetch<MovieDetails>(detailUrl);
  const people = useCustomFetch<Credits>(creditUrl);

  const detail = details.data;
  const credits = people.data;

  if (details.isError || people.isError) {
      return (
          <div className="p-6 text-red-500">
              영화 상세 정보를 불러오는 중 오류가 발생!
          </div>
      )
  }

  if (details.isPending || people.isPending || !detail) {
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