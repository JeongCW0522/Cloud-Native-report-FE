import React, { useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import TextareaAutosize from 'react-textarea-autosize';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCardSchema, type AddCardType } from '@/schema/cardAddSchema';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLinks } from '@/api/links';
import { postUpload } from '@/api/upload';

interface CardAddModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CardAddModal = ({ setIsModalOpen }: CardAddModalProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await postUpload(file);
      setUploadedImage(imageUrl);
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
      console.error(err);
    }
  };

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
  const contentValue = watch('content') || '';

  const { mutate: createLinks } = useMutation({
    mutationFn: postLinks,
    onSuccess: () => {
      alert('링크가 성공적으로 추가되었습니다!');
      setIsModalOpen(false);
      setUploadedImage(null);
      reset();
      navigate('/');
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: () => {
      alert('링크 추가를 실패했습니다.');
    },
  });

  const onSubmit: SubmitHandler<AddCardType> = (data) => {
    const newCard = {
      url: data.url,
      title: data.title,
      content: data.content,
      thumbnail: uploadedImage ?? null,
    };

    createLinks(newCard);
  };

  return (
    <div className='fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-md'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-800'>새 카드 추가</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className='hover:bg-gray-100 rounded-lg transition-colors'
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='p-6 space-y-3'>
            <div className='flex flex-row gap-5 items-center'>
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt='업로드된 이미지'
                  className='min-w-50 h-50 object-cover rounded-lg cursor-pointer hover:brightness-75 transition-all'
                  onClick={handleImageClick}
                />
              ) : (
                <button
                  type='button'
                  onClick={handleImageClick}
                  className='bg-gray-300 min-w-50 h-50 text-gray-500 text-7xl rounded-xl hover:brightness-90 transition cursor-pointer'
                >
                  +
                </button>
              )}

              <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                className='hidden'
                onChange={handleFileChange}
              />
              <p className='text-gray-500 text-sm leading-relaxed'>
                썸네일을 추가하지 않으면 기본 이미지로 저장됩니다.
              </p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                URL<span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                placeholder='URL을 입력하세요'
                className={clsx(
                  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                  errors.url && 'border-red-500 focus:border-gray-400',
                )}
                {...register('url')}
              />
              <div className='h-5 mt-1 text-sm flex items-center'>
                {errors.url && <p className='text-red-500 text-left'>{errors.url.message}</p>}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                제목
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                placeholder='제목을 입력하세요'
                maxLength={20}
                className={clsx(
                  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
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
                placeholder='설명을 입력하세요'
                maxLength={50}
                className={clsx(
                  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                  errors.content && 'border-red-500 focus:border-gray-400',
                )}
                {...register('content')}
              />
              <div className='flex items-center text-sm'>
                {errors.content && (
                  <p className='text-red-500 text-left'>{errors.content.message}</p>
                )}
                <p className='text-gray-400 ml-auto'>{contentValue.length}/50</p>
              </div>
            </div>

            {/* <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>태그</label>
              <input
                type='text'
                placeholder='태그를 쉼표로 구분하여 입력하세요'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                {...register('tag')}
              />
            </div> */}
          </div>

          <div className='flex gap-3 p-6 border-t border-gray-200'>
            <button
              onClick={() => setIsModalOpen(false)}
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
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardAddModal;
