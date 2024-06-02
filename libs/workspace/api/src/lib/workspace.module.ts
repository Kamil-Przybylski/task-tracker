import { DatabaseModule } from '@libs/core-api';
import { Module } from '@nestjs/common';
import { WorkspaceService } from './services/workspace.service';

@Module({
  imports: [DatabaseModule],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
