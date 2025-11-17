import axios from 'axios';

export const axiosUserInstance = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosLinkInstance = axios.create({
  baseURL: import.meta.env.VITE_LINK_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
