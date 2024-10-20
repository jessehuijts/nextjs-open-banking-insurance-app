import { getFirstKeyOfObject } from "@utils/helpers.utils";
import { ClaimStateMachineRole } from "@resources/policies/index";

export const ClaimProcessingMachine = {
  Type: "AWS::StepFunctions::StateMachine",
  Properties: {
    StateMachineName: "processingStateMachine",
    RoleArn: {
      "Fn::GetAtt": [getFirstKeyOfObject({ ClaimStateMachineRole }), "Arn"],
    },
    DefinitionString: JSON.stringify({
      StartAt: "StoreClaim",
      States: {
        StoreClaim: {
          Type: "Task",
          Resource:
            "arn:aws:lambda:eu-west-1:000000000000:function:serverless-localstack-aws-local-storeClaim",
          Parameters: {
            Payload: {
              "amount.$": "$.amount",
              "description.$": "$.description",
              "creditorIban.$": "$.creditorIban",
              "creditorName.$": "$.creditorName",
            },
          },
          Next: "PayoutClaim",
        },
        PayoutClaim: {
          Type: "Task",
          Resource:
            "arn:aws:lambda:eu-west-1:000000000000:function:serverless-localstack-aws-local-payoutClaim",
          Parameters: {
            Payload: {
              "amount.$": "$.amount",
              "description.$": "$.description",
              "creditorIban.$": "$.creditorIban",
              "creditorName.$": "$.creditorName",
            },
          },
          End: true,
        },
      },
    }),
  },
};
