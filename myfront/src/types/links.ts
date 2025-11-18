import type { CommonResponse } from './common';

export type createLink = {
  url: string;
  title: string;
  content?: string;
  thumbnail?: string | null;
};

export type ResponseCreateLink = CommonResponse<{
  id: number;
  url: string;
  title: string;
  content: string;
  thumbnail: string;
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}>;

export type Link = {
  id: number;
  url: string;
  title: string;
  content: string | null;
  thumbnail: string | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ResponseLinkList = CommonResponse<Link[]>;

export type ResponseFavorite = CommonResponse<{
  id: number;
  favorite: boolean;
}>;
