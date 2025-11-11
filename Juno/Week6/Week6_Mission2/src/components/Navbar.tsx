import { NavLink } from "react-router-dom";

interface NavbarProps {
  isVisible: boolean;
  navRef: React.RefObject<HTMLElement>;
}

const Navbar = ({ isVisible, navRef }: NavbarProps) => {
  return (
    <nav
      className={`${
        isVisible ? "flex" : "hidden"
      } flex-col mx-auto bg-gray-200 p-6 mt-15 `}
      ref={navRef}
    >
      <div className="flex-1 flex flex-col space-y-2">
        <NavLink
          to="/my"
          className="font-bold text-gray-700 hover:text-blue-500"
        >
          마이페이지
        </NavLink>
        <NavLink
          to="/search"
          className="font-bold text-gray-700 hover:text-blue-500"
        >
          검색
        </NavLink>
      </div>
      <div className="text-gray-600">
        {/* container 클래스는 중단점(sm, md, lg, xl, 2xl)에 도달할 때마다 태그의 최대 너비를 자동으로 조정한다. */}
        <p>
          &copy; {new Date().getFullYear()}. 돌려돌려LP판.
          {/* HTML 엔티티: HTML 문법에서 특별한 의미를 지니고 있는 문자를 화면에 표시하고 싶을 때 사용한다. &copy;, &lt;, &gt; 등이 있다. */}
        </p>
        <p>All rights reserved.</p>
        <div className="flex flex-col justify-center space-y-2 mt-4">
          <NavLink to="#">Privacy Policy</NavLink>
          <NavLink to="#">Terms of Service</NavLink>
          <NavLink to="#">Contact</NavLink>
          {/* #: 눌러도 이동이 안 된다. */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
