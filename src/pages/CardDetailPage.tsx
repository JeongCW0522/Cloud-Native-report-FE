import { AiOutlineClose } from 'react-icons/ai';
import TextareaAutosize from 'react-textarea-autosize';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCardSchema, type AddCardType } from '@/schema/cardAddSchema';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CardDetailPage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<AddCardType>({
    resolver: zodResolver(addCardSchema),
    mode: 'onChange',
  });

  const titleValue = watch('title') || '';
  const descriptionValue = watch('description') || '';

  const onSubmit: SubmitHandler<AddCardType> = (data) => {
    reset(data);
    console.log('카드 추가 성공: ', data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(); // 원래 값으로 복원
    setIsEditing(false);
  };

  return (
    <div className='fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-md'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-800'>상세 정보</h2>
          <button
            onClick={() => navigate('/')}
            className='hover:bg-gray-100 rounded-lg transition-colors'
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='p-6 space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                URL<span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                placeholder='URL을 입력하세요'
                disabled={!isEditing}
                className={clsx(
                  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed',
                  errors.url && 'border-red-500 focus:border-gray-400',
                )}
                {...register('url')}
              />
              {errors.url && (
                <p className='text-red-500 text-sm mt-2 text-left'>{errors.url.message}</p>
              )}
            </div>
            <button
              type='button'
              onClick={() => console.log('링크 이동')}
              className='flex-1 w-full bg-blue-500 border text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'
            >
              링크 이동
            </button>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                제목
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                maxLength={20}
                placeholder='제목을 입력하세요'
                disabled={!isEditing}
                className={clsx(
                  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed',
                  errors.title && 'border-red-500 focus:border-gray-400',
                )}
                {...register('title')}
              />
              <div className='flex items-center mt-2 text-sm'>
                {errors.title && <p className='text-red-500 text-left'>{errors.title.message}</p>}
                <p className='text-gray-400 ml-auto'>{titleValue.length}/20</p>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                설명<span className='text-red-500'>*</span>
              </label>
              <TextareaAutosize
                minRows={2}
                maxLength={50}
                placeholder='설명을 입력하세요'
                disabled={!isEditing}
                className={clsx(
                  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed',
                  errors.description && 'border-red-500 focus:border-gray-400',
                )}
                {...register('description')}
              />
              <div className='flex items-center text-sm'>
                {errors.description && (
                  <p className='text-red-500 text-left'>{errors.description.message}</p>
                )}
                <p className='text-gray-400 ml-auto'>{descriptionValue.length}/50</p>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>태그</label>
              <input
                type='text'
                placeholder='태그를 쉼표로 구분하여 입력하세요'
                disabled={!isEditing}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed'
                {...register('tag')}
              />
            </div>
          </div>

          <div className='flex gap-3 p-6 border-t border-gray-200'>
            {!isEditing ? (
              <button
                type='button'
                onClick={() => setIsEditing(true)}
                className='flex-1 bg-blue-500 border text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'
              >
                정보 수정
              </button>
            ) : (
              <>
                <button
                  type='button'
                  onClick={handleCancel}
                  className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  취소
                </button>
                <button
                  type='submit'
                  className={clsx(
                    'flex-1 px-4 py-2 bg-blue-600 rounded-lg',
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
  );
};

export default CardDetailPage;
