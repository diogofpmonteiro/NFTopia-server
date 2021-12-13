const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  orders: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
