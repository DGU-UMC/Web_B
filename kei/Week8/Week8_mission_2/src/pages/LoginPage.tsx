import { type UserSigninInformation, validateSignin } from '../utils/validate';
import useForm from '../hooks/useForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';

const LoginPage = () => {
    const location = useLocation();
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();

    // 보호 라우트(모달)에서 넘겨준 직전 경로. 없으면 홈으로
    const from = (location.state)?.from?.pathname || '/';

    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValue: {
            email: '', 
            password: '',
        },
        validate: validateSignin,
    });

    // 이미 로그인 상태로 진입했다면 원래 가려던 곳으로 즉시 복귀
    useEffect(() => {
        if (accessToken) {
        navigate(from, { replace: true });
        }
    }, [accessToken, from, navigate]);

    const { mutate: doLogin, isPending } = useMutation({
        mutationFn: async () => {
            await login(values);
        },
        onSuccess: () => {
            navigate(from, { replace: true });
        },
        onError: (e) => {
            console.error('로그인 실패', e);
        },
    });

    const handleSubmit = () => doLogin();

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_SERVER_API_URL + '/v1/auth/google/login';
    }

    //오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
    const isDisabled = 
        Object.values(errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
        Object.values(values).some((value) => value === ''); //입력값이 비어있으면 true

    return (
        <div className='flex flex-col items-center justify-center h-full gap-4'>
            <div className='flex flex-col gap-3'>
                <div className='flex items-center justify-center gap-2 relative w-[300px] mx-auto mb-5'>
                    <button
                        type='button'
                        aria-label='홈으로'
                        onClick={() => navigate(-1)}
                        className='absolute left-4 text-rose-400 hover:text-rose-400/80 text-2xl font-[800] translate-y-[1px]'
                    >
                        {'<'}
                    </button>
                    <span className='text-xl font-bold text-rose-400'>로그인</span>
                </div>
                <input 
                    {...getInputProps('email')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                        ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300 bg-gray-50"}`}
                    type={"email"}
                    placeholder={"이메일"}
                />
                {errors?.email && touched?.email && (<div className='text-red-500 text-sm'>{errors.email}</div>)}
                <input 
                    {...getInputProps('password')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                        ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300 bg-gray-50"}`}
                    type={"password"}
                    placeholder={"비밀번호"}
                />
                {errors?.password && touched?.password && (<div className='text-red-500 text-sm'>{errors.password}</div>)}
                <button 
                    type='button'
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className='w-full bg-rose-500 text-white py-3 rounded-md text-lg font-medium hover:bg-rose-600 transition-colors cursor-pointer disabled:bg-slate-400'
                >
                    {isPending ? '로그인 중…' : '로그인'}
                </button>
                <button 
                    type='button'
                    onClick={handleGoogleLogin}
                    disabled={isDisabled}
                    className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-slate-400'
                >
                    <div className='flex items-center justify-center gap-4'>
                        <img src={'/images/google.svg'} alt='Google Logo Image'/>
                        <span>
                            구글 로그인
                        </span>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default LoginPage;