import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAB from '../components/FAB';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const HomeLayout = () => {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const hidden = ['/login', '/signup', '/v1/auth/google/callback'].includes(pathname);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767.98px)');
        const onChange = (e: MediaQueryListEvent) => {
        if (e.matches) setOpen(false); // 협소 화면으로 바뀌는 순간 닫기
        };
        // 페이지 들어올 때 이미 협소면 닫아두기(안전)
        if (mq.matches) setOpen(false);

        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);


    return (
        <div className='min-h-screen flex flex-col'>
            <Navbar onMenuToggle={() => setOpen((v) => !v)} />
            
            {/* 헤더 아래 영역을 좌-우로 분할 */}
            <div className="flex pt-7 min-h-0 flex-1 relative">
                {/* 왼쪽: 사이드바 (고정X, width만 차지) */}
                <Sidebar open={open} />

                <main className='flex-1 overflow-auto bg-pink-200 mt-10'>
                    <Outlet />
                </main>

                {open && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={handleClose}
                    aria-label="사이드바 외부 영역"
                />
                )}

            </div>
            
            {!hidden && <FAB to="/my" label="마이페이지로 이동" />}
            <Footer />
        </div>
    );
};

export default HomeLayout;