import Footer from '../components/Footer.tsx';
import Navbar from '../components/Navbar.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import FAB from '../components/FAB.tsx';
import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar.tsx';
import ConfirmModal from '../components/ComFirmModal.tsx';

const ProtectedLayout = () => {
    const [open, setOpen] = useState(false);
    const { accessToken } = useAuth();
    const handleClose = () => setOpen(false);
    const location = useLocation();
    const navigate = useNavigate();

    const needAuthModalOpen = useMemo(() => !accessToken, [accessToken]);
    
    const handleConfirm = () => {
        navigate('/login', {
        replace: true,
        state: { from: location }, // 로그인 후 복귀용
        });
    };
    const handleCancel = () => {
        navigate('/', { replace: true });
    };

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
             
            <FAB to="/my" label="마이페이지로 이동" />
            <Footer />

            <ConfirmModal
                open={needAuthModalOpen}
                title="로그인이 필요합니다"
                message="이 페이지는 로그인 후 이용할 수 있습니다. 로그인하시겠어요?"
                confirmText="로그인"
                cancelText="홈으로"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    )
}

export default ProtectedLayout;