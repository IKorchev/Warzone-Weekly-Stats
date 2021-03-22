const { urlencoded } = require("express")
const express = require("express")
const app = express()
const API = require("call-of-duty-api")()
require("dotenv").config()
;(async () => {
  try {
    await API.login(process.env.EMAIL, process.env.PASSWORD)
  } catch (err) {
    console.log(err)
  }
})()

const getData = async (user, platform) => {
  let data
  try {
    data = await API.MWweeklystats(user, platform)
  } catch (error) {
    console.log(error)
  }
  return data
}

app.use(express.static(__dirname + "/public"))
app.use(express.json())
app.use(urlencoded())

app.post("/send", async (req, res) => {
  console.log(req.body)
  const data = await getData(req.body.user, req.body.platform)
  res.json(data)
})
app.listen(3000, () => console.log("running on port 3000"))
