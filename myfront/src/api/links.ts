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

export const getLinkDetail = async (linkId: number): Promise<ResponseCreateLink> => {
  const { data } = await axiosLinkInstance.get(`/v1/links/${linkId}`);

  return data;
};

export const updateLinkDetail = async (
  linkId: number,
  linkData: createLink,
): Promise<ResponseCreateLink> => {
  const { data } = await axiosLinkInstance.patch(`/v1/links/${linkId}`, linkData);

  return data;
};

export const deleteLinkDetail = async (linkId: number) => {
  const { data } = await axiosLinkInstance.delete(`/v1/links/${linkId}`);

  return data;
};

export const updateFavorite = async (id: number, favorite: boolean) => {
  const { data } = await axiosLinkInstance.patch(`/v1/links/${id}/favorite`, {
    favorite,
  });
  return data;
};
