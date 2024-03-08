import { InjectionToken } from '@angular/core';
import { IConfig } from './config.model';

export const APP_CONFIG = new InjectionToken<IConfig>('application-config');
