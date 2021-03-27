require("dotenv").config()
const { urlencoded } = require("express")
const express = require("express")
const app = express()
const COD = require("./backend/cod")
const User = require("./backend/mongo/schema")
const db = require("./backend/mongo/mongo")
const updateUser = require("./backend/mongo/updateUser")

COD.login()
app.use(express.static(__dirname + "/public"))
app.use(urlencoded({ extended: false }))
app.use(express.json())

// mongodb
db.on("error", () => console.log("couldnt connect"))
db.once("open", () => {
  console.log("we are connected")
})
app.post("/compare/:name", async (req, res) => {
  try {
    COD.login()
    //split name and platform
    const player = req.params.name.split(",")
    const playerName = player[0].toLowerCase()
    const platform = player[1]
    const data = await COD.getData(playerName, platform)
    const ws = data.weekly.all.properties
    const cod_data = {
      username: data.username,
      wins: ws.wins || 0,
      kills: ws.kills,
      deaths: ws.deaths,
      assists: ws.assists,
      kdRatio: ws.kdRatio,
      matchesPlayed: ws.matchesPlayed,
      timePlayed: ws.timePlayed,
    }
    User.findOne({ username: player[0] }, (err, db_data) => {
      if (db_data) {
        res.json([cod_data, db_data]) // send both data from db and cod api
      } else {
        res.json([cod_data, cod_data]) // send only cod-api if there is no data in db
        updateUser(playerName, platform) // add data to db
      }
    })
  } catch (err) {
    res.json(err)
    console.log("data not found")
  }
})

app.post("/update/:playername", async (req, res) => {
  try {
    const player = req.params.playername.split(",")
    console.log(player)

    updateUser(player[0], player[1])
    res.json("player data updated")
  } catch (err) {
    res.json(err.message)
  }
})

app.listen(3000, () => console.log("running on port 3000"))
