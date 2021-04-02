// SELECTORS
const form = document.querySelector("form")
const username = document.querySelector("#username")
const playerNotFoundAlert = document.querySelector("#alert")
const summary = document.querySelector("#summary")
const saveButton = document.querySelector("#save")
const saveContainer = document.querySelector("#save-container")
const spinner = document.querySelector("#spinner")
const platform = document.querySelector("#plat")
const currentStatsContainer = document.querySelector("#current-stats")
const previousStatsContainer = document.querySelector("#previous-stats")
const playerContainer = document.querySelector("#player-container")
const lastUpdated = document.querySelector("#last-updated")
const accordion = document.querySelector(".accordion")
const playerFoundElements = document.querySelectorAll(".player-found")
let playerName = ""
let platformValue = ""
// update database info

// determine what color the number should be based on stats (green - better, red - worse)
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

//prettier-ignore

// Make objects from data and return cards
const createCardsWithData = (cod, db) =>{ 
  console.log(cod,db)
  const arrayOfObjects = [
  {
    name: "Kills",
    number: db.kills,
  },
  {
    name: "Deaths",
    number: db.deaths,
  },
  {
    name: "Assists",
    number: db.assists,
  },
  {
    name: "KD Ratio",
    number: db.kdRatio.toFixed(2),
  },
  {
    name: "Games Played",
    number: db.matchesPlayed,
  },
  { name: "Wins",
    number: db.wins || 0,
  },
  {
    name: "Time played",
    number: db.timePlayed.toFixed() + " hours",
  },
]
return makeCards(arrayOfObjects)
}

// make html cards for dom from objects
const makeCards = (arrayOfObjects) => {
  //if no data found
  if (arrayOfObjects.length === 0) {
    return `<h5> Couldn't find enough data </h5>`
  }
  let html = ""
  arrayOfObjects.forEach((object) => {
    html += `
    <div class="col-sm-3 m-1 text-center border border-info p-2"><h6>${object.name}</h6>
      <h5 class="">${object.number} <i class="bi"></i></h5>
    </div>`
  })
  return `<div class="row gx-0 justify-content-center align-items-center">${html}</div>`
}

// choose color based on stats difference (better or worse performance)
const textColor = (c, d) => {
  if (c > d) {
    return "text-success"
  }
  if (c < d) {
    return "text-danger"
  }
  return ""
}

//prettier-ignore
//create a summary string
const makeResultsSummaryString = (coddata, dbdata) => {
  
}

// Format timestamp from database
const makeDate = (dateStr) => {
  if (dateStr) {
    let date = new Date(dateStr)
    return `${date.toLocaleDateString()} ${date.toTimeString().slice(0, 8)}`
  }
  return "Now"
}

// update data in database
saveButton.addEventListener("click", async (e) => {
  e.preventDefault()
  const response = await fetch(`/update/${playerName},${platformValue}`, {
    method: "POST",
  })
  if (response.status === 200) {
    document.querySelector("#successful-update").classList.remove("visually-hidden")
    setTimeout(() => {
      document.querySelector("#successful-update").classList.add("visually-hidden")
    }, 3500)
  }
})

// form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault()
  // send user info to server to make the api call
  playerName = username.value.toLowerCase().replace("#", "%23")
  platformValue = platform.value
  playerNotFoundAlert.classList.add("visually-hidden")
  spinner.classList.remove("visually-hidden")
  try {
    // FETCH DATA FROM API
    const res = await fetch(`/search/${playerName},${platformValue}`, { method: "POST" })
    const data = await res.json()
    const coddata = data[0]
    const dbdata = data[1]
    setupUI(coddata, dbdata) // set up the ui
  } catch (err) {
    setupUI() // set up the ui
  } finally {
    form.reset()
  }
})

// Show user or alert
//prettier-ignore
const setUserSummaryHtml = (coddata, dbdata) => {
  let html = ""
  if (coddata && dbdata) {
      document.querySelector('#player-name').innerHTML = coddata.username
      document.querySelector('#player-wins').innerHTML = `WINS: ${coddata.wins}`
      const c = coddata
      const d = dbdata
      html = `
      Since the last stats update
      <span class="text-uppercase fw-bold">${c.username}</span> played ${c.matchesPlayed - d.matchesPlayed} games (${c.timePlayed.toFixed(2) - d.timePlayed.toFixed(2)} hours)<br> They have 
      <span class="fw-bold  ${textColor(c.kills, d.kills)}"> ${c.kills - d.kills}</span> more kills,
      <span class="fw-bold  ${textColor(c.deaths, d.deaths)}"></span>
      <span class="fw-bold  ${textColor(d.deaths, c.deaths)}">${c.deaths - d.deaths}</span> more deaths and
      <span class="fw-bold">${c.assists - d.assists}</span> more assists. Their KD Ratio last time was
      <span class="fw-bold">${d.kdRatio.toFixed(2)}</span>, now it is
      <span class="fw-bold  ${textColor(c.kdRatio, d.kdRatio)}">${c.kdRatio.toFixed(2)}</span>.
      <br>
      See full stats below.`
      return html
  }
 return
}

// UI
const setupUI = (cod_data, db_data) => {
  if (cod_data && db_data) {
    playerFoundElements.forEach((el) => el.classList.remove("visually-hidden"))
    spinner.classList.add("visually-hidden")
    lastUpdated.textContent = makeDate(db_data.updatedAt)
    previousStatsContainer.innerHTML = createCardsWithData(db_data, cod_data)
    currentStatsContainer.innerHTML = createCardsWithData(cod_data, db_data)
    summary.innerHTML = setUserSummaryHtml(cod_data, db_data)
  } else {
    playerFoundElements.forEach((el) => el.classList.add("visually-hidden"))
    spinner.classList.add("visually-hidden")
    playerNotFoundAlert.classList.remove("visually-hidden")
    summary.innerHTML = setUserSummaryHtml()
  }
}
