import type { Link } from '@/types/links';
import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFavorite } from '@/api/links';

const Card = ({ link }: { link: Link }) => {
  const [isStarred, setIsStarred] = useState(link.favorite);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: ({ id, favorite }: { id: number; favorite: boolean }) =>
      updateFavorite(id, favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });

  const toggleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = !isStarred;
    setIsStarred(newValue);

    toggleFavorite({ id: link.id, favorite: newValue });
  };

  return (
    <div
      key={link.id}
      className='bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-200'
    >
      <div className='relative cursor-pointer' onClick={() => navigate(`/detail/${link.id}`)}>
        <img
          src={
            link.thumbnail ||
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop'
          }
          alt={link.title}
          className='w-full h-48 object-cover'
        />
        <button
          onClick={toggleStar}
          className='absolute top-2 right-3 p-2 text-yellow-400 hover:text-yellow-500 transition cursor-pointer'
        >
          {isStarred ? <FaStar size={24} /> : <FaRegStar size={24} />}
        </button>
      </div>
      <div className='p-5'>
        <h3 className='text-lg font-bold text-gray-800 mb-2'>{link.title}</h3>
        <p className='text-gray-600 text-sm mb-4 line-clamp-2'>{link.content}</p>
        {/* <div className='flex flex-wrap gap-2'>
          {card.tags.map((tag, idx) => (
            <span
              key={idx}
              className='px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full'
            >
              #{tag}
            </span>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default Card;
