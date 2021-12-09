const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");

// * GET /api/user/  - Get current user info - Tested successfully
router.get("/api/user/", isAuthenticated, async (req, res, next) => {
  try {
    // If the user is authenticated we can access the JWT payload via req.payload
    // req.payload holds the user info that was encoded in JWT during login.

    const currentUser = req.payload;
    const user = await User.findById(currentUser._id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// * PUT /api/user/  - Update the current user - Tested successfully
router.put("/api/user/", isAuthenticated, async (req, res, next) => {
  try {
    // If the user is authenticated we can access the JWT payload via req.payload
    // req.payload holds the user info that was encoded in JWT during login.

    const currentUser = req.payload;
    const { username, profilePictureURL } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      {
        username,
        profilePictureURL,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
