import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./context/AuthContext";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CreateLpPage from "./pages/CreateLpPage";
import LpDetailPage from "./pages/LpDetailPage";

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

// 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "v1/auth/google/callback",
        element: <GoogleLoginRedirectPage />,
      },
      {
        path: "lp/:lpid",
        element: <LpDetailPage />,
      },
    ],
  },
];

// 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
  // Layout이 다름, 접근하려면 인증이 필요(ProtectedLayout.tsx에서 처리)
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "my",
        element: <MyPage />,
      },
      {
        path: "createLp",
        element: <CreateLpPage />,
      },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

const queryClient = new QueryClient();

// 아래와 같이 모든 query 요청에 대한 설정을 조절할 수 있다.
// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 3,
//     }
//   }
// });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>

      {/* 개발 환경에서만 활성화 */}
      {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}

export default App;
