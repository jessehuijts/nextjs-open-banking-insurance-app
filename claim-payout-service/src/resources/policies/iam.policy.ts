import { getFirstKeyOfObject } from "@utils/helpers.utils";
import { ClaimImageBucket } from "@resources/s3";
import { ClaimProcessingMachine } from "@resources/step-function/state.machine";

export const LambdaExecutorDefaultRole = {
  Type: "AWS::IAM::Role",
  Properties: {
    RoleName: "LambdaExecutorDefaultRole",
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Service: ["lambda.amazonaws.com"],
          },
          Action: "sts:AssumeRole",
        },
      ],
    },
    Policies: [
      {
        PolicyName: "LambdaExecutorDefaultRole-SNS-Policy",
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["sns:*"],
              Resource: "*",
            },
          ],
        },
      },
      {
        PolicyName: "LambdaExecutorDefaultRole-S3-Policy",
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["s3:PutObject", "s3:PutObjectAcl"],
              Resource: {
                "Fn::GetAtt": [
                  getFirstKeyOfObject({ ClaimImageBucket }),
                  "Arn",
                ],
              },
            },
          ],
        },
      },
      {
        PolicyName: "LambdaExecutorDefaultRole-SFN-Policy",
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["states:StartExecution"],
              Resource: {
                "Fn::GetAtt": [
                  getFirstKeyOfObject({ ClaimProcessingMachine }),
                  "Arn",
                ],
              },
            },
          ],
        },
      },
    ],
  },
};

export const ClaimStateMachineRole = {
  Type: "AWS::IAM::Role",
  Properties: {
    RoleName: "ClaimStateMachineDefaultRole",
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Service: ["states.eu-west-1.amazonaws.com"],
          },
          Action: "sts:AssumeRole",
        },
      ],
    },
    Policies: [
      {
        PolicyName: "lambda",
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["lambda:InvokeFunction"],
              Resource: "*",
            },
          ],
        },
      },
    ],
  },
};
