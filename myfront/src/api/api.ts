import axios from 'axios';

export const axiosUserInstance = axios.create({
  baseURL: '/api/users',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosLinkInstance = axios.create({
  baseURL: '/api/links',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 401 인터셉터 공통 함수
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setupInterceptor = (instance: any) => {
  instance.interceptors.response.use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (response: any) => response,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      if (error.response?.status === 401) {
        // 로그인 페이지로 이동
        window.location.href = '/login';
      }
      return Promise.reject(error);
    },
  );
};

setupInterceptor(axiosUserInstance);
setupInterceptor(axiosLinkInstance);
