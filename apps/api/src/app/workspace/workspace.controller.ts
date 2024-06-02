import { GetUser, ZodValidationPipe } from '@libs/core-api/auth';
import { UserEntity } from '@libs/core-api/database';
import { WorkspaceId, WorkspaceUserId } from '@libs/shared';
import { JwtAuthGuard } from '@libs/shared-api';
import { WorkspaceService } from '@libs/workspace-api';
import {
  ICreateWorkspaceReqDto,
  ICreateWorkspaceUserReqDto,
  IUpdateWorkspaceUserReqDto,
  IWorkspaceResDto,
  IWorkspaceUserResDto,
  WorkspaceRoutesEnum,
  createWorkspaceReqSchema,
  createWorkspaceUserReqSchema,
  updateWorkspaceUserReqSchema,
} from '@libs/workspace-shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

@Controller(WorkspaceRoutesEnum.WORKSPACE)
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  createOne(
    @Body(new ZodValidationPipe(createWorkspaceReqSchema))
    createDto: ICreateWorkspaceReqDto,
    @GetUser() user: UserEntity,
  ): Promise<IWorkspaceResDto> {
    return this.workspaceService.createOne(createDto, user);
  }

  @Get()
  getAll(@GetUser() user: UserEntity): Promise<IWorkspaceResDto[]> {
    return this.workspaceService.getAll(user);
  }

  @Get(`:${WorkspaceRoutesEnum.WORKSPACE_ID}`)
  getOne(
    @Param(WorkspaceRoutesEnum.WORKSPACE_ID) workspaceId: WorkspaceId,
    @GetUser() user: UserEntity,
  ): Promise<IWorkspaceResDto> {
    return this.workspaceService.getOne(workspaceId, user);
  }

  @Post(
    `:${WorkspaceRoutesEnum.WORKSPACE_ID}/${WorkspaceRoutesEnum.INVITATION}`,
  )
  addWorkspaceUser(
    @Param(WorkspaceRoutesEnum.WORKSPACE_ID) workspaceId: WorkspaceId,
    @Body(new ZodValidationPipe(createWorkspaceUserReqSchema))
    createDto: ICreateWorkspaceUserReqDto,
    @GetUser() user: UserEntity,
  ): Promise<IWorkspaceUserResDto> {
    return this.workspaceService.createWorkspaceUser(
      createDto,
      workspaceId,
      user,
    );
  }

  @Put(
    `:${WorkspaceRoutesEnum.WORKSPACE_ID}/${WorkspaceRoutesEnum.INVITATION}/:${WorkspaceRoutesEnum.INVITATION_ID}`,
  )
  updateWorkspaceUser(
    @Param(WorkspaceRoutesEnum.INVITATION_ID) workspaceUserId: WorkspaceUserId,
    @Body(new ZodValidationPipe(updateWorkspaceUserReqSchema))
    updateDto: IUpdateWorkspaceUserReqDto,
    @GetUser() user: UserEntity,
  ): Promise<IWorkspaceUserResDto> {
    return this.workspaceService.updateWorkspaceUser(
      workspaceUserId,
      updateDto,
      user,
    );
  }

  @Delete(
    `:${WorkspaceRoutesEnum.WORKSPACE_ID}/${WorkspaceRoutesEnum.INVITATION}/:${WorkspaceRoutesEnum.INVITATION_ID}`,
  )
  async deleteWorkspaceUser(
    @Param(WorkspaceRoutesEnum.INVITATION_ID) workspaceUserId: WorkspaceUserId,
    @GetUser() user: UserEntity,
  ): Promise<unknown> {
    await this.workspaceService.deleteWorkspaceUser(workspaceUserId, user);
    return { status: 'deleted' };
  }

  @Get(WorkspaceRoutesEnum.INVITATION)
  getAllWorkspaceUser(
    @GetUser() user: UserEntity,
  ): Promise<IWorkspaceUserResDto[]> {
    return this.workspaceService.getAllWorkspaceUser(user);
  }
}
