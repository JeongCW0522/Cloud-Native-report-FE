import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
import { FaRegStar } from 'react-icons/fa6';
import { GrScorecard } from 'react-icons/gr';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { myPageSchema, type myPageType } from '@/schema/myPagaSchema';
import clsx from 'clsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserInfo, updateUserInfo } from '@/api/auth';
import { getLinks } from '@/api/links';

const MyPage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<myPageType>({
    resolver: zodResolver(myPageSchema),
    mode: 'onChange',
  });

  const { data: linksData } = useQuery({
    queryKey: ['links', ''], // 검색 없이 전체 조회
    queryFn: () => getLinks(''),
    staleTime: 1000 * 60 * 5,
  });

  const totalCount = linksData?.data.length ?? 0;
  const favoriteCount = linksData?.data.filter((l) => l.favorite).length ?? 0;

  const { data: userData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      try {
        return await getUserInfo();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err?.response?.status === 401) {
          alert('권한이 없는 요청입니다. 로그인해주세요.');
          navigate('/login', { replace: true });
        }
        throw err;
      }
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.data.name,
        email: userData.data.email,
      });
    }
  }, [userData, reset]);

  const { mutate: updateUser } = useMutation({
    mutationFn: (body: { name: string; email: string }) => updateUserInfo(body),
    onSuccess: () => {
      alert('정보 수정에 성공했습니다.');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      if (err?.response?.status === 409) {
        alert('이미 존재하는 이메일입니다.');
      } else {
        alert('정보 수정에 실패했습니다.');
      }
      reset();
      setIsEditing(false);
    },
  });

  const onSubmit: SubmitHandler<myPageType> = (data) => {
    const updatedData = {
      name: data.name,
      email: data.email,
    };

    updateUser(updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(); // 원래 값으로 복원
    setIsEditing(false);
  };

  return (
    <div className='fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-lg'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-800'>마이페이지</h2>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='hover:bg-gray-100 rounded-lg transition-colors cursor-pointer'
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className='p-6'>
          <div className='flex items-center gap-4 mb-6'>
            <div className='w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl font-bold'>
              {userData?.data.name?.charAt(0)}
            </div>
            <h3 className='text-lg font-semibold'>{userData?.data.name}</h3>
          </div>

          {/* 통계 섹션 */}
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div className='bg-blue-50 rounded-lg p-4'>
              <div className='flex items-center gap-2 text-blue-600 mb-2'>
                <GrScorecard size={24} />
                <span className='text-md font-semibold'>콘텐츠</span>
              </div>
              <p className='text-2xl font-bold'>{totalCount}</p>
            </div>
            <div className='bg-pink-50 rounded-lg p-4'>
              <div className='flex items-center gap-2 text-pink-600 mb-2'>
                <FaRegStar size={24} />
                <span className='text-md font-semibold'>즐겨찾기</span>
              </div>
              <p className='text-2xl font-bold'>{favoriteCount}</p>
            </div>
          </div>

          {/* 정보 입력 폼 */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                  <FiUser size={18} />
                  <span>이름</span>
                </label>
                <input
                  type='text'
                  placeholder='이름을 입력하세요'
                  disabled={!isEditing}
                  {...register('name')}
                  className={clsx(
                    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed',
                    errors.name && 'border-red-500 focus:border-gray-400',
                  )}
                />
                {errors.name && (
                  <p className='text-red-500 text-sm mt-2 text-left'>{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                  <MdOutlineEmail size={18} />
                  <span>이메일</span>
                </label>
                <input
                  type='email'
                  placeholder='이메일을 입력하세요'
                  disabled={!isEditing}
                  {...register('email')}
                  className={clsx(
                    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed',
                    errors.email && 'border-red-500 focus:border-gray-400',
                  )}
                />
                {errors.email && (
                  <p className='text-red-500 text-sm mt-2 text-left'>{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className='mt-8 mb-3 flex gap-3'>
              {!isEditing ? (
                <button
                  type='button'
                  onClick={() => setIsEditing(true)}
                  className='flex-1 bg-blue-500 border text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer'
                >
                  정보 수정
                </button>
              ) : (
                <>
                  <button
                    type='button'
                    onClick={handleCancel}
                    className='flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
                  >
                    취소
                  </button>
                  <button
                    type='submit'
                    className={clsx(
                      'flex-1 px-4 py-3 bg-blue-600 rounded-lg cursor-pointer',
                      isValid
                        ? 'hover:brightness-80 transition text-white cursor-pointer'
                        : 'brightness-60 text-gray-400 cursor-not-allowed',
                    )}
                  >
                    저장
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
