import {
  InvitationStatusEnum,
  UserId,
  WorkspaceId,
  WorkspaceUserId,
} from '@libs/shared';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { WorkspaceEntity } from './workspace.entity';

@Entity()
@Unique(['workspaceId', 'userId'])
export class WorkspaceUserEntity {
  @PrimaryGeneratedColumn()
  id!: WorkspaceUserId;

  @Column({
    type: 'varchar',
    enum: InvitationStatusEnum,
    default: InvitationStatusEnum.PENDING,
  })
  invitationStatus!: InvitationStatusEnum;

  @Column()
  createdById!: UserId;
  @ManyToOne(() => UserEntity, (entity) => entity.workspace)
  createdBy!: UserEntity[];

  @Column()
  public workspaceId!: WorkspaceId;
  @ManyToOne(() => WorkspaceEntity, (entity) => entity.workspaceToUser)
  public workspace!: WorkspaceEntity;

  @Column()
  public userId!: UserId;
  @ManyToOne(() => UserEntity, (entity) => entity.workspaceToUser)
  public user!: UserEntity;
}
