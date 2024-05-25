import { MapKey, UserId } from '@libs/shared';
import { z } from 'zod';

export const signInReqSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .required();
export type SignInReqDto = Required<z.infer<typeof signInReqSchema>>;

export const signInResSchema = z
  .object({
    userId: z.number(),
    accessTokenExp: z.number(),
    refreshTokenExp: z.number(),
  })
  .required();
export type SignInResDto = MapKey<
  z.infer<typeof signInResSchema>,
  'userId',
  UserId
>;
