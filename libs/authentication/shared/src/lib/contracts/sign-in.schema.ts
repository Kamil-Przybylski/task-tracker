import { UserId } from '@libs/shared';
import { z } from 'zod';

export const signInReqSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .required();
export interface ISignInReqDto
  extends Required<z.infer<typeof signInReqSchema>> {}

export const signInResSchema = z
  .object({
    userId: z.number(),
    accessTokenExp: z.number(),
    refreshTokenExp: z.number(),
  })
  .required();
export interface ISignInResDto
  extends Required<z.infer<typeof signInResSchema>> {
  userId: UserId;
}
