const API = require("call-of-duty-api")()
// log in to call-of-duty
const login = async (email, password) => {
  try {
    let login = await API.login(email, password)
    console.log(login)
    return login
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
