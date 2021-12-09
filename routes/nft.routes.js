const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Nft = require("../models/nft.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");

// * Upload NFT - Tested successfully
router.post("/api/nfts", isAuthenticated, async (req, res, next) => {
  try {
    // Get data from request body
    const { name, nftURL } = req.body;

    // Save data in DB
    const createdNft = await Nft.create({ name, nftURL });

    res.status(201).json(createdNft);
  } catch (error) {
    res.status(404).json(error);
  }
});

// * Get all NFTs - Tested successfully
router.get("/api/nfts", async (req, res, next) => {
  try {
    const allNfts = await Nft.find();

    res.status(200).json(allNfts);
  } catch (error) {
    res.status(500).json(error);
  }
});

// * Get a specific NFT - when you click on any NFT Card - Tested successfully
router.get("/api/nfts/:nftId", async (req, res, next) => {
  try {
    // Get nft id from the URL
    const { nftId } = req.params;

    // Validate the passed id
    if (!mongoose.Types.ObjectId.isValid(nftId)) {
      res.status(400).json({ message: "Invalid object ID" });
      return;
    }

    // Make DB query to find the NFT
    const foundNft = await Nft.findById(nftId);

    res.status(200).json(foundNft);
  } catch (error) {
    res.status(500).json(error);
  }
});

// List a NFT on main page - when you "list" a NFT from your profile
router.post("/api/nfts/:nftId", isAuthenticated, async (req, res, next) => {});

// Delete / Delist NFT from main page - when you "delist" a NFT from your profile
router.delete("/api/nfts/:nftId", isAuthenticated, async (req, res, next) => {});

module.exports = router;
