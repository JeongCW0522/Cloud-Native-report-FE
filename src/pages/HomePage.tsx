import { initialCards } from '@/data/card';
import { useState } from 'react';
import SideBar from '@/components/layouts/SideBar';
import HeaderBar from '@/components/layouts/HeaderBar';
import Footer from '@/components/layouts/Footer';
import CardAddModal from '@/components/CardAddModal';
import { FiPlus } from 'react-icons/fi';
import Card from '@/components/Card/Card';
import { Outlet } from 'react-router-dom';

export default function HomePage() {
  const [cards] = useState(initialCards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredCards = filter === 'favorites' ? cards.filter((card) => card.star) : cards;

  // const navigate = useNavigate();

  return (
    <div className='flex h-screen bg-gray-100'>
      <SideBar setFilter={setFilter} currentFilter={filter} />
      <div className='flex-1 flex flex-col'>
        <HeaderBar />
        <main className='flex-1 overflow-y-auto p-6 flex flex-col justify-between'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredCards.map((card, idx) => (
              <Card key={idx} card={card} />
            ))}
          </div>

          {/* <div className='flex justify-center items-center gap-5'>
            <button
              onClick={() => navigate('/login')}
              className='px-3 py-2 border-2 border-blue-600 rounded-xl font-semibold'
            >
              로그인
            </button>
            <button
              onClick={() => navigate('/signup')}
              className='px-3 py-2 bg-blue-600 border-2 border-blue-600 rounded-xl text-white font-semibold'
            >
              회원가입
            </button>
          </div> */}
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
