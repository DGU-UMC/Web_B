import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedLayout() {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to={"/login"} replace />; // replace 덕에 history가 남지 않는다.
  }

  return <Outlet />;
}

export default ProtectedLayout;
