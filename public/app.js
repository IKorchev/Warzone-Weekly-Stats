// SELECTORS
const form = document.querySelector("form")
const user = document.querySelector("#username")
const usernumber = document.querySelector("#usernumber")
const compare = document.querySelector("#compare")
const saveButton = document.querySelector("#save")
const plat = document.querySelector("#plat")
const weeklyStatsContainer = document.querySelector("#weekly-stats")
const allTimeStatsContainer = document.querySelector("#all-time-stats")
const playerContainer = document.querySelector("#player-container")
const weeklyCollapse = document.getElementById("collapseOne")
const accordion = document.querySelector(".accordion")
let platform = ""
// collapsible
const collapse = new bootstrap.Collapse(weeklyCollapse, {
  toggle: false,
})
// SPINNER HTML
const spinnerHTML = `
  <div class="spinner-border text-info mt-5" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`

saveButton.addEventListener("click", async (e) => {
  e.preventDefault()
  // TODO: store user input in variables
  const name = "aventus%2321742"
  const platform = "battle"
  const response = await fetch(`/update/${name.toLowerCase()},${platform}`, {
    method: "POST",
  })
  console.log(response)
})
form.addEventListener("submit", async (e) => {
  e.preventDefault()
  // send user info to server to make the api call
  const player = `${user.value}%23${usernumber.value}`
  platform = plat.value
  playerContainer.innerHTML = spinnerHTML
  try {
    // FETCH DATA FROM API
    const res = await fetch(`/compare/${player},${platform}`, { method: "POST" })
    const data = await res.json()
    const coddata = data[0]
    const dbdata = data[1]
    setupUI(coddata, dbdata) // set up the ui
  } catch (err) {
    setupUI()
    console.log(err) // set up the ui
  } finally {
    form.reset()
  }
})

const chooseColor = (num1, num2) => {
  let info = {}
  if (num1 > num2) {
    info = { color: "text-success", icon: "bi-arrow-up-short" }
    return info
  }
  if (num1 < num2) {
    info = { color: "text-danger", icon: "bi-arrow-down-short" }
    return info
  }
  if (num1 === num2) {
    info = { color: "text-info", icon: "" }
    return info
  }
}

// Show the user what changed since last time he checked his data
const makeComparisonCards = (cod, db) => {
  try {
    //prettier-ignore
    const codStats = [
      {
        name: "Kills",
        number: db.kills,
        info: chooseColor(db.kills, cod.kills),
      },
      {
        name: "Deaths",
        number: db.deaths,
        info: chooseColor(cod.deaths, db.deaths), // has to be reverse cuz the color indicates less deaths(meaning better performance of the player)
      },
      {
        name: "Assists",
        number: db.assists,
        info: chooseColor(db.assists, cod.assists),
      },
      {
        name: "KD Ratio",
        number: db.kdRatio.toFixed(2),
        info: chooseColor(db.kdRatio, cod.kdRatio),
      },
      {
        name: "Games Played",
        number: db.gamesPlayed,
        info: chooseColor(db.gamesPlayed, cod.matchesPlayed),
      },
      { name: "Wins",
        number: db.wins || 0,
        info: chooseColor(db.wins, cod.wins || 0) 
      },
      {
        name: "Time played",
        number: parseInt((db.timePlayed / 3600).toFixed(2)) + "hours",
        info: chooseColor(db.timePlayed, cod.timePlayed),
      },
    ]

    let html = ""
    codStats.forEach((object) => {
      const color = object.info.color
      const icon = object.info.icon
      console.log(object)
      html += `<div class="col-sm-3 my-3 text-center"><h5>${object.name}</h5>
      <h5 class="${color}">${object.number} <i class="bi ${icon}"></i></h5>
      </div>`
    })
    return `<div class="row gx-0 justify-content-center align-items-center">${html}</div>`
  } catch (err) {
    console.log(err)
    return `<h5> Couldn't find enough data </h5>`
  }
}

// ON FORM SUBMISSION

// DISPLAY USER OR ALERT
// prettier-ignore
const setUserHtml = (user) => {
  if(Object.keys(user) != 0) {
 return `<h5 class="player text-center border border-info text-uppercase"><i class="bi bi-person"></i>${user.username}</h5>
  <h5 class="player text-center border border-info"><i class="bi bi-trophy"></i> Wins: ${user.wins.toLocaleString("en-UK") || 0} </h5>`
} else {
  return `<div class="alert alert-danger mt-5 mx-auto">
      <h5 class="text-center ">Unable to find user (misconfigured privacy settings)</h5>
    </div>`
}}

// UI
const setupUI = (cod_data, db_data) => {
  let playerInfo = {}
  if (cod_data && db_data) {
    playerInfo = {
      username: cod_data.username,
      wins: cod_data.wins,
    }
    accordion.classList.remove("visually-hidden")
    allTimeStatsContainer.innerHTML = makeComparisonCards(db_data, cod_data)
    weeklyStatsContainer.innerHTML = makeComparisonCards(cod_data, db_data)
    playerContainer.innerHTML = setUserHtml(playerInfo)
    collapse.show()
  } else {
    accordion.classList.add("visually-hidden")
    playerContainer.innerHTML = setUserHtml(playerInfo)
    collapse.hide()
  }
}
