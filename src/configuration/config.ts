export const getConfig = () => ({
  secrets: {
    secretAccessToken: process.env.SECRET_ACCESS_TOKEN,
    secretRefreshToken: process.env.SECRET_REFRESH_TOKEN,
  },
  db: {
    postgresUriDev: process.env.POSTGRES_DEV,
    postgresUriProduction: process.env.POSTGRES_PROD,
  },
  admin: {
    userName: process.env.USER_NAME,
    password: process.env.PASSWORD,
  },
});
