import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
    return (
        <div className='h-dvh flex flex-col'>
            <nav className='p-5 bg-pink-200 text-white text-2xl font-[900]'>HARIM</nav>
            <main className='flex-1 bg-pink-200'>
                <Outlet />
            </main>
            <footer></footer>
        </div>
    );
};

export default HomeLayout;