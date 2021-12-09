const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePictureURL: { type: String, default: "https://www.classeadiagnosticos.com.br/wp-content/uploads/2017/01/profile-silhouette.jpg" },
  wallet: [{ type: Schema.Types.ObjectId, ref: "Nft" }],
  cart: { type: Schema.Types.ObjectId, ref: "Cart" },
});

module.exports = model("User", userSchema);
