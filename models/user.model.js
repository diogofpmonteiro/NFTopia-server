const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const defaultProfilePictureUrl = "https://www.classeadiagnosticos.com.br/wp-content/uploads/2017/01/profile-silhouette.jpg";

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePictureURL: { type: String, default: defaultProfilePictureUrl },
  cart: { type: Schema.Types.ObjectId, ref: "Cart" },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

module.exports = model("User", userSchema);
