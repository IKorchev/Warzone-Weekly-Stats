const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userData = new Schema(
  {
    username: { type: String },
    wins: { type: Number },
    kills: { type: Number },
    deaths: { type: Number },
    assists: { type: Number },
    kdRatio: { type: Number },
    matchesPlayed: { type: Number },
    timePlayed: { type: Number },
  },
  { timestamps: true }
)

const User = mongoose.model("user", userData)
module.exports = User
