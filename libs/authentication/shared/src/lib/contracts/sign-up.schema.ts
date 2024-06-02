import { z } from 'zod';

export const signUpReqSchema = z
  .object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
  })
  .required();
export interface ISignUpReqDto
  extends Required<z.infer<typeof signUpReqSchema>> {}

export const signUpResSchema = z
  .object({
    status: z.string(),
  })
  .required();
export interface ISignUpResDto
  extends Required<z.infer<typeof signUpResSchema>> {}
