const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //   Validation
    if (!name || !email || !password) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const accesstoken = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    user.token = accesstoken;
    await user.save();

    return res.status(200).json({
      success: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        meta: {
          access_token: accesstoken,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registerd. Please try again",
    });
  }
};

// signin handler
exports.SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    //   Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Filed are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is registered with us Please SignUp first",
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        meta: {
          access_token: user.token,
        },
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "SignIn Failure Please try again",
    });
  }
};

// GetMe Handler

exports.GetMe = async (req, res) => {
  const token =
    req.header("Authorization") &&
    req.header("Authorization").replace("Bearer", "").trim();

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is missing",
    });
  }

  try {
    const user = await User.findOne({ token });
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "You are not signed in, Signed in first",
    });
  }
};
