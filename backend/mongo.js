require("dotenv").config()
const mongoose = require("mongoose")
mongoose.Promise = global.Promise
mongoose.connect(
  `mongodb+srv://korchev:${process.env.MONGO_PASSWORD}@cluster0.wf0u5.mongodb.net/userDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
const db = mongoose.connection

module.exports = db
