const mongoose = require("mongoose");
const { Snowflake } = require("@theinternetfolks/snowflake");

const memberSchema = new mongoose.Schema({
  id: {
    type: String,
    default: function () {
      return Snowflake.generate();
    },
    index: { unique: true },
  },
  community: {
    type: mongoose.Schema.Types.String,
    ref: "Community",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.String,
    ref: "Role",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("member", memberSchema);
