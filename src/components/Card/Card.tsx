import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  card: {
    id: number;
    thumbnail: string;
    title: string;
    description: string;
    tags: string[];
    star: boolean;
  };
}

const Card = ({ card }: CardProps) => {
  const [isStarred, setIsStarred] = useState(card.star);

  const navigate = useNavigate();

  const toggleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred((prev) => !prev);
  };

  return (
    <div
      key={card.id}
      onClick={() => navigate(`/detail/${card.id}`)}
      className='bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-200'
    >
      <div className='relative'>
        <img
          src={card.thumbnail}
          alt={card.title}
          className='w-full h-48 object-cover cursor-pointer'
        />
        <button
          onClick={toggleStar}
          className='absolute top-2 right-3 p-2 text-yellow-400 cursor-pointer hover:text-yellow-500 transition'
        >
          {isStarred ? <FaStar size={24} /> : <FaRegStar size={24} />}
        </button>
      </div>
      <div className='p-5'>
        <h3 className='text-lg font-bold text-gray-800 mb-2'>{card.title}</h3>
        <p className='text-gray-600 text-sm mb-4 line-clamp-2'>{card.description}</p>
        <div className='flex flex-wrap gap-2'>
          {card.tags.map((tag, idx) => (
            <span
              key={idx}
              className='px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full'
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
