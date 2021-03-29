require("dotenv").config()
const API = require("call-of-duty-api")()
// log in to call-of-duty
const codLogin = async () => {
  try {
    await API.login(process.env.EMAIL, process.env.PASSWORD)
    let data = await API.isLoggedIn()
    console.log(`User logged in - ${data}`)
  } catch (err) {
    console.log(err)
  }
}

const getData = async (user, platform) => {
  let data
  try {
    data = await API.MWwz(user, platform)
    // console.log(data)
  } catch (error) {
    console.error(error)
  }
  return data
}
module.exports = { codLogin, getData }
