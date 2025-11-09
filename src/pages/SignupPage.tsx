import SignupForm from '@/components/SignupForm';

import AuthCommonHeader from '@/components/layouts/AuthCommonHeader';

const SignUpPage = () => {
  return (
    <main className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <AuthCommonHeader title='회원가입' description='새로운 계정을 만드세요' />
      <SignupForm />
    </main>
  );
};

export default SignUpPage;
