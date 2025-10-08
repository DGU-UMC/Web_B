import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "홈" },
  { to: "/movies/popular", label: "인기 영화" },
  { to: "/movies/now_playing", label: "상영 중" },
  { to: "/movies/top_rated", label: "평점 높은" },
  { to: "/movies/upcoming", label: "개봉 예정" },
];

function Navbar() {
  return (
    <div className="bg-transparent absolute z-10 flex gap-3 p-4">
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => {
            return isActive
              ? "text-pink-600 bg-pink-50 font-semibold px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-100"
              : "text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent";
          }}
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}

export default Navbar;
