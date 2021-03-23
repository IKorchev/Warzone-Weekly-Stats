const form = document.querySelector("form")
const user = document.querySelector("#username")
const usernumber = document.querySelector("#usernumber")
const plat = document.querySelector("#plat")
const weeklyStatsContainer = document.querySelector("#weekly-stats")
const allTimeStatsContainer = document.querySelector("#all-time-stats")
const playerContainer = document.querySelector("#player-container")
const weeklyCollapse = document.getElementById("collapseOne")
const accordion = document.querySelector(".accordion")
const alert = document.querySelector(".alert")
console.log(alert)
const collapse = new bootstrap.Collapse(weeklyCollapse, {
  toggle: false,
})
form.addEventListener("submit", async (e) => {
  e.preventDefault()
  playerContainer.innerHTML = `<div class="spinner-border text-info mt-5" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`
  const fullUserID = `${user.value}#${usernumber.value}`
  const userandplat = {
    user: fullUserID,
    platform: plat.value,
  }
  try {
    const response = await fetch(`/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userandplat),
    })
    const data = await response.json()
    console.log(data)
    const allTimeStats = data.lifetime.mode.br_all.properties
    const weeklyStats = data.weekly.mode.br_all.properties
    const lifetime = data.lifetime.all.properties
    // prettier-ignore
    playerContainer.innerHTML = `
    <h5 class="player text-center border border-info text-uppercase"><i class="bi bi-person"></i> ${data.username}</h5>
    <h5 class="player text-center border border-info">Level: ${data.level}</h5>
    <h5 class="player text-center border border-info"><i class="bi bi-trophy"></i> Wins: ${makeLocaleString(lifetime.wins)} </h5>`
    formatAllTimeData(data, allTimeStatsContainer)
    formatWeeklyData(data, weeklyStatsContainer)
  } catch (err) {
    playerContainer.innerHTML = `
    <div class="alert alert-danger mt-5 mx-auto">
      <h5 class="text-center ">Unable to find user (misconfigured privacy settings)</h5>
    </div>`
    console.log(alert)
    // throw Error(err)
  } finally {
    collapse.show()
    accordion.classList.remove("visually-hidden")
  }
  form.reset()
})

const showAlert = (selector, ms) => {
  selector.classList.remove("visually-hidden")
  setTimeout(() => {
    selector.classList.add("visually-hidden")
  }, ms)
}
const makeLocaleString = (n) => {
  return n.toLocaleString("en-UK")
}
const formatWeeklyData = (data, container) => {
  const d = data.weekly.all.properties
  const wins = d.wins || 0
  let html = ""
  html += `
  <div class="card">
    <div class="card-header my-3 d-flex justify-content-around">
      <h5 class="text-uppercase">WEEKLY STATS</h5>
    </div>
    <div class="card-body row">
        <div class="col text-center">
            <h6>Matches played</h6>
            <h6>${makeLocaleString(d.matchesPlayed)}</h6>
        </div>
        <div class="col text-center">
          <h6>Total Kills</h6>
          <h6>${makeLocaleString(d.kills)}</h6>
        </div>
        <div class="col text-center">
            <h6>Total Deaths</h6>
            <h6>${makeLocaleString(d.deaths)}</h6>
        </div>
       
        <div class="col text-center">
          <h6>Damage Done</h6>
          <h6>${makeLocaleString(d.damageDone)}</h6>
        </div>
    </div>
    <div class="card-body row">
    <div class="col text-center">
        <h6>Headshots</h6>
        <h6>${makeLocaleString(d.headshots)}</h6>
    </div>
    <div class="col text-center">
        <h6>Headshot %</h6>
        <h6>${d.headshotPercentage.toFixed(2)}%</h6>
    </div>
    <div class="col text-center">
      <h6> KD Ratio</h6>
      <h6>${makeLocaleString(d.kdRatio.toFixed())}</h6>
    </div>
    <div class="col text-center">
        <h6>Time Played</h6>
        <h6>${(d.timePlayed / 3600).toFixed()} hours</h6>
    </div>
    
  </div>
</div>`
  container.innerHTML = html
}

const formatAllTimeData = (data, container) => {
  let html = ""
  let da = data.lifetime.all.properties
  const d = data.lifetime.mode.br_all.properties
  html += `
  <div class="card">
    <div class="card-header my-3 d-flex justify-content-around">
      <h5>ALL TIME STATS</h5>
    </div>
    <div class="card-body row">
        <div class="col text-center">
            <h6>Total Kills</h6>
            <h6>${makeLocaleString(da.kills)}</h6>
        </div>
        <div class="col text-center">
            <h6>Total Deaths</h6>
            <h6>${makeLocaleString(da.deaths)}</h6>
        </div>
        <div class="col text-center">
          <h6>KD Ratio</h6>
          <h6>${makeLocaleString(da.kdRatio.toFixed(2))}</h6>
        </div>
    </div>
    <div class="card-body row">
    <div class="col text-center">
        <h6>Games Played</h6>
        <h6>${makeLocaleString(da.gamesPlayed)}</h6>
    </div>
    <div class="col text-center">
        <h6>Time Played</h6>
        <h6>${(da.timePlayedTotal / 60).toFixed(2)} hours</h6>
    </div>
    <div class="col text-center">
      <h6>Total Score</h6>
      <h6>${makeLocaleString(da.score)}</h6>
    </div>
    <div class="card-body row">
    </div>
  </div>
</div>
  `
  container.innerHTML = html
}
