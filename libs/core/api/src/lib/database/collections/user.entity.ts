import { UserId } from '@libs/shared';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base-entity';

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
}
