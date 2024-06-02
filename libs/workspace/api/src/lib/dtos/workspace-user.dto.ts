import { WorkspaceUserEntity } from '@libs/core-api';
import { InvitationStatusEnum, UserId, WorkspaceUserId } from '@libs/shared';
import { IWorkspaceUserResDto } from '@libs/workspace-shared';

export class WorkspaceUserResDto implements IWorkspaceUserResDto {
  id!: WorkspaceUserId;
  userId!: UserId;
  userName!: string;
  userAvatarPath!: string;
  invitationStatus!: InvitationStatusEnum;

  constructor(entity: WorkspaceUserEntity) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.userName = entity.user.username;
    this.userAvatarPath = entity.user.avatarPath;
    this.invitationStatus = entity.invitationStatus;
  }
}
