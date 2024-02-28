const mongoose = require("mongoose");
const { Snowflake } = require("@theinternetfolks/snowflake");

const roleSchema = new mongoose.Schema({
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
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("role", roleSchema);
