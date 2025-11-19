import { useForm, type SubmitHandler } from 'react-hook-form';
import clsx from 'clsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginType } from '@/schema/authSchema';
import { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { postLogin } from '@/api/auth';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<LoginType> = async (data) => {
    try {
      await postLogin(data);
      queryClient.clear();

      alert('로그인에 성공했습니다.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <section className='m-10 flex flex-col min-w-80'>
      <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type='email'
            placeholder='이메일을 입력해주세요'
            className={clsx(
              'w-full border rounded-lg py-3 pl-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.email && 'border-red-500 focus:border-gray-400',
            )}
            {...register('email')}
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-2 text-left'>{errors.email.message}</p>
          )}
        </div>
        <div className='flex flex-col gap-1 relative'>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='비밀번호를 입력해주세요'
              className={clsx(
                'w-full border rounded-lg py-3 pl-2 pr-10 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.password && 'border-red-500 focus:border-gray-400',
              )}
              {...register('password')}
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600'
            >
              {showPassword ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
            </button>
          </div>
          {errors.password && (
            <p className='text-red-500 text-sm mt-2 text-left'>{errors.password.message}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={!isValid}
          className={clsx(
            'rounded-lg py-3 bg-blue-600',
            isValid
              ? 'hover:brightness-80 transition text-white cursor-pointer'
              : 'brightness-60 text-gray-400 cursor-not-allowed',
          )}
        >
          로그인
        </button>
        <div className='flex flex-row justify-center items-center gap-2'>
          <p>계정이 없으신가요?</p>
          <a href='/signup' className='text-purple-900'>
            회원가입
          </a>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
