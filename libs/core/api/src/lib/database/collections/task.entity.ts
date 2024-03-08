import { TaskId, UserId, WorkspaceId } from '@libs/shared';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { TaskItemEntity } from './task-item.entity';
import { UserEntity } from './user.entity';
import { WorkspaceEntity } from './workspace.entity';

@Entity()
export class TaskEntity extends BaseEntity<TaskId> {
  @Column({ type: 'varchar' })
  public title!: string;

  @Column({ type: 'varchar' })
  public description!: string;

  @Column({ type: 'smallint' })
  public status!: string;

  @Column()
  workspaceId!: WorkspaceId;
  @ManyToOne(() => WorkspaceEntity, (entity) => entity.tasks)
  workspace!: WorkspaceEntity;

  @OneToMany(() => TaskItemEntity, (entity) => entity.task)
  taskItems!: TaskItemEntity[];

  @Column()
  createdById!: UserId;
  @ManyToOne(() => UserEntity)
  createdBy!: UserEntity;

  @Column()
  assignedUserId!: UserId;
  @ManyToOne(() => UserEntity)
  assignedUser!: UserEntity;
}
