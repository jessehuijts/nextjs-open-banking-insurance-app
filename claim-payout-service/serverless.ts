import type { AWS } from "@serverless/typescript";
import server from "@functions/server";
import {
  LambdaExecutorDefaultRole,
  ClaimStateMachineRole,
} from "@resources/policies";
import { getFirstKeyOfObject } from "@utils/helpers.utils";
import { ClaimImageBucket } from "@resources/s3";
import { appConfig } from "@configs/app.config";
import storeClaim from "@functions/storeClaim";
import payoutClaim from "@functions/payoutClaim";
import { ClaimProcessingMachine } from "@resources/step-function/state.machine";

const serverlessConfiguration: AWS = {
  service: "serverless-localstack-aws",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-localstack"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      ACCOUNT: appConfig.ACCOUNT,
      REGION: appConfig.REGION,
      S3_NAME: appConfig.S3_NAME,
      S3_ENDPOINT: appConfig.S3_ENDPOINT,
      MONGODB_URL: appConfig.MONGODB_URL,
      ACCESS_TOKEN: appConfig.ACCESS_TOKEN,
      CERTIFICATE: appConfig.CERTIFICATE,
      CLIENT_ID: appConfig.CLIENT_ID,
      STATE_MACHINE_ARN: {
        "Fn::GetAtt": [getFirstKeyOfObject({ ClaimProcessingMachine }), "Arn"],
      },
    },
    iam: {
      role: getFirstKeyOfObject({ LambdaExecutorDefaultRole }),
    },
  },
  functions: { server, storeClaim, payoutClaim },
  resources: {
    Resources: {
      LambdaExecutorDefaultRole,
      ClaimImageBucket,
      ClaimProcessingMachine,
      ClaimStateMachineRole,
    },
  },
  package: { individually: true, patterns: ["!./certificates"] },
  custom: {
    localstack: {
      stages: ["local"],
      debug: true,
      lamda: {
        mountCode: true,
      },
      host: "127.0.0.1",
    },
  },
};

module.exports = serverlessConfiguration;
