import { isSidebarOpenAtom } from '@/atom';
import { useAtomValue } from 'jotai';
import { GoHomeFill } from 'react-icons/go';
import { FaUser } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa6';
import clsx from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import type React from 'react';

interface SideBarProps {
  setFilter: React.Dispatch<React.SetStateAction<'all' | 'favorites'>>;
  currentFilter: 'all' | 'favorites';
}

const SideBar = ({ setFilter, currentFilter }: SideBarProps) => {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={clsx(
        isSidebarOpen ? 'w-64' : 'w-0',
        'transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden flex flex-col justify-between z-50',
      )}
    >
      <div className='p-6'>
        <h2 className='text-xl font-bold text-gray-800 mb-6'>Menu</h2>
        <nav className='space-y-2'>
          <button
            onClick={() => setFilter('all')}
            className={clsx(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition whitespace-nowrap',
              location.pathname === '/' && currentFilter === 'all'
                ? 'text-gray-700 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-600 hover:bg-gray-100',
            )}
          >
            <GoHomeFill size={24} />
            <span className='font-medium'>홈</span>
          </button>

          <button
            onClick={() => setFilter('favorites')}
            className={clsx(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition whitespace-nowrap',
              location.pathname === '/' && currentFilter === 'favorites'
                ? 'text-gray-700 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-600 hover:bg-gray-100',
            )}
          >
            <FaRegStar size={24} />
            <span>즐겨찾기</span>
          </button>

          <button
            onClick={() => navigate('/mypage')}
            className={clsx(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition whitespace-nowrap',
              location.pathname === '/mypage'
                ? 'text-gray-700 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-600 hover:bg-gray-100',
            )}
          >
            <FaUser size={24} />
            <span>마이페이지</span>
          </button>
        </nav>
      </div>

      <div className='p-4 border-t border-gray-200'>
        <button className='w-full flex justify-center items-center gap-2 px-4 py-3 text-red-600 font-medium rounded-lg hover:bg-red-50 transition'>
          로그아웃
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
