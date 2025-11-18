import type { RequestSignup, ResponseSignup } from '@/types/auth';
import { axiosUserInstance } from './api';

export const postSignup = async (body: RequestSignup): Promise<ResponseSignup> => {
  const { data } = await axiosUserInstance.post('/v1/auth/signup', body);

  return data;
};
