const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    // Format: fieldname-timestamp.ext
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File validation filter
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|avif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images only! (.jpg, .jpeg, .png, .webp, .avif)"));
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// ----- UPLOAD IMAGE ENDPOINT -----
// POST /api/upload
// Note: We upload to local 'uploads/' folder and return the URL path.
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  // Return the path that the frontend can use (e.g., /uploads/image-12345.jpg)
  res.json({
    message: "Image uploaded successfully",
    image: `/${req.file.path.replace(/\\/g, "/")}`, // normalize path slashes for windows
  });
});

module.exports = router;
