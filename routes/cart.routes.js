const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");

// Create my cart
router.post("/api/cart/", isAuthenticated, async (req, res, next) => {
  try {
    // Get data from request body
    const { orders } = req.body;

    // Save data in DB
    const createdCart = await Cart.create({ orders });

    res.status(201).json(createdCart);
  } catch (error) {
    res.status(404).json(error);
  }
});

// Get my cart
router.get("/api/cart/", isAuthenticated, async (req, res, next) => {});

// Update my cart
router.put("/api/cart/", isAuthenticated, async (req, res, next) => {});

module.exports = router;
