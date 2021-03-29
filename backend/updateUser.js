const { codLogin, getData } = require("./cod")
const Player = require("./Player")
const User = require("./schema")

const updateUser = async (name, platform) => {
  await codLogin()
  const data = await getData(name, platform)
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
  return "no data found"
}

module.exports = updateUser
