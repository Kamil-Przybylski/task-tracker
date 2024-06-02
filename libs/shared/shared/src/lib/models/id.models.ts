import { Flavor } from '../utils/models.utils';

export type UserId = Flavor<number, 'User'>;
export type WorkspaceId = Flavor<number, 'Workspace'>;
export type WorkspaceUserId = Flavor<number, 'WorkspaceUser'>;
