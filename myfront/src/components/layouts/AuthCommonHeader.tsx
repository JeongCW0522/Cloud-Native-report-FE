import { IoChevronBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface AuthHeaderProps {
  title: string;
  description: string;
}

const AuthCommonHeader = ({ title, description }: AuthHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className='relative'>
      <button
        onClick={() => navigate('/')}
        className='absolute right-55 text-lg font-semibold hover:bg-gray-300 rounded-full transition'
      >
        <IoChevronBackOutline size={24} />
      </button>

      <div className='text-center space-y-2'>
        <h1 className='font-bold text-2xl'>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default AuthCommonHeader;
