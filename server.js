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
app.get("/compare/:name", async (req, res) => {
  User.findOne({ username: req.params.name }, (err, player) => {
    console.log(player)
    res.send(player)
    console.log(err)
  })
})

app.post("/send/:userinfo", async (req, res) => {
  const player = req.params.userinfo.split(",")
  const data = await COD.getData(player[0], player[1])
  const weeklyStats = data.weekly.all.properties
  const alltimeStats = data.lifetime.all.properties

  const userDataNeeded = {
    username: data.username,
    level: data.level,
    wins: alltimeStats.wins || 0,
    weekly: {
      wins: weeklyStats.wins || 0,
      kills: weeklyStats.kills,
      deaths: weeklyStats.deaths,
      assists: weeklyStats.assists,
      kdRatio: weeklyStats.kdRatio,
      gamesPlayed: weeklyStats.matchesPlayed,
      timePlayed: weeklyStats.timePlayed,
    },
    lifetime: {
      wins: alltimeStats.wins || 0,
      kills: alltimeStats.kills,
      deaths: alltimeStats.deaths,
      assists: alltimeStats.assists,
      kdRatio: alltimeStats.kdRatio,
      gamesPlayed: alltimeStats.gamesPlayed,
      timePlayed: alltimeStats.timePlayed,
      losses: alltimeStats.losses,
    },
  }
  // create user in the database in
  // order to make a comparison later
  // User.create(userData).then((data) => {
  //   console.log(data)
  // })
  //send current data back
  res.json(userDataNeeded)
})
app.listen(3000, () => console.log("running on port 3000"))
