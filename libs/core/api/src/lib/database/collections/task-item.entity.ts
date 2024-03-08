import { TaskId, TaskItemId, UserId } from '@libs/shared';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base-entity';
import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';

@Entity()
export class TaskItemEntity extends BaseEntity<TaskItemId> {
  @Column({ type: 'varchar' })
  public content!: string;

  @Column({ type: 'smallint' })
  public status!: number;

  @Column()
  taskId!: TaskId;
  @ManyToOne(() => TaskEntity, (entity) => entity.taskItems)
  task!: TaskEntity;

  @Column()
  createdById!: UserId;
  @ManyToOne(() => UserEntity)
  createdBy!: UserEntity;
}
