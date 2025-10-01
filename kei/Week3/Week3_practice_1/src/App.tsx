import './App.css'
import { Link } from './router/Link';
import { Route } from './router/Route';
import { Router } from './router/Routes';

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
      <Link to='not-found'>NOT FOUND</Link>
    </nav>
  );
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/matthew' component={MatthewPage} />
        <Route path='/kei' component={KeiPage} />
        <Route path='/harim' component={HarimPage} />
        <Route path='/not-found' component={NotFoundPage} />
      </Routes>
    </>
  );
}

export default App;