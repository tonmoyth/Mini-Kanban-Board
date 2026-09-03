import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface IEnvReturnType {
  PORT: string;
  DATABASE_URL: string;
  FRONTEND_URL: string;

  JWT_SECRET_KEY: string;
  JWT_EXPIRES_IN: string;

}

const envConfig = (): IEnvReturnType => {
  const envName = [
    "PORT",
    "DATABASE_URL",
    "FRONTEND_URL",

    "JWT_SECRET_KEY",
    "JWT_EXPIRES_IN"
  ];
  envName.forEach((element) => {
    if (!process.env[element]) {
      throw new Error(`Missing environment variable: ${element}`);
    }
  });

  return {
    PORT: process.env.PORT!,
    DATABASE_URL: process.env.DATABASE_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL!,

    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,

  };
};

export const envVeriables = envConfig();
