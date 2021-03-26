require("dotenv").config()
const { urlencoded } = require("express")
const express = require("express")
const app = express()
const COD = require("./backend/cod")
const db = require("./backend/mongo/mongo")
const User = require("./backend/mongo/schema")

COD.login()
app.use(express.static(__dirname + "/public"))
app.use(urlencoded({ extended: false }))
app.use(express.json())
db.on("error", () => console.log("couldnt connect"))
db.once("open", () => {
  console.log("we are connected")
})
app.post("/compare/:name", async (req, res) => {
  try {
    COD.login()
    const player = req.params.name.split(",")
    const data = await COD.getData(player[0], player[1])
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
      if (player) {
        res.json([cod_data, db_data])
      } else {
        updateUser(player[0], player[1])
        res.json([cod_data, cod_data])
      }
    })
  } catch (err) {
    console.log(err)
  }
})

app.post("/update/:playername", async (req, res) => {
  try {
    const player = req.params.playername.split(",")
    updateUser(player[0], player[1])
    res.send("data updated")
  } catch (err) {
    res.send("unable to update")
  }
})

const updateUser = async (player, platform) => {
  COD.login()
  const data = await COD.getData(player, platform)
  console.log(data)
  const ws = data.weekly.all.properties
  const db_player = {
    username: data.username,
    wins: ws.wins || 0,
    kills: ws.kills,
    deaths: ws.deaths,
    assists: ws.assists,
    kdRatio: ws.kdRatio,
    matchesPlayed: ws.matchesPlayed,
    timePlayed: ws.timePlayed,
  }
  // create user in the database in
  // order to make a comparison later
  return User.update(
    { username: data.username },
    db_player,
    { overwrite: true, upsert: true, multi: false },
    (err, res) => {
      console.log(res, err)
    }
  )
}
app.listen(3000, () => console.log("running on port 3000"))
