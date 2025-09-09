const express = require("express");
const { urlCheckController, getUrl,extensionUrlCheck } = require("../controller/urlController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", urlCheckController); 
router.get("/get-url", getUrl);

// In your controller file
router.post("/check-url", extensionUrlCheck); // Reuse existing controller

module.exports = router;
