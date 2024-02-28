const mongoose = require("mongoose");
const { Snowflake } = require("@theinternetfolks/snowflake");

const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    default: function () {
      return Snowflake.generate();
    },
    index: { unique: true },
  },
  name: {
    type: String,
    maxlength: 128,
    required: true,
  },
  slug: {
    type: String,
    maxlength: 255,
    unique: true,
    required: true,
  },
  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User", // Reference to the User model
  // },
  owner: {
    id: String,
    name: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("community", communitySchema);
