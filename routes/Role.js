const express = require("express");
const router = express.Router();

const { Role, GetRole } = require("../controllers/Role");

router.post("/role", Role);

router.get("/role", GetRole);

module.exports = router;
