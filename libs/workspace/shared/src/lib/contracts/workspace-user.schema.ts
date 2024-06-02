import {
  InvitationStatusEnum,
  UserId,
  WorkspaceId,
  WorkspaceUserId,
} from '@libs/shared';
import { z } from 'zod';

export const createWorkspaceUserReqSchema = z.object({
  workspaceId: z.number(),
  userId: z.number(),
});
export interface ICreateWorkspaceUserReqDto
  extends Required<z.infer<typeof createWorkspaceUserReqSchema>> {
  workspaceId: WorkspaceId;
  userId: UserId;
}

export const updateWorkspaceUserReqSchema = z.object({
  invitationStatus: z.enum([
    InvitationStatusEnum.ACCEPTED,
    InvitationStatusEnum.REJECTED,
  ]),
});
export interface IUpdateWorkspaceUserReqDto
  extends Required<z.infer<typeof updateWorkspaceUserReqSchema>> {
  userId: UserId;
}

export const workspaceUserResSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userName: z.string(),
  userAvatarPath: z.string(),
  invitationStatus: z.nativeEnum(InvitationStatusEnum),
});
export interface IWorkspaceUserResDto
  extends Required<z.infer<typeof workspaceUserResSchema>> {
  id: WorkspaceUserId;
  userId: UserId;
}
