import { config } from "dotenv";

config();

export const appConfig = {
  ACCOUNT: process.env.ACCOUNT,
  S3_NAME: "claim-image",
  REGION: process.env.REGION,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  MONGODB_URL: process.env.MONGODB_URL,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  CERTIFICATE: process.env.CERTIFICATE,
};
