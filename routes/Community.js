const express = require("express");
const router = express.Router();

const {
  CreateCommunity,
  GetAllCommunity,
  GetAllMembers,
  GetMyOwnedCommunity,
  GetMyJoinedCommunity,
} = require("../controllers/Community");

router.post("/community", CreateCommunity);

router.get("/community", GetAllCommunity);

router.get("/community/:id/members", GetAllMembers);

router.get("/community/me/owner", GetMyOwnedCommunity);

router.get("/community/me/member", GetMyJoinedCommunity);

module.exports = router;
