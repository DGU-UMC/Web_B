import { Routes, Route } from "react-router-dom";
import AboutPage from "./pages/About";
import Navbar from "./components/NavBar";
import HomePage from "./pages/Home";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}
