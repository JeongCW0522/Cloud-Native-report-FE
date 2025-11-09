import { z } from 'zod';

export const myPageSchema = z.object({
  name: z.string().min(2, '이름은 최소 2글자 이상이어야 합니다.'),
  email: z.string().min(1, '이메일을 입력해주세요.').email('유효하지 않은 이메일 형식입니다.'),
  password: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.'),
});

export type myPageType = z.infer<typeof myPageSchema>;
