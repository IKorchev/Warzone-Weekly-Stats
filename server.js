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
    if (player !== null) {
      res.send(player)
    } else {
      res.send(null)
    }
  })
})

app.post("/update/:playername", async (req, res) => {
  const player = req.params.playername.split(",")
  const data = await COD.getData(player[0], player[1])
  const ws = data.weekly.all.properties
  const as = data.lifetime.all.properties

  const userDataNeeded = {
    username: data.username,
    level: data.level,
    wins: as.wins || 0,
    weekly: {
      wins: ws.wins || 0,
      kills: ws.kills,
      deaths: ws.deaths,
      assists: ws.assists,
      kdRatio: ws.kdRatio,
      gamesPlayed: ws.matchesPlayed,
      timePlayed: ws.timePlayed,
    },
  }
  User.findOneAndReplace({ username: player[0] }, userDataNeeded, {}, (err, doc) => {
    console.log(doc)
  })
  res.json(req.params.playername)
})
app.post("/send/:userinfo", async (req, res) => {
  const player = req.params.userinfo.split(",")
  const data = await COD.getData(player[0], player[1])
  const ws = data.weekly.all.properties
  const as = data.lifetime.all.properties

  const userDataNeeded = {
    username: data.username,
    level: data.level,
    wins: as.wins || 0,
    weekly: {
      wins: ws.wins || 0,
      kills: ws.kills,
      deaths: ws.deaths,
      assists: ws.assists,
      kdRatio: ws.kdRatio,
      gamesPlayed: ws.matchesPlayed,
      timePlayed: ws.timePlayed,
    },
    lifetime: {
      wins: as.wins || 0,
      kills: as.kills,
      deaths: as.deaths,
      assists: as.assists,
      kdRatio: as.kdRatio,
      gamesPlayed: as.gamesPlayed,
      timePlayed: as.timePlayed,
      losses: as.losses,
    },
  }
  // create user in the database in
  // order to make a comparison later
  User.create(userDataNeeded).then((data) => {
    console.log(data)
  })
  // send current data back
  res.json(userDataNeeded)
})

app.listen(3000, () => console.log("running on port 3000"))
