import { WorkspaceId } from '@libs/shared';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';

@Entity()
export class WorkspaceEntity extends BaseEntity<WorkspaceId> {
  @Column({ type: 'varchar' })
  public title!: string;

  @Column({ type: 'varchar' })
  public description!: string;

  @OneToMany(() => TaskEntity, (entity) => entity.workspace)
  tasks!: TaskEntity[];

  @ManyToMany(() => UserEntity)
  users!: UserEntity[];
}
