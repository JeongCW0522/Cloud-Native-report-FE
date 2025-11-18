import { useForm, type SubmitHandler } from 'react-hook-form';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupType } from '../schema/authSchema';
import { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { postSignup } from '@/api/auth';

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
    },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<SignupType> = async (data) => {
    try {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const { passwordConfirm, ...rest } = data;
      await postSignup(rest);

      alert('회원가입 성공');
      navigate('/login');
    } catch (err) {
      console.error(err);
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
              'w-full border border-gray-400 rounded-lg py-3 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
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
                'w-full border border-gray-400 rounded-lg py-3 pl-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500',
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

        <div className='flex flex-col gap-1 relative'>
          <div className='relative'>
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              placeholder='비밀번호를 다시 입력해주세요'
              className={clsx(
                'w-full border border-gray-400 rounded-lg py-3 pl-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.passwordConfirm && 'border-red-500 focus:border-gray-400',
              )}
              {...register('passwordConfirm')}
            />
            <button
              type='button'
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
              className='absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600'
            >
              {showPasswordConfirm ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
            </button>
          </div>
          {errors.passwordConfirm && (
            <p className='text-red-500 text-sm mt-2 text-left'>{errors.passwordConfirm.message}</p>
          )}
        </div>

        <div>
          <input
            type='text'
            placeholder='이름을 입력해주세요'
            className={clsx(
              'w-full border border-gray-400 rounded-lg py-3 pl-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.name && 'border-red-500 focus:border-gray-400',
            )}
            {...register('name')}
          />
          {errors.name && <p className='text-red-500 text-sm mt-2'>{errors.name.message}</p>}
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
          회원가입 완료
        </button>
        <div className='flex flex-row justify-center items-center gap-2'>
          <p>이미 계정이 있으신가요?</p>
          <a href='/login' className='text-purple-900'>
            로그인
          </a>
        </div>
      </form>
    </section>
  );
};

export default SignupForm;
