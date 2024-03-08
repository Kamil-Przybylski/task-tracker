import * as Joi from 'joi';
import { IConfig } from './config.model';

export const configSchema = Joi.object<IConfig>({
  // base
  API_PORT: Joi.number().required(),
  API_PREFIX: Joi.string().required(),
  API_CORS: Joi.boolean().required(),

  // database
  DATABASE_PATH: Joi.string().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().required(),

  // auth
  AUTH_SECRET: Joi.string().required(),
  AUTH_ACCESS_EXPIRES_IN: Joi.string().required(),
  AUTH_REFRESH_EXPIRES_IN: Joi.string().required(),
}).required();
