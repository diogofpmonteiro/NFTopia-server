const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");

// * Get current user info
router.get("/api/user/", isAuthenticated, async (req, res, next) => {
  try {
    // If the user is authenticated we can access the JWT payload via req.payload
    // req.payload holds the user info that was encoded in JWT during login.
    const currentUser = req.payload;
    const user = await User.findById(currentUser._id).populate("favoriteProducts");

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// * Get specific user id to compare
router.get("/user/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// * Update the current user
router.put("/api/user/", isAuthenticated, fileUploader.single("imageURL"), async (req, res, next) => {
  try {
    const currentUser = req.payload;
    const { username, profilePictureURL } = req.body;

    let newProfilePictureURL;
    if (profilePictureURL) {
      newProfilePictureURL = profilePictureURL;
    } else {
      newProfilePictureURL = currentUser.profilePictureURL;
    }

    const newUserInfo = { username, profilePictureURL: newProfilePictureURL };

    const updatedUser = await User.findByIdAndUpdate(currentUser._id, newUserInfo, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
