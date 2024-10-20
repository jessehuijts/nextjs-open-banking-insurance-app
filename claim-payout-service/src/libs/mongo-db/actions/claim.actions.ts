import mongoose from "mongoose";
import Claim from "@libs/mongo-db/models/claim.model";
import connect from "@libs/mongo-db/mongoose";

interface Props {
  id?: string;
  description: string;
  amount: number;
  status: string;
  creditorIban: string;
  creditorName: string;
}

// function to create or update the Claim
export async function updateClaim({
  id,
  description,
  amount,
  status,
  creditorIban,
  creditorName,
}: Props) {
  try {
    if (id) {
      const claimObjectId = new mongoose.Types.ObjectId(id);

      await Claim.findByIdAndUpdate(claimObjectId, {
        description,
        amount,
        status,
      });
    } else {
      await Claim.create({
        description,
        amount,
        status,
        creditorIban,
        creditorName,
        date: new Date(),
      });
    }
  } catch (error: any) {
    throw new Error(`Error adding new Claim: ${error.message}`);
  }
}

// function to fetch all Claimes
export async function fetchClaims() {
  try {
    connect();
    const ClaimsData = await Claim.find().sort({
      date: "desc",
    });

    return ClaimsData;
  } catch (error: any) {
    throw new Error(`Error fetching all Claims: ${error.message}`);
  }
}

// function to fetch Claim by id
export async function fetchClaim(id: string) {
  try {
    connect();

    const ClaimObjectId = new mongoose.Types.ObjectId(id);
    const claim = await Claim.findById(ClaimObjectId);

    return claim;
  } catch (error: any) {
    throw new Error(`Error fetching Claim: ${error.message}`);
  }
}
