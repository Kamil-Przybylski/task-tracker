export default () => ({
  API_HOST: process.env['API_HOST'],
  API_PORT: process.env['API_PORT'],
  API_PREFIX: process.env['API_PREFIX'],
  API_CORS: process.env['API_CORS'],
  API_COOKIES_SECRET: process.env['API_COOKIES_SECRET'],

  DATABASE_PATH: process.env['DATABASE_PATH'],
  DATABASE_SYNCHRONIZE: process.env['DATABASE_SYNCHRONIZE'],
});
