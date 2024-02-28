const Community = require("../models/Community");
const Member = require("../models/Member");
const User = require("../models/User");
const Role = require("../models/Role");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.CreateCommunity = async (req, res) => {
  try {
    const token =
      req.header("Authorization") &&
      req.header("Authorization").replace("Bearer", "").trim();

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is missing",
      });
    }

    const { name } = req.body;

    const user = await User.findOne({ token });
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      return res.status(400).json({
        error: "Please SignIn First",
      });
    }

    const role = await Role.findOne({ name: "Community Admin" });

    if (!role) {
      return res.status(400).json({
        error: "Role not found",
      });
    }

    const community = await Community.create({
      name,
      slug: name.toLowerCase(),
      owner: { id: user.id, name: user.name },
    });

    await Member.create({
      community: community.id,
      user: user.id,
      role: role.id,
    });

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: community.id,
          name: community.name,
          slug: community.slug,
          owner: community.owner.id,
          created_at: community.created_at,
          updated_at: community.updated_at,
        },
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed To Create Community, Try Again!",
    });
  }
};

// Get All Community Handler

exports.GetAllCommunity = async (req, res) => {
  const perPage = 10;
  const page = parseInt(req.query.page) || 1;

  try {
    // get total count of communities
    const total = await Community.countDocuments();

    const communities = await Community.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    const formattedCommunities = communities.map((community) => ({
      id: community.id,
      name: community.name,
      slug: community.slug,
      owner: { id: community.owner.id, name: community.owner.name },
      created_at: community.created_at,
      updated_at: community.updated_at,
    }));

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          pages: Math.ceil(total / perPage),
          page,
        },
        data: formattedCommunities,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the community",
    });
  }
};

// GetAllMember
exports.GetAllMembers = async (req, res) => {
  const perPage = 10;
  const page = parseInt(req.query.page) || 1;
  try {
    const total = await Member.countDocuments();

    const members = await Member.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    console.log("m members data ho", members);

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          pages: Math.ceil(total / perPage),
          page,
        },
        members,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the Memebers",
    });
  }
};

// GetMyOwnedCommunity Handler
exports.GetMyOwnedCommunity = async (req, res) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;

    const token =
      req.header("Authorization") &&
      req.header("Authorization").replace("Bearer", "").trim();

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is missing",
      });
    }

    const user = await User.findOne({ token });

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      return res.status(400).json({
        error: "Please SignIn First",
      });
    }

    const total = await Community.countDocuments({
      "owner.id": user.id,
    });

    const communities = await Community.find({ "owner.id": user.id })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const formattedCommunities = communities.map((community) => ({
      id: community.id,
      name: community.name,
      slug: community.slug,
      owner: community.owner.id,
      created_at: community.created_at,
      updated_at: community.updated_at,
    }));

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          pages: Math.ceil(total / perPage),
          page,
        },
        data: formattedCommunities,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "failed to fetch communities that you owned",
    });
  }
};

//GetMyJoinedCommunity Handler

exports.GetMyJoinedCommunity = async (req, res) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;

    const token =
      req.header("Authorization") &&
      req.header("Authorization").replace("Bearer", "").trim();

    const user = await User.findOne({ token });

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const total = await Member.countDocuments({ user: user.id });

    console.log("m total ho", total);

    const members = await Member.find({ user: user.id });

    const joinedCommunity = await Community.find({ user: members.id });

    const formattedCommunities = joinedCommunity.map((community) => ({
      id: community.id,
      name: community.name,
      slug: community.slug,
      owner: community.owner.id,
      created_at: community.created_at,
      updated_at: community.updated_at,
    }));

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          page: Math.ceil(total / perPage),
          page,
        },
        data: formattedCommunities,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "failed to fetch your joined Community",
    });
  }
};
