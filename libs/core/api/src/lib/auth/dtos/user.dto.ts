import { IUser } from '@libs/core-shared';
import { UserId } from '@libs/shared';
import { NotFoundException } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../../database/collections';

export class UserResDto implements IUser {
  id!: UserId;
  username!: string;
  email!: string;

  @Exclude()
  hashedRefreshToken!: string;
  @Exclude()
  hashedPassword!: string;
  @Exclude()
  isActive!: boolean;
  @Exclude()
  createdDate!: Date;
  @Exclude()
  updatedDate!: Date;

  constructor(entity: UserEntity | null) {
    if (!entity) throw new NotFoundException();
    Object.assign(this, entity);
  }
}
