// SELECTORS
const form = document.querySelector("form")
const user = document.querySelector("#username")
const usernumber = document.querySelector("#usernumber")
const plat = document.querySelector("#plat")
const weeklyStatsContainer = document.querySelector("#weekly-stats")
const allTimeStatsContainer = document.querySelector("#all-time-stats")
const playerContainer = document.querySelector("#player-container")
const weeklyCollapse = document.getElementById("collapseOne")
const accordion = document.querySelector(".accordion")

// collapsible
const collapse = new bootstrap.Collapse(weeklyCollapse, {
  toggle: false,
})
// SPINNER HTML
const spinnerHTML = `
  <div class="spinner-border text-info mt-5" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`

// ON FORM SUBMISSION
form.addEventListener("submit", async (e) => {
  e.preventDefault()
  const userandplat = {
    user: `${user.value}#${usernumber.value}`,
    platform: plat.value,
  }
  playerContainer.innerHTML = spinnerHTML
  try {
    // FETCH OPTIONS
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userandplat),
    }
    // FETCH DATA FROM API
    const response = await fetch(`/send`, options)
    const data = await response.json()
    setupUI(data) // set up the ui based on data received
  } catch (err) {
    setupUI() // set up the ui based on data received
  } finally {
    form.reset() 
  }
})

// MAKE CARDS FROM USER STATS
const makeStatsCard = (data, WeeklyOrAlltime) => {
  const lifetime = data.lifetime.all.properties
  const weekly = data.weekly.all.properties
  // PLAYER ALL TIME DATA
  const allTimeStats = [
    [
      { name: "Kills", number: lifetime.kills },
      { name: "Deaths", number: lifetime.deaths },
      { name: "Assists", number: lifetime.assists },
      { name: "KD Ratio", number: lifetime.kdRatio.toFixed(2) },
    ],
    [
      { name: "Games Played", number: lifetime.gamesPlayed },
      { name: "Wins", number: lifetime.wins },
      { name: "Losses", number: lifetime.losses },
      { name: "Win/Loss Ratio", number: lifetime.wlRatio.toFixed(2) },
    ],
  ]
  // PLAYER WEEKLY DATA
  const weeklyStats = [
    [
      { name: "Kills", number: weekly.kills },
      { name: "Deaths", number: weekly.deaths },
      { name: "Assists", number: weekly.assists },
      { name: "KD Ratio", number: weekly.kdRatio.toFixed(2) },
    ],
    [
      { name: "Games Played", number: weekly.matchesPlayed },
      { name: "Wins", number: weekly.wins || 0 },
      { name: "Losses", number: weekly.matchesPlayed - (weekly.wins || 0) },
      { name: "Time played", number: `${(weekly.timePlayed / 3600).toFixed(2)} hours` },
    ],
  ]

  // RETURN VALUE AS NEEDED
  if (WeeklyOrAlltime === "weekly") {
    return makeRows(weeklyStats)
  } else if (WeeklyOrAlltime === "alltime") {
    return makeRows(allTimeStats)
  }
}

// WRAP EVERY ARRAY OF OBJECTS IN A DIV (ROW)

const makeRows = (arr) => {
  let wrappedArr = ""
  // prettier-ignore
  arr.forEach(array => { 
    let myItem = array.map(item => `<div class="col text-center"><h6>${item.name}</h6><h6>${item.number}</h6></div>`)
    wrappedArr += `<div class="card-body row">${myItem}</div>`
  })
  const html = wrappedArr.split(",").join(" ")
  return html
}

// DISPLAY USER OR ALERT
// prettier-ignore
const setUserHtml = (user) => {
  if(Object.keys(user) != 0) {
 return `<h5 class="player text-center border border-info text-uppercase"><i class="bi bi-person"></i> ${user.username}</h5>
  <h5 class="player text-center border border-info">Level: ${user.level}</h5>
  <h5 class="player text-center border border-info"><i class="bi bi-trophy"></i> Wins: ${user.wins.toLocaleString("en-UK") || 0} </h5>`
} else {
  return `<div class="alert alert-danger mt-5 mx-auto">
      <h5 class="text-center ">Unable to find user (misconfigured privacy settings)</h5>
    </div>`
}}

// UI
const setupUI = (data) => {
  let playerInfo = {}
  if (data) {
    playerInfo = {
      username: data.username,
      level: data.level,
      wins: data.lifetime.all.properties.wins.toLocaleString("en-UK"),
    }
    accordion.classList.remove("visually-hidden")
    allTimeStatsContainer.innerHTML = makeStatsCard(data, "alltime")
    weeklyStatsContainer.innerHTML = makeStatsCard(data, "weekly")
    playerContainer.innerHTML = setUserHtml(playerInfo)
    collapse.show()
  } else {
    accordion.classList.add("visually-hidden")
    playerContainer.innerHTML = setUserHtml(playerInfo)
    collapse.hide()
  }
}
