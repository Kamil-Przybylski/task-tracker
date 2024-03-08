import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { IConfig } from './config.model';
import { APP_CONFIG } from './config.token';

export const provideAppConfig = (
  environment: IConfig,
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: APP_CONFIG,
      useValue: environment,
    },
  ]);
};
