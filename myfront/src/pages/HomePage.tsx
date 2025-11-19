import { useState } from 'react';
import SideBar from '@/components/layouts/SideBar';
import HeaderBar from '@/components/layouts/HeaderBar';
import Footer from '@/components/layouts/Footer';
import CardAddModal from '@/components/CardAddModal';
import { FiPlus } from 'react-icons/fi';
import Card from '@/components/Card/Card';
import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLinks } from '@/api/links';
import { useAtom } from 'jotai';
import { searchAtom } from '@/atom';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [search] = useAtom(searchAtom);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['links', search],
    queryFn: () => getLinks(search),
    gcTime: 100 * 60 * 10,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className='flex h-screen bg-gray-100'>
      <SideBar setFilter={setFilter} currentFilter={filter} />
      <div className='flex-1 flex flex-col'>
        <HeaderBar />
        <main className='flex-1 overflow-y-auto p-6 flex flex-col justify-between'>
          {isLoading ? (
            <div className='flex flex-col items-center gap-4 mt-20'>
              <div className='w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin' />
              <p className='text-gray-500 text-lg'>Loading...</p>
            </div>
          ) : isError ? (
            <div className='flex flex-col items-center gap-4 mt-20'>
              <p className='text-gray-500 text-lg'>에러가 발생했습니다.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {data?.data
                .filter((link) => (filter === 'favorites' ? link.favorite : true))
                .map((link) => (
                  <Card key={link.id} link={link} />
                ))}
            </div>
          )}
          <Footer />
        </main>
      </div>

      {isModalOpen && <CardAddModal setIsModalOpen={setIsModalOpen} />}

      <button
        onClick={() => setIsModalOpen(true)}
        className='fixed bottom-8 right-12 bg-blue-600 text-white rounded-full p-5 cursor-pointer
        hover:scale-105 hover:brightness-90 transition-all focus:outline-none shadow-xl z-50'
      >
        <FiPlus size={28} />
      </button>
      <Outlet />
    </div>
  );
}
