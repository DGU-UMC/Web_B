import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-200 flex gap-4">
      <NavLink to="/">홈</NavLink>
      <NavLink to="/about">소개</NavLink>
    </nav>
  );
}
