const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};
export const env = {
  PORT: getEnv("PORT"),
  REDIS_HOST: getEnv("REDIS_HOST"),
  REDIS_PORT: parseInt(getEnv("REDIS_PORT"), 10),
  ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
  FAST2SMS_API_KEY: getEnv("FAST2SMS_API_KEY"),
};
