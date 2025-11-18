import type { CommonResponse } from './common';

export type RequestLogin = {
  email: string;
  password: string;
};

export type ResponseLogin = CommonResponse<{
  id: number;
  email: string;
  name: string;
}>;

export type RequestSignup = {
  name: string;
  email: string;
  password: string;
};

export type ResponseSignup = CommonResponse<{
  id: number;
  name: string;
  email: string;
  createAt: Date;
  updatedAt: Date;
}>;
