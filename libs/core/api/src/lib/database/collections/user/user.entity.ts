import { UserId } from '@libs/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { WorkspaceUserEntity } from '../workspace/workspace-user.entity';
import { WorkspaceEntity } from '../workspace/workspace.entity';

@Entity()
export class UserEntity extends BaseEntity<UserId> {
  @Column({ type: 'varchar', length: 100, unique: true })
  public email!: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  public username!: string;

  @Column({ type: 'varchar' })
  public hashedPassword!: string;

  @Column({ type: 'boolean', default: true })
  public isActive!: boolean;

  @Column({ nullable: true })
  public hashedRefreshToken!: string | null;

  @Column({ type: 'varchar', nullable: true })
  public avatarPath!: string;

  @OneToMany(() => WorkspaceEntity, (entity) => entity.createdBy)
  workspace!: WorkspaceEntity[];

  @OneToMany(() => WorkspaceUserEntity, (entity) => entity.user)
  workspaceToUser!: WorkspaceUserEntity[];
}
