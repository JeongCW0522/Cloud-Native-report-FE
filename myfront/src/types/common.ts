export type CommonResponse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type ResponseUploadUrl = CommonResponse<{ imageUrl: string }>;
