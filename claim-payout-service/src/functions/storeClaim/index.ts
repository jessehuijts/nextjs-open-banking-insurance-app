import { handlerPath } from "@libs/handler-resolver";
import type { AWS } from "@serverless/typescript";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 30,
  memorySize: 1769,
} as AWS["functions"][0];
