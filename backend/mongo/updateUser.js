const COD = require("../cod")
const User = require("./schema")

const updateUser = async (player, platform) => {
  try {
    COD.login()
    const data = await COD.getData(player, platform)
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
    return User.updateOne({ username: data.username }, db_player, {}, (err, res) => {
      if (err) {
        console.error(err)
      } else {
        console.log("user updated")
      }
    })
  } catch (err) {
    console.error(err)
  }
}

module.exports = updateUser
