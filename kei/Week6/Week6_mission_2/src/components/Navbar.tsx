import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../apis/axios.ts';

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar = ({ onMenuToggle }: NavbarProps) => {
    const  { accessToken } = useAuth();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [username, setUsername] = useState('');

    useEffect(() => {
        //로그인 한 경우에만 내 정보 요청
        const fetch = async () => {
            if (!accessToken) return;
            try {
                const res = await axiosInstance.get('/v1/users/me');
                setUsername(res.data.data.name);
            } catch (e) {
                console.log('유저 정보 불러오기 실패', e);
            }
        };

        fetch();
    }, [accessToken]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
        <nav className='bg-white dark:bg-gray-900 shadow-md fixed w-full z-10'>
            <div className='flex items-center justify-between p-4'>

                <div className='flex items-center gap-6'>
                    <button onClick={onMenuToggle} aria-label='메뉴 열기/닫기' className='p-2 -ml-1 hover:opacity-80'>
                        <img src='/images/burger.svg' alt='menu' className='w-6 h-6' />
                    </button>
                    <Link 
                        to ='/' 
                        className='text-xl font bold text-gray-900 dark:text-white'
                    >
                        SpinningSpinning Dollimpan
                    </Link>
                </div>

                <div className='flex items-center gap-6'>
                    <Link 
                        to={'/search'}
                        className='p-2 -ml-1 hover:opacity-80'
                    >
                        <img src='/images/glasses.svg' alt='search' className='w-6 h-6' />
                    </Link>
                    {!accessToken && (
                        <>
                            <Link 
                                to={'/login'} 
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                            >
                                로그인
                            </Link>
                            <Link 
                                to={'/signup'} 
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                            >
                                회원가입
                            </Link>
                        </>
                    )}
                    {accessToken && (
                        <>
                            <span className='text-gray-700 dark:text-gray-300 hover:text-blue-500'>{username}님 반갑습니다.</span>
                            <button 
                                onClick={handleLogout}
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                            >
                                로그아웃
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
        </>
    );
};

export default Navbar;