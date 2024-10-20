import { Handler } from "aws-lambda";
import { updateClaim } from "@libs/mongo-db/actions/claim.actions";
import connect from "@libs/mongo-db/mongoose";

const storeClaim: Handler = async (event: {
  description: string;
  amount: number;
  creditorIban: string;
  creditorName: string;
}) => {
  await connect();

  const status = "OPEN";
  try {
    await updateClaim({
      description: event.description,
      amount: event.amount,
      status,
      creditorIban: event.creditorIban,
      creditorName: event.creditorName,
    });

    // Return the relevant data for the next state
    return {
      amount: event.amount,
      description: event.description,
      creditorIban: event.creditorIban,
      creditorName: event.creditorName,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const main = storeClaim;
