import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { withCredentialInterceptor } from '@libs/auth-web';
import { provideAppConfig } from '@libs/core-web';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([withCredentialInterceptor])),
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),

    provideAppConfig(environment),
  ],
};
