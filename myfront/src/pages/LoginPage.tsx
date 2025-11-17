import AuthCommonHeader from '@/components/layouts/AuthCommonHeader';
import LoginForm from '@/components/LoginForm';

const LoginPage = () => {
  return (
    <main className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <AuthCommonHeader title='로그인' description='계정에 로그인해주세요' />
      <LoginForm />
    </main>
  );
};

export default LoginPage;
