const DEFAULT_ACCESS_TOKEN_EXP_TIME = '60';
const DEFAULT_REFRESH_TOKEN_EXP_TIME = '7200';
const DEFAULT_DATABASE_PORT = '3306';

export default () => ({
  accessToken: {
    secret: process.env.JWT_SECRET,
    expirationTime: parseInt(process.env.JWT_EXPIRATION_TIME || DEFAULT_ACCESS_TOKEN_EXP_TIME),
  },
  refreshToken: {
    secret: process.env.REFRESH_JWT_SECRET,
    expirationTime: parseInt(
      process.env.REFRESH_JWT_EXPIRATION_TIME || DEFAULT_REFRESH_TOKEN_EXP_TIME,
    ),
  },
  database: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || DEFAULT_DATABASE_PORT),
    type: process.env.DB_TYPE,
  },
});
