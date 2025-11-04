import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Aside from '../components/Aside';

const HomeLayout = () => {
    return (
        <div className='h-dvh flex flex-col'>
            <Navbar/>
            <main className='flex-1 bg-pink-200 mt-10'>
                <Outlet />
            </main>
            <Aside />
            <Footer />
        </div>
    );
};

export default HomeLayout;