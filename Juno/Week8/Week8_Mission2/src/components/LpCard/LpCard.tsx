import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Lp } from "../../types/lp";

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lp/${lp.id}`)}
      className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-44 h-64 transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={`${lp.thumbnail}`} alt={`${lp.title}의 이미지`} />
      {isHovered && (
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent backdrop-blur-md flex flex-col justify-center items-center text-white p-4">
          <h2 className="text-lg font-bold leading-snug">{lp.title}</h2>
          <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">
            {lp.createdAt.slice(0, 10)}
          </p>
        </div>
      )}
    </div>
  );
};

export default LpCard;
