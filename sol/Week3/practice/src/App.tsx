import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

const HansolPage = () => <h1>한솔 페이지</h1>;
const YujinPage = () => <h1>유진 페이지</h1>;
const JaehunPage = () => <h1>재훈 페이지</h1>;
const EungyeongPage = () => <h1>은경 페이지</h1>;

const Header = () => {
  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        fontSize: "24px",
        marginBottom: "20px",
      }}
    >
      <Link to="/hansol">HANSOL</Link>
      <Link to="/yujin">YUJIN</Link>
      <Link to="/jaehun">JAEHUN</Link>
      <Link to="/eungyeong">EUNGYEONG</Link>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/hansol" element={<HansolPage />} />
        <Route path="/yujin" element={<YujinPage />} />
        <Route path="/jaehun" element={<JaehunPage />} />
        <Route path="/eungyeong" element={<EungyeongPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
