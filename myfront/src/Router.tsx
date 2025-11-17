import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import HomePage from '@/pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ErrorPage from './pages/ErrorPage';
import MyPage from './pages/MyPage';
import CardDetailPage from './pages/CardDetailPage';

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        children: [
          {
            path: 'mypage',
            element: <MyPage />,
          },
          {
            path: 'detail/:id',
            element: <CardDetailPage />,
          },
        ],
      },
      {
        path: '/favorites',
        element: <LoginPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },
]);
