const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const { isAuthenticated, isAdmin } = require("./../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");

const saltRounds = 10;

// * POST /auth/signup - Tested successfully
router.post("/auth/signup", fileUploader.single("imageURL"), async (req, res, next) => {
  try {
    // Get the data from req.body
    const { username, password, profilePictureURL } = req.body;

    // Validate that values are not empty strings
    if (username === "" || password === "" || profilePictureURL === "") {
      res.status(400).json({ message: "Provide username, password and picture." });
      return;
    }

    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message: "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    // Check if username is not taken
    const foundUser = await User.findOne({ username });

    if (foundUser) {
      res.status(400).json({ message: "Provide a valid username" });
      return;
    }

    // If username is not taken - Hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user in the DB
    const createdUser = await User.create({
      username,
      password: hashedPassword,
      profilePictureURL,
    });

    // We should never expose passwords publicly
    const user = {
      _id: createdUser._id,
      username: createdUser.username,
      profilePictureURL: createdUser.profilePictureURL,
      cart: createdUser.cart,
      role: createdUser.role,
    };

    // Send the response back
    res.status(201).json({ user: user });
  } catch (error) {
    next(error);
  }
});

// * POST /auth/login - Tested successfully
router.post("/auth/login", async (req, res, next) => {
  try {
    // Get values from req.body
    const { username, password } = req.body;

    // Validate that values are not empty strings
    if (username === "" || password === "") {
      res.status(400).json({ message: "Provide username and password" });
      return;
    }

    // Check if the user exists
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      res.status(400).json({ message: "Provide a valid username" });
      return;
    }

    //  Compare the provided password with one from debugger
    const passwordCorrect = await bcrypt.compare(password, foundUser.password);

    if (passwordCorrect) {
      // We should never expose passwords publicly
      const payload = {
        _id: foundUser._id,
        username: foundUser.username,
        profilePictureURL: foundUser.profilePictureURL,
        cart: foundUser.cart,
        role: foundUser.role,
      };

      // Create a JWT with the payload
      // jwt.sign(payload, secretKey, options)
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "12h",
      });

      // Send the response
      res.status(200).json({ authToken: authToken });
    } else if (!passwordCorrect) {
      res.status(401).json({ message: "Unable to login the user" }); // Unathorized
    }
  } catch (error) {
    next(error);
  }
});

// * GET /auth/verify  - Verify tokens stored in the frontend - Tested successfully
router.get("/auth/verify", isAuthenticated, async (req, res, next) => {
  try {
    // If JWT is valid the payload gets decoded by isAuthenticated middleware
    // and made available on req.payload

    // Send back the object with the user data
    // previously saved as the token payload
    res.status(200).json(req.payload);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
