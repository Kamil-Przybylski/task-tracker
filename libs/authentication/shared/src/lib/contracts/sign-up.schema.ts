import { z } from 'zod';

export const signUpReqSchema = z
  .object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
  })
  .required();
export type SignUpReqDto = Required<z.infer<typeof signUpReqSchema>>;

export const signUpResSchema = z
  .object({
    status: z.string(),
  })
  .required();
export type SignUpResDto = Required<z.infer<typeof signUpResSchema>>;
