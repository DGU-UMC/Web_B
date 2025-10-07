import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

const MatthewPage = () => <h1>메튜 페이지</h1>;
const KeiPage = () => <h1>케이 페이지</h1>;
const HarimPage = () => <h1>하림 페이지</h1>;
const NotFoundPage = () => <h1>404</h1>;

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to='/matthew'>MATTHEW</Link>
      <Link to='/kei'>KEI</Link>
      <Link to='/harim'>HARIM</Link>
      <Link to='/not-found'>NOT FOUND</Link>
    </nav>
  );
};

function App() {
  return (
    <>
    <BrowserRouter>      
      <Header />
      <Routes>
        <Route path='/matthew' element={<MatthewPage />} />
        <Route path='/kei' element={<KeiPage />} />
        <Route path='/harim' element={<HarimPage />} />
        <Route path='/not-found' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;