import { UserId, WorkspaceId } from '@libs/shared';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { UserEntity } from '../user/user.entity';
import { WorkspaceUserEntity } from './workspace-user.entity';

@Entity()
export class WorkspaceEntity extends BaseEntity<WorkspaceId> {
  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'varchar' })
  public description!: string;

  @Column()
  createdById!: UserId;
  @ManyToOne(() => UserEntity, (entity) => entity.workspace)
  createdBy!: UserEntity[];

  @OneToMany(() => WorkspaceUserEntity, (entity) => entity.workspace)
  workspaceToUser!: WorkspaceUserEntity[];
}
