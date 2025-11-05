import { Link } from 'react-router-dom';
import type { Lp } from '../../types/lp.ts';

interface LpCardProps {
    lp: Lp;
}

function formatKORDate(iso: string) {
    if (!iso) return '';

    try {
        const d = new Date(iso);
        
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');

        return `${yyyy}.${mm}.${dd}`;
    } catch {
        return iso;
    }
}

const LpCard = ({lp}: LpCardProps) => {
    const likeCount = lp.likes.length ?? 0;
    const created = formatKORDate(lp.createdAt);

    return (
        <Link
            to={`/lp/${lp.id}`}
            aria-label={`${lp.title} 상세로 이동`}
            className='block group'
        >
            <div className="relative rounded-lg overflow-hidden shadow-lg
                    transition-transform duration-300 hover:shadow-2xl
                    transform group-hover:scale-[1.08] will-change-transform"
            >
                <img 
                    src={lp.thumbnail}
                    alt={lp.title}
                    className='w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105'
                />
                <div 
                    className='
                        pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 
                        to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                />
                <div className= 'absolute inset-x-0 bottom-0 p-3 text-white'>
                    <h3
                        className='
                            text-base font-semibold leading-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]
                            opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                            transition-all duration-300 line-clamp-2 mb-1'
                        >
                        {lp.title}
                    </h3>


                    <div
                        className='
                            flex items-center justify-between text-xs opacity-0 group-hover:opacity-100
                            translate-y-1 group-hover:translate-y-0 transition-all duration-300'
                    >
                        <span className="inline-flex items-center gap-1">
                        <svg
                            aria-hidden
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 fill-current"
                        >
                            <path d="M7 2a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v1h20V7a3 3 0 0 0-3-3h-1V3a1 1 0 1 0-2 0v1H8V3a1 1 0 0 0-1-1ZM22 10H2v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-9ZM6 14a1 1 0 0 1 1-1h3v3H7a1 1 0 0 1-1-1Zm6-1h5a1 1 0 1 1 0 2h-5v-2Z" />
                        </svg>
                        {created}
                        </span>
                        <span className="inline-flex items-center gap-1">
                        <svg
                            aria-hidden
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 fill-current"
                        >
                            <path d="M12.1 21.35 10 19.45C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 15.5 4 4.5 4.5 0 0 1 20 8.5c0 3.78-3.4 6.86-8 10.95l-.9.9Z" />
                        </svg>
                        {likeCount}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default LpCard;