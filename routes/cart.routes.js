const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const { isAuthenticated, isAdmin } = require("./../middleware/jwt.middleware");

// * Create my cart - Tested successfully
router.post("/api/cart", isAuthenticated, async (req, res, next) => {
  try {
    // Get data from req body and payload
    const { userId } = req.body;

    const products = [];

    // Save data in DB
    const createdCart = await Cart.create({
      user: userId,
      products,
    });

    await User.findByIdAndUpdate(userId, { $push: { cart: createdCart._id } });
    res.status(201).json(createdCart);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// * Get my cart - Tested successfully
router.get("/api/cart/:cartId", async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findById(cartId).populate("products");

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

// * Update my cart - working
router.put("/api/cart/:productId", isAuthenticated, async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const { userId } = req.body;

    //get the cart
    const cart = await Cart.findOne({ user: userId });

    //update the cart with its id
    const updatedCart = await Cart.findByIdAndUpdate(cart._id, { $push: { products: productId } }, { new: true });

    res.status(201).json(updatedCart);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
