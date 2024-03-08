import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IConfig } from '../config/config.model';
import {
  TaskEntity,
  TaskItemEntity,
  UserEntity,
  WorkspaceEntity,
} from './collections';
import { UserRepository } from './repositories';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (cs: ConfigService<IConfig>) => {
        return {
          type: 'better-sqlite3',
          database: cs.get('DATABASE_PATH'),
          synchronize: cs.get('DATABASE_SYNCHRONIZE'),
          autoLoadEntities: true,
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      WorkspaceEntity,
      TaskEntity,
      TaskItemEntity,
    ]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class DatabaseModule {}
