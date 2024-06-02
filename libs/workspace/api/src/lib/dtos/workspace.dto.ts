import { WorkspaceEntity } from '@libs/core-api';
import { UserId, WorkspaceId } from '@libs/shared';
import { IWorkspaceResDto, IWorkspaceUserResDto } from '@libs/workspace-shared';
import { Exclude } from 'class-transformer';
import { WorkspaceUserResDto } from './workspace-user.dto';

export class WorkspaceResDto implements IWorkspaceResDto {
  id!: WorkspaceId;
  name!: string;
  description!: string;
  createdById!: UserId;
  users!: IWorkspaceUserResDto[];

  @Exclude() createdDate!: Date;
  @Exclude() updatedDate!: Date;
  @Exclude() workspaceToUser!: Date;

  constructor(entity: WorkspaceEntity) {
    Object.assign(this, entity);

    if (entity.workspaceToUser)
      this.users = entity.workspaceToUser.map(
        (wtu) => new WorkspaceUserResDto(wtu),
      );
  }
}
