import { IBase } from '@libs/shared';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity<Id> implements IBase<Id> {
  @PrimaryGeneratedColumn()
  public id!: Id;

  @CreateDateColumn()
  public createdDate!: Date;

  @UpdateDateColumn()
  public updatedDate!: Date;
}
