const jwt = require("jsonwebtoken");
const Member = require("../models/Member");
const Community = require("../models/Community");
const User = require("../models/User");
const Role = require("../models/Role");
const { Types } = require("mongoose");

require("dotenv").config();

// Add Member
exports.AddMember = async (req, res) => {
  try {
    const { community, user, role } = req.body;

    // Check if the community, user, and role are provided
    if (!community || !user || !role) {
      return res.status(400).json({
        success: false,
        message: "Community, user, and role are required",
      });
    }

    const token =
      req.header("Authorization") &&
      req.header("Authorization").replace("Bearer", "").trim();

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is missing",
      });
    }

    const newMember = await Member.create({
      community: community,
      user: user,
      role: role,
    });

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: newMember.id,
          community: newMember.community,
          user: newMember.user,
          role: newMember.role,
          created_at: newMember.created_at,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in Adding Member",
    });
  }
};

// DeleteMember Handler
exports.DeleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;

    console.log("m member ID ho", memberId);

    const token =
      req.header("Authorization") &&
      req.header("Authorization").replace("Bearer", "").trim();

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is missing",
      });
    }
    const member = await Member.findByIdAndDelete(memberId);
    if (!member) {
      return res.status(400).json({
        error: "Member not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Member Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in deleting Member",
    });
  }
};
