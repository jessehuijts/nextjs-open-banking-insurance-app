import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
import { ApolloServer } from "@apollo/server";
import { appConfig } from "@configs/app.config";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { StartExecutionInput } from "aws-sdk/clients/stepfunctions";

const generateWebFormS3URL = async (key: string) => {
  try {
    const client = new S3Client({ region: appConfig.REGION });
    const command = new PutObjectCommand({
      Bucket: appConfig.S3_NAME,
      Key: key,
    });
    const presignedUrl = await getSignedUrl(client, command, {
      expiresIn: 100000,
    });

    return { presignedUrl };
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

const listObjectsS3 = async () => {
  try {
    const client = new S3Client({ region: appConfig.REGION });
    const command = new ListObjectsCommand({ Bucket: appConfig.S3_NAME });
    const presignedUrl = await getSignedUrl(client, command, {
      expiresIn: 100000,
    });

    return { presignedUrl };
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

const startStateMachine = async (
  description: string,
  amount: number,
  creditorIban: string,
  creditorName: string
) => {
  const client = new SFNClient({ region: appConfig.REGION });

  const params = {
    stateMachineArn: process.env.STATE_MACHINE_ARN,
    input: JSON.stringify({
      amount,
      description,
      creditorIban,
      creditorName,
    }),
  } as StartExecutionInput;

  const command = new StartExecutionCommand(params);
  try {
    const data = await client.send(command);
    return data;
  } catch (error) {
    throw error;
  }
};

const typeDefs = `#graphql
  type Query {
    listObjects: GeneratedUrl
  }
  type Mutation {
    generateUrl(key: String!): GeneratedUrl
    payoutClaim(description: String!, amount: Int!, creditorIban: String!, creditorName: String!): Message!
  }

  type GeneratedUrl {
    url: String
  }

  type Message {
    message: String
  }
`;

const resolvers = {
  Query: {
    listObjects: async (_parent, _, _context) => {
      const { presignedUrl } = await listObjectsS3();
      return { url: presignedUrl };
    },
  },
  Mutation: {
    generateUrl: async (_parent, { key }, _context) => {
      const { presignedUrl } = await generateWebFormS3URL(key);
      return { url: presignedUrl };
    },
    payoutClaim: async (
      _parent,
      { description, amount, creditorIban, creditorName },
      _context
    ) => {
      await startStateMachine(description, amount, creditorIban, creditorName);

      const message = "Successfully triggered the state machine";

      return { message };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const main = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler()
);
