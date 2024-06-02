import {
  InvitationStatusEnum,
  UserId,
  WorkspaceId,
  WorkspaceUserId,
} from '@libs/shared';
import { SqlErrorUtils } from '@libs/shared-api';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { UserEntity, WorkspaceEntity } from '../collections';
import { WorkspaceUserEntity } from '../collections/workspace/workspace-user.entity';

interface CreateWorkspace {
  name: string;
  description: string;
  userIds: UserId[];
}

interface CreateWorkspaceUser {
  workspaceId: WorkspaceId;
  userId: UserId;
}

interface UpdateWorkspaceUser {
  invitationStatus:
    | InvitationStatusEnum.ACCEPTED
    | InvitationStatusEnum.REJECTED;
}

@Injectable()
export class WorkspaceRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(WorkspaceUserEntity)
    private workspaceUsersRepository: Repository<WorkspaceUserEntity>,
  ) {}

  // #region Workspace
  async getAll(user: UserEntity): Promise<WorkspaceEntity[]> {
    return this.workspaceRepository.find({
      where: [
        { createdById: user.id },
        {
          workspaceToUser: {
            userId: user.id,
            invitationStatus: InvitationStatusEnum.ACCEPTED,
          },
        },
      ],
      relations: ['workspaceToUser.user'],
    });
  }

  async getOne(
    workspaceId: WorkspaceId,
    user: UserEntity,
  ): Promise<WorkspaceEntity> {
    const workspace = await this.workspaceRepository.findOne({
      where: [
        { id: workspaceId, createdById: user.id },
        {
          id: workspaceId,
          workspaceToUser: {
            userId: user.id,
            invitationStatus: InvitationStatusEnum.ACCEPTED,
          },
        },
      ],
      relations: ['workspaceToUser.user'],
    });

    if (!workspace) throw new NotFoundException();
    return workspace;
  }

  async createOne(
    dto: CreateWorkspace,
    user: UserEntity,
  ): Promise<WorkspaceEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let workspace: WorkspaceEntity;
    try {
      workspace = await this.workspaceRepository.save(
        this.getWorkspaceEntity(dto, user.id),
      );
      await this.workspaceUsersRepository.save(
        dto.userIds.map((userId) =>
          this.getWorkspaceToUserEntities(workspace.id, userId, user.id),
        ),
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return SqlErrorUtils.handleSaveError(error);
    } finally {
      await queryRunner.release();
    }
    return this.getOne(workspace.id, user);
  }
  // #endregion

  // #region WorkspaceUser
  async getAllWorkspaceUser(user: UserEntity): Promise<WorkspaceUserEntity[]> {
    return this.workspaceUsersRepository.find({
      where: { userId: user.id },
      relations: { user: true },
    });
  }

  async getOneWorkspaceUser(
    id: WorkspaceUserId,
    createdById?: UserId,
  ): Promise<WorkspaceUserEntity> {
    const workspaceUser = await this.workspaceUsersRepository.findOne({
      where: { id, ...(createdById ? { createdById } : {}) },
      relations: { user: true },
    });
    if (!workspaceUser) throw new NotFoundException();
    return workspaceUser;
  }

  async createWorkspaceUser(
    dto: CreateWorkspaceUser,
    workspaceId: WorkspaceId,
    user: UserEntity,
  ): Promise<WorkspaceUserEntity> {
    const workspace = await this.getOne(workspaceId, user);
    const entity = this.getWorkspaceToUserEntities(
      workspace.id,
      dto.userId,
      user.id,
    );

    try {
      const workspaceUser = await this.workspaceUsersRepository.save(entity);
      return this.getOneWorkspaceUser(workspaceUser.id, user.id);
    } catch (error) {
      return SqlErrorUtils.handleSaveError(error);
    }
  }

  async updateWorkspaceUser(
    workspaceUserId: WorkspaceUserId,
    dto: UpdateWorkspaceUser,
    user: UserEntity,
  ): Promise<WorkspaceUserEntity> {
    try {
      const workspaceUserEntity = await this.workspaceUsersRepository.update(
        {
          id: workspaceUserId,
          userId: user.id,
          invitationStatus: InvitationStatusEnum.PENDING,
        },
        { invitationStatus: dto.invitationStatus },
      );
      if (workspaceUserEntity.affected === 0) throw new NotFoundException();
      return this.getOneWorkspaceUser(workspaceUserId);
    } catch (error) {
      return SqlErrorUtils.handleSaveError(error);
    }
  }

  async deleteWorkspaceUser(
    workspaceUserId: WorkspaceUserId,
    user: UserEntity,
  ): Promise<DeleteResult> {
    const result = await this.workspaceUsersRepository
      .createQueryBuilder()
      .delete()
      .from(WorkspaceUserEntity)
      .where({ id: workspaceUserId, createdById: user.id })
      .orWhere({ id: workspaceUserId, userId: user.id })
      .execute();
    if (result.affected === 0) throw new NotFoundException();
    return result;
  }
  // #endregion

  // #region Entities
  private getWorkspaceEntity(
    dto: CreateWorkspace,
    createdById: UserId,
  ): WorkspaceEntity {
    const entity = new WorkspaceEntity();
    entity.name = dto.name;
    entity.description = dto.description;
    entity.createdById = createdById;
    return entity;
  }

  private getWorkspaceToUserEntities(
    workspaceId: WorkspaceId,
    userId: UserId,
    createdById: UserId,
  ): WorkspaceUserEntity {
    if (userId === createdById)
      throw new BadRequestException('Cannot invite yourself!');

    const entity = new WorkspaceUserEntity();
    entity.userId = userId;
    entity.workspaceId = workspaceId;
    entity.createdById = createdById;
    return entity;
  }
  // #endregion
}
