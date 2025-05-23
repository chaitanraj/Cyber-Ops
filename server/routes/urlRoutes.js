const express = require("express");
const { urlCheckController, getUrl } = require("../controller/urlController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", urlCheckController); 
router.get("/get-url", getUrl);

module.exports = router;
