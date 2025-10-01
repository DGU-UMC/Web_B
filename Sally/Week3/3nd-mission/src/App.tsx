import "./App.css";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import HomePage from "./pages/home";
// import NotFound from "./pages/not-found";
// import Movies from "./pages/movies";
// import RootLayout from "./layout/root-layout";
import MoviePage from "./pages/MoviePage";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     errorElement: <NotFound />,
//     children: [
//       {
//         index: true,
//         element: <HomePage />,
//       },
//       {
//         // /movies/뒤에 오는 값을 movieId라는 이름으로 받겠다는 뜻
//         path: "movies/:movieId",
//         element: <Movies />,
//       },
//     ],
//   },
// ]);

function App() {
  return (
    <>
      <MoviePage />
    </>
  );
}

export default App;
