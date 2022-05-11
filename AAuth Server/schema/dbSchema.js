const mongose = require("mongoose");

const dbSchema = mongose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongose.model("edit", dbSchema);
