import type { createLink, ResponseCreateLink, ResponseLinkList } from '@/types/links';
import { axiosLinkInstance } from './api';

export const postLinks = async (linkData: createLink): Promise<ResponseCreateLink> => {
  const { data } = await axiosLinkInstance.post('/v1/links', linkData);

  return data;
};

export const getLinks = async (search?: string): Promise<ResponseLinkList> => {
  const { data } = await axiosLinkInstance.get('/v1/links', {
    params: { search },
  });

  return data;
};
