import LpDetail from "./pages/LpDetail";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import HomeLayout from "./layouts/HomeLayout";
import Signup from "./pages/Signup";
import Mypage from "./pages/Mypage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import GoogleLogin from "./pages/GoogleLogin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThrottlePage from "./pages/ThrottlePage";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "v1/auth/google/callback", element: <GoogleLogin /> },
      { path: "lp/:id", element: <LpDetail /> },
      { path: "throttle", element: <ThrottlePage /> },
    ],
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFound />,
    children: [{ path: "mypage", element: <Mypage /> }],
  },
];

export const queryClient: QueryClient = new QueryClient();
const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
