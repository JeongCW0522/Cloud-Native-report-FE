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
