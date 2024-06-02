import { UserId, WorkspaceId } from '@libs/shared';
import { z } from 'zod';
import {
  IWorkspaceUserResDto,
  workspaceUserResSchema,
} from './workspace-user.schema';

export const createWorkspaceReqSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    userIds: z.number().array(),
  })
  .required();
export interface ICreateWorkspaceReqDto
  extends Required<z.infer<typeof createWorkspaceReqSchema>> {
  userIds: UserId[];
}

export const workspaceResSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    createdById: z.number(),
    users: z.array(workspaceUserResSchema).optional(),
  })
  .required();
export interface IWorkspaceResDto
  extends Required<z.infer<typeof workspaceResSchema>> {
  id: WorkspaceId;
  createdById: UserId;
  users: IWorkspaceUserResDto[];
}
