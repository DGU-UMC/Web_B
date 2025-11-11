import type { Lp } from "../../types/lp";

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  return (
    <div className="relative rounded-lg overflow-hidden hover:shadow-2xl shadow-lg transition-shadow duration-500">
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="object-cover w-full h-48"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black p-2">
        <h3 className="text-white text-sm font-semibold">{lp.title}</h3>
      </div>
    </div>
  );
};
export default LpCard;
