const express = require('express');
const router = express.Router();
const authController = require("../Controllers/AuthController");
const dotenv = require('dotenv');

dotenv.config();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;