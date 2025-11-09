const ErrorPage = () => {
  return (
    <main className='flex flex-col items-center justify-center h-screen text-center text-gray-700 bg-gray-100'>
      <h1 className='text-3xl font-bold mb-4'>문제가 발생했습니다</h1>
      <p className='mb-8'>페이지를 불러오는 중 오류가 발생했습니다.</p>
      <a href='/' className='px-4 py-2 rounded-xl border-2 border-gray-400 active:bg-gray-300'>
        홈으로 돌아가기
      </a>
    </main>
  );
};

export default ErrorPage;
