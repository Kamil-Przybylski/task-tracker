import { UserEntity, WorkspaceRepository } from '@libs/core-api/database';
import { WorkspaceId, WorkspaceUserId } from '@libs/shared';
import {
  ICreateWorkspaceReqDto,
  ICreateWorkspaceUserReqDto,
  IUpdateWorkspaceUserReqDto,
} from '@libs/workspace-shared';
import { Injectable } from '@nestjs/common';
import { WorkspaceUserResDto } from '../dtos/workspace-user.dto';
import { WorkspaceResDto } from '../dtos/workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async createOne(
    createDto: ICreateWorkspaceReqDto,
    user: UserEntity,
  ): Promise<WorkspaceResDto> {
    const entity = await this.workspaceRepository.createOne(createDto, user);
    return new WorkspaceResDto(entity);
  }

  async getAll(user: UserEntity): Promise<WorkspaceResDto[]> {
    const entities = await this.workspaceRepository.getAll(user);
    return entities.map((entity) => new WorkspaceResDto(entity));
  }

  async getOne(
    workspaceId: WorkspaceId,
    user: UserEntity,
  ): Promise<WorkspaceResDto> {
    const entity = await this.workspaceRepository.getOne(workspaceId, user);
    return new WorkspaceResDto(entity);
  }

  async getAllWorkspaceUser(user: UserEntity) {
    const entities = await this.workspaceRepository.getAllWorkspaceUser(user);
    return entities.map((entity) => new WorkspaceUserResDto(entity));
  }

  async createWorkspaceUser(
    createDto: ICreateWorkspaceUserReqDto,
    workspaceId: WorkspaceId,
    user: UserEntity,
  ): Promise<WorkspaceUserResDto> {
    const entity = await this.workspaceRepository.createWorkspaceUser(
      createDto,
      workspaceId,
      user,
    );
    return new WorkspaceUserResDto(entity);
  }

  async updateWorkspaceUser(
    workspaceUserId: WorkspaceUserId,
    updateDto: IUpdateWorkspaceUserReqDto,
    user: UserEntity,
  ): Promise<WorkspaceUserResDto> {
    const entity = await this.workspaceRepository.updateWorkspaceUser(
      workspaceUserId,
      updateDto,
      user,
    );
    return new WorkspaceUserResDto(entity);
  }

  async deleteWorkspaceUser(
    workspaceUserId: WorkspaceUserId,
    user: UserEntity,
  ): Promise<unknown> {
    return this.workspaceRepository.deleteWorkspaceUser(workspaceUserId, user);
  }
}
