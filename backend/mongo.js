const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
mongoose.Promise = global.Promise
const mongoURI = `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASSWORD}@cluster0.wf0u5.mongodb.net/userDatabase?retryWrites=true&w=majority`
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection

module.exports = db
