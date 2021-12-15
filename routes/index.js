const router = require("express").Router();

const fileUploader = require("../config/cloudinary.config");

// POST "/api/upload" => Route that will receive an image, send it to Cloudinary via the fileUploader and return the image URL
router.post("/api/upload", fileUploader.single("imageURL"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ secure_url: req.file.path });
});

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
