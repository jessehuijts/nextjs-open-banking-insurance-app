import { handlerPath } from "@libs/handler-resolver";
import type { AWS } from "@serverless/typescript";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  package: {
    patterns: ["./certificates"],
  },
} as AWS["functions"][0];
