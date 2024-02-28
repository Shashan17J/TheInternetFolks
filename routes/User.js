const express = require("express");
const router = express.Router();

const { SignUp, SignIn, GetMe } = require("../controllers/User");

router.post("/signup", SignUp);

router.post("/signin", SignIn);

router.get("/me", GetMe);

module.exports = router;
