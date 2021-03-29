const COD = require("./cod")
const Player = require("./Player")
const User = require("./schema")

const updateUser = async (name, platform) => {
  COD.login()
  const data = await COD.getData(name, platform)
  if (data != undefined) {
    const player = new Player(data)

    // create user in the database in
    // order to make a comparison later
    //prettier-ignore
    return User.updateOne(
      { username: player.username },  player, { upsert: true }, (err, res) => {
        if (err) {
          console.log("Couldn't update player")
        } else {
          console.log("Player updated")
        }
      }
    )
  }
  return undefined
}

module.exports = updateUser
