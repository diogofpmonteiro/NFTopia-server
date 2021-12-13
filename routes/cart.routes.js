const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");

// * Create my cart - Tested successfully
router.post("/api/cart/", isAuthenticated, async (req, res, next) => {
  try {
    // Get data from req body, params and payload
    const { orders } = req.body;
    const currentUser = req.payload;

    // Save data in DB
    const createdCart = await Cart.create({
      user: currentUser,
      orders,
    });

    await User.findByIdAndUpdate(currentUser._id, { $push: { cart: createdCart._id } });
    res.status(201).json(createdCart);
  } catch (error) {
    res.status(404).json(error);
  }
});

// * Get my cart - Tested successfully
router.get("/api/cart/:cartId", isAuthenticated, async (req, res, next) => {
  try {
    // If the user is authenticated we can access the JWT payload via req.payload
    // req.payload holds the user info that was encoded in JWT during login.

    const cartId = req.params.cartId;
    const cart = await Cart.findById(cartId);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

// ! Update my cart - not working
router.put("/api/cart/:cartId", isAuthenticated, async (req, res, next) => {
  try {
    const cartId = req.params.cartId;

    const { orders } = req.body;

    const updatedCart = await Cart.findByIdAndUpdate(cartId, orders, { new: true });

    res.status(201).json(updatedCart);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
