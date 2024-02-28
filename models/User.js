const mongoose = require("mongoose");
const { Snowflake } = require("@theinternetfolks/snowflake");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: function () {
      return Snowflake.generate();
    },
    index: { unique: true },
  },

  name: {
    type: String,
    default: null,
    maxlength: 64,
    required: true,
  },
  email: {
    type: String,
    maxlength: 128,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    maxlength: 64,
    required: true,
  },
  token: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("user", userSchema);
