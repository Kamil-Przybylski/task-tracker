import { WorkspaceModule } from '@libs/workspace-api';
import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';

@Module({
  controllers: [WorkspaceController],
  imports: [WorkspaceModule],
})
export class AppWorkspaceModule {}
