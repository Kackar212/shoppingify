const DEFAULT_ACCESS_TOKEN_EXP_TIME = '60';
const DEFAULT_REFRESH_TOKEN_EXP_TIME = '7200';
const DEFAULT_ACTIVATION_TOKEN_EXP_TIME = '1800';
const DEFAULT_DATABASE_PORT = '3306';
const DEFAULT_SMTP_PORT = '587';

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
  activationToken: {
    secret: process.env.ACTIVATION_JWT_SECRET,
    expirationTime: parseInt(
      process.env.ACTIVATION_JWT_EXPIRATION_TIME || DEFAULT_ACTIVATION_TOKEN_EXP_TIME,
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
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || DEFAULT_SMTP_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    from: process.env.MAIL_FROM_ADDRESS,
    templatesDir: process.env.MAIL_TEMPLATES_DIR,
  },
  app: {
    url: process.env.APP_URL,
  },
});
