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
router.put("/api/user/", isAuthenticated, fileUploader.single("imageURL"), async (req, res, next) => {
  try {
    // If the user is authenticated we can access the JWT payload via req.payload
    // req.payload holds the user info that was encoded in JWT during login.
    const currentUser = req.payload;
    // "existingImage" has to be the same name as the input name on the client
    const { username, profilePictureURL } = req.body;

    console.log(profilePictureURL);
    console.log("body:", req.body);
    console.log("file", req.file);

    let newProfilePictureURL;
    if (profilePictureURL) {
      newProfilePictureURL = profilePictureURL;
      console.log("profilepicture: ", newProfilePictureURL);
    } else {
      newProfilePictureURL = currentUser.profilePictureURL;
      console.log("profilepicture: ", newProfilePictureURL);
    }

    const newUserInfo = { username, profilePictureURL: newProfilePictureURL };

    const updatedUser = await User.findByIdAndUpdate(currentUser._id, newUserInfo, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// ! DELETE /api/user/  - Delete a specific user - Not working
router.delete("/api/user/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid object id" });
      return;
    }

    await User.findByIdAndDelete(userId);

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
