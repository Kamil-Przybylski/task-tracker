export interface IConfig {
  // base
  API_PORT: number;
  API_PREFIX: string;
  API_CORS: boolean;
  API_COOKIES_SECRET: string;

  // database
  DATABASE_PATH: string;
  DATABASE_SYNCHRONIZE: string;

  // auth
  AUTH_SECRET: string;
  AUTH_ACCESS_EXPIRES_IN: string;
  AUTH_REFRESH_EXPIRES_IN: string;
}
