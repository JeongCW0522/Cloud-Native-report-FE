import { AiOutlineClose } from 'react-icons/ai';
import TextareaAutosize from 'react-textarea-autosize';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCardSchema, type AddCardType } from '@/schema/cardAddSchema';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteLinkDetail, getLinkDetail, updateLinkDetail } from '@/api/links';
import type { createLink } from '@/types/links';
import { postUpload } from '@/api/upload';

const CardDetailPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const { id } = useParams<{ id: string }>();
  const linkId = Number(id);

  const {
    data: linkData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['linkDetail', linkId],
    queryFn: () => getLinkDetail(linkId),
    gcTime: 100 * 60 * 10,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: (updatedData: createLink) => updateLinkDetail(linkId, updatedData),
    onSuccess: () => {
      alert('링크가 수정되었습니다');
      queryClient.invalidateQueries({ queryKey: ['linkDetail'] });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      setIsEditing(false);
    },
    onError: () => {
      alert('수정 중 오류가 발생했습니다');
    },
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: () => deleteLinkDetail(linkId),
    onSuccess: () => {
      alert('링크가 삭제되었습니다');
      queryClient.invalidateQueries({ queryKey: ['links'] });
      setIsEditing(false);
      navigate('/');
    },
    onError: () => {
      alert('삭제 중 오류가 발생했습니다');
    },
  });

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

  useEffect(() => {
    if (linkData) {
      reset({
        url: linkData.data.url,
        title: linkData.data.title,
        content: linkData.data.content || '',
      });
    }
  }, [linkData, reset]);

  const titleValue = watch('title') || '';
  const contentValue = watch('content') || '';

  const onSubmit: SubmitHandler<AddCardType> = (data) => {
    console.log(data);
    mutateUpdate({
      url: data.url,
      title: data.title,
      content: data.content,
      thumbnail: uploadedImage ?? linkData?.data.thumbnail ?? null,
    });
    setIsEditing(false);
  };

  const handleDelete = (e: { preventDefault: () => void }) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      e.preventDefault();
      mutateDelete();
    }
  };

  if (isLoading) {
    return (
      <main className='min-h-screen bg-white flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin' />
          <p className='text-gray-500 text-lg'>Loading...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className='min-h-screen bg-white flex items-center justify-center'>
        <p className='text-gray-500 text-lg'>에러가 발생했습니다.</p>
      </main>
    );
  }

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
            <div className='flex flex-row gap-5 items-center'>
              <img
                src={uploadedImage ?? linkData?.data.thumbnail ?? '/default.jpg'}
                alt='thumbnail'
                className={clsx(
                  'min-w-50 h-50 object-cover rounded-lg transition-all',
                  isEditing
                    ? 'cursor-pointer hover:brightness-75'
                    : 'cursor-default brightness-100',
                )}
                onClick={isEditing ? handleImageClick : undefined}
              />

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
              onClick={() => window.open(linkData?.data.url, '_blank')}
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
                disabled={!isEditing}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed'
                {...register('tag')}
              />
            </div> */}
          </div>

          <div className='flex flex-row gap-3 p-6 border-t border-gray-200'>
            {!isEditing ? (
              <>
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                  }}
                  className='flex-1 bg-blue-500 border text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'
                >
                  정보 수정
                </button>
                <button
                  type='button'
                  onClick={handleDelete}
                  className='flex-1 bg-red-700 border text-white py-2 px-4 rounded-lg hover:bg-red-800 transition-colors'
                >
                  삭제
                </button>
              </>
            ) : (
              <>
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
