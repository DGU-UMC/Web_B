import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>홈 페이지</h1>,
  },
  {
    path: "second",
    element: <h1>두 번째 페이지</h1>,
  },
  {
    path: "third",
    element: <h1>세 번째 페이지</h1>,
  },
  { path: "*", element: <h1>찾을 수 없는 페이지</h1> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
