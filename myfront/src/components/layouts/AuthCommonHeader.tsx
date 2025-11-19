interface AuthHeaderProps {
  title: string;
  description: string;
}

const AuthCommonHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <div className='relative'>
      <div className='text-center space-y-2'>
        <h1 className='font-bold text-2xl'>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default AuthCommonHeader;
