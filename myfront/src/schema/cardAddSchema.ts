import { z } from 'zod';

export const addCardSchema = z.object({
  url: z.string().url('유효한 URL 형식이 아닙니다.').min(1, 'url을 입력해주세요.'),
  title: z
    .string()
    .min(2, '제목을 2자 이상, 20자 이하여야 합니다.')
    .max(20, '제목은 20자 이하여야 합니다.'),
  content: z.string().max(50, '설명은 50자 이하여야 합니다.').optional(),
  // tag: z.string().optional(),
});

export type AddCardType = z.infer<typeof addCardSchema>;
