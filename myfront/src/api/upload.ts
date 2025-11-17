import { axiosLinkInstance } from './api';
import type { ResponseUploadUrl } from '../types/common';

export const postUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axiosLinkInstance.post<ResponseUploadUrl>('/v1/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.data.imageUrl;
};
