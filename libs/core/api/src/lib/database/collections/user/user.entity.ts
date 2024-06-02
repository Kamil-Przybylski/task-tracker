import { UserId } from '@libs/shared';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { WorkspaceUserEntity } from '../workspace/workspace-user.entity';
import { WorkspaceEntity } from '../workspace/workspace.entity';

@Entity()
export class UserEntity extends BaseEntity<UserId> {
  @Index()
  @Column({ type: 'varchar', length: 100, unique: true })
  public email!: string;

  @Index()
  @Column({ type: 'varchar', length: 30, unique: true })
  public username!: string;

  @Column({ type: 'varchar' })
  public hashedPassword!: string;

  @Index()
  @Column({ type: 'boolean', default: true })
  public isActive!: boolean;

  @Index()
  @Column({ nullable: true })
  public hashedRefreshToken!: string | null;

  @Column({ type: 'varchar', nullable: true })
  public avatarPath!: string;

  @OneToMany(() => WorkspaceEntity, (entity) => entity.createdBy)
  workspace!: WorkspaceEntity[];

  @OneToMany(() => WorkspaceUserEntity, (entity) => entity.user)
  workspaceToUser!: WorkspaceUserEntity[];
}
