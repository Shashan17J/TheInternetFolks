const express = require("express");
const router = express.Router();

const { AddMember, DeleteMember } = require("../controllers/Member");

router.post("/member", AddMember);

router.delete("/member/:id", DeleteMember);

module.exports = router;
