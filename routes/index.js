const router = require("express").Router();

const fileUploader = require("../config/cloudinary.config");

// POST "/api/upload" => Route that will receive an image, send it to Cloudinary via the fileUploader and return the image URL
router.post("/api/upload", fileUploader.single("imageURL"), (req, res, next) => {
  // console.log("file is: ", req.file)

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'secure_url' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ secure_url: req.file.path });
});

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
