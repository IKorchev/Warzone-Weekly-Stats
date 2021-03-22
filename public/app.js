const form = document.querySelector("form")
const user = document.querySelector("#username")
const usernumber = document.querySelector("#usernumber")
const plat = document.querySelector("#plat")
const weeklyStatsContainer = document.querySelector("#weekly-stats")
const allTimeStatsContainer = document.querySelector("#all-time-stats")

form.addEventListener("submit", async (e) => {
  e.preventDefault()
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
    formatAllTimeData(data, allTimeStatsContainer)
  } catch (err) {
    throw Error(err)
  }
})

const makeLocaleString = (n) => {
  return n.toLocaleString("en-UK")
}
const formatWeeklyData = () => {}

const formatAllTimeData = (data, container) => {
  let html = ""
  const d = data.lifetime.mode.br_all.properties
  html += `
  <div class="card">
    <div class="card-header my-3 d-flex justify-content-around">
      <h5 class="text-uppercase">
        <i class="bi bi-person"></i>
        ${data.username}</h5>
      <h5> Level: ${data.level}</h5>
      <h5>
        <i class="bi bi-trophy"></i>
        WINS: ${makeLocaleString(d.wins)}
      </h5>
    </div>
    <div class="card-body row">
        <div class="col text-center">
            <h6>Total Kills</h6>
            <h6>${makeLocaleString(d.kills)}</h6>
        </div>
        <div class="col text-center">
            <h6>Total Deaths</h6>
            <h6>${makeLocaleString(d.deaths)}</h6>
        </div>
        <div class="col text-center">
            <h6>Total Revives</h6>
            <h6>${makeLocaleString(d.revives)}</h6>
        </div>
        <div class="col text-center">
          <h6>Total Downs</h6>
          <h6>${makeLocaleString(d.downs)}</h6>
        </div>
    </div>
    <div class="card-body row">
    <div class="col text-center">
        <h6>Games Played</h6>
        <h6>${makeLocaleString(d.gamesPlayed)}</h6>
    </div>
    <div class="col text-center">
        <h6>Time Played</h6>
        <h6>${(d.timePlayed / 3600).toFixed(2)} hours</h6>
    </div>
    <div class="col text-center">
      <h6>Total Score</h6>
      <h6>${makeLocaleString(d.score)}</h6>
    </div>
    <div class="col text-center">
        <h6>Score per minute</h6>
        <h6>${d.scorePerMinute.toFixed()}</h6>
    </div>
    
  </div>
</div>
  `
  container.innerHTML = html
}
