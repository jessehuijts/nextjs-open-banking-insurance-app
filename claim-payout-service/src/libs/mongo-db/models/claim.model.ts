import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  creditorIban: {
    type: String,
    required: true,
  },
  creditorName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Claim = mongoose.models.Claim || mongoose.model("Claim", claimSchema);

export default Claim;
