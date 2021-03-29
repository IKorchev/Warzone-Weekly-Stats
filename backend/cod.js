require("dotenv").config()
const API = require("call-of-duty-api")()
const email = process.env.EMAIL
const password = process.env.PASSWORD
// log in to call-of-duty
const codLogin = async () => {
  try {
    await API.login(email, password)
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
