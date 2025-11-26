import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAB from '../components/FAB';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import LPWriteModal from '../components/LPWriteModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateOrCreateLpDto } from '../types/lp';
import { createLp } from '../apis/lp';
import { deleteMyAccount } from '../apis/users';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { LOCAL_STORAGE_KEY } from '../constants/key';

const HomeLayout = () => {
    const [open, setOpen] = useState(false);
    const [writeOpen, setWriteOpen] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: mutateCreateLp } = useMutation({
        mutationFn: (payload: UpdateOrCreateLpDto) => createLp(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lps'] });
            setWriteOpen(false);
        },
        onError: (err) => {
            console.error('LP 생성 실패', err);
        },
    });

    const { mutate: doWithdraw, isPending: withdrawing } = useMutation({
        mutationFn: async () => {
            await deleteMyAccount();
            setWithdrawOpen(false);
            navigate('/login', { replace: true });
        },
        onSuccess: async() => {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        },
        onError: (e) => {
            console.error('탈퇴 실패', e);
        },
    });

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

    const handleSubmitFromModal = (data: {
        name: string;
        content: string;
        tags: string[];
        file?: File | null;
    }) => {
        const payload: UpdateOrCreateLpDto = {
            title: data.name,
            content: data.content,
            thumbnail: '',
            tags: data.tags,
            published: true,
        };
        mutateCreateLp(payload);
        console.log(data.file);
    }

    return (
        <div className='min-h-screen flex flex-col'>
            <Navbar onMenuToggle={() => setOpen((v) => !v)} />
            
            {/* 헤더 아래 영역을 좌-우로 분할 */}
            <div className="flex pt-7 min-h-0 flex-1 relative">
                {/* 왼쪽: 사이드바 (고정X, width만 차지) */}
                <Sidebar open={open} onWithdraw={() => setWithdrawOpen(true)} />

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
            
            {!hidden && <FAB onClick={() => setWriteOpen(true)} label="LP 글 작성" />}

            <DeleteConfirmModal
                open={withdrawOpen}
                onClose={() => setWithdrawOpen(false)}
                onConfirm={() => doWithdraw()}
                title="정말 탈퇴하시겠습니까?"
                description="탈퇴 시 계정 및 데이터가 삭제될 수 있습니다."
                confirmText={withdrawing ? "처리 중…" : "예"}
                cancelText="아니오"
            />

            <LPWriteModal
                open={writeOpen}
                onClose={() => setWriteOpen(false)}
                onSubmit={handleSubmitFromModal}
            />

            <Footer />
        </div>
    );
};

export default HomeLayout;