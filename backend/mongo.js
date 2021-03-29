require("dotenv").config()
const mongoose = require("mongoose")
const MONGO_NAME = process.env.MONGO_NAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
mongoose.Promise = global.Promise
mongoose.connect(
  `mongodb+srv://${MONGO_NAME}:${MONGO_PASSWORD}@cluster0.wf0u5.mongodb.net/userDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
const db = mongoose.connection

module.exports = db
