const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const nftSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    nftURL: { type: String, required: true },
    price: { type: Number },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Nft", nftSchema);
