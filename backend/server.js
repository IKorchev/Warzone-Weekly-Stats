require("dotenv").config()
const { urlencoded } = require("express")
const express = require("express")
const app = express()
const COD = require("./cod")
const User = require("./schema")
const db = require("./mongo")
const updateUser = require("./updateUser")
const Player = require("./Player")
const path = require("path")
const publicPath = path.join(__dirname, "../public")
const PORT = process.env.PORT || 3000

// middleware
app.use(express.static(publicPath))
app.use(urlencoded({ extended: false }))
app.use(express.json())

// mongodb
db.on("error", (err) => console.log(err + " couldnt connect"))
db.once("open", () => {
  console.log("we are connected")
})

COD.login()

app.post("/search/:name", async (req, res) => {
  try {
    COD.login()
    //split name and platform
    const playerInfo = req.params.name.split(",")
    const playerName = playerInfo[0].toLowerCase()
    const platform = playerInfo[1]
    const data = await COD.getData(playerName, platform)
    const player = new Player(data)
    // check if player is in the database
    User.findOne({ username: player.username }, (err, db_data) => {
      if (db_data) {
        res.json([player, db_data]) // send both data from db and cod api
      } else {
        res.json([player, player]) // send only cod-api if there is no data in db
        updateUser(player.username, platform) // add data to db
      }
    })
  } catch (err) {
    res.json(err)
    console.log("data not found")
  }
})

app.post("/update/:playername", async (req, res) => {
  try {
    const playerInfo = req.params.playername.split(",")
    const playerName = playerInfo[0]
    const playerPlatform = playerInfo[1]
    const result = await updateUser(playerName, playerPlatform)
    if (result !== undefined) {
      res.sendStatus(200)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(err)
  }
})

app.listen(PORT, () => console.log(`running on port ${PORT}`))
