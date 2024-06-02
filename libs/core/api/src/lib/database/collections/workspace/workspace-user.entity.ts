import {
  InvitationStatusEnum,
  UserId,
  WorkspaceId,
  WorkspaceUserId,
} from '@libs/shared';
import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { UserEntity } from '../user/user.entity';
import { WorkspaceEntity } from './workspace.entity';

@Entity()
@Unique(['workspaceId', 'userId'])
export class WorkspaceUserEntity extends BaseEntity<WorkspaceUserId> {
  @Index()
  @Column({
    type: 'varchar',
    enum: InvitationStatusEnum,
    default: InvitationStatusEnum.PENDING,
  })
  invitationStatus!: InvitationStatusEnum;

  @Index()
  @Column()
  createdById!: UserId;
  @ManyToOne(() => UserEntity, (entity) => entity.workspace)
  createdBy!: UserEntity[];

  @Index()
  @Column()
  public workspaceId!: WorkspaceId;
  @ManyToOne(() => WorkspaceEntity, (entity) => entity.workspaceToUser)
  public workspace!: WorkspaceEntity;

  @Index()
  @Column()
  public userId!: UserId;
  @ManyToOne(() => UserEntity, (entity) => entity.workspaceToUser)
  public user!: UserEntity;
}
