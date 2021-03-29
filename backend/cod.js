require("dotenv").config()
const API = require("call-of-duty-api")()
// log in to call-of-duty
const login = async () => {
  try {
    await API.login(process.env.EMAIL, process.env.PASSWORD)
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
module.exports = { login, getData }
