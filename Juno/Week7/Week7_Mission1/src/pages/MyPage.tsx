import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MyPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="mt-5 ml-5">
      <h1>My Page</h1>
      <button className="px-5 py-3 bg-blue-300" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default MyPage;
