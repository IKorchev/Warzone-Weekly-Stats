const form = document.querySelector("form")
const user = document.querySelector("#username")
const usernumber = document.querySelector("#usernumber")
const plat = document.querySelector("#plat")
const contentContainer = document.querySelector(".content-container")

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
    formatData(data, fullUserID)
  } catch (err) {
    throw Error(err)
  }
})

const formatData = (data, name) => {
  let player = data.wz.all.properties
  let html = ""

  html += `
  <div class="card">
    <div class="card-header">
        <h1 class="h3 name text-center">${name}</h1>
        <h2 class="h5 text-center">Matches played: ${player.matchesPlayed} </h2>
    </div>
    <div class="card-body d-flex flex-column justify-content-center align-items-between">
        <div class="row justify-content-around">
            <div class="col-3 mt-2 d-flex flex-column justify-content-center border border-info">
                <h5 class="text-center">Kills</h5>
                <h5 class="text-center">${player.kills}</h5>
            </div>
            <div class="col-3 mt-2 d-flex flex-column justify-content-center border border-info">
                <h5 class="text-center">Deaths</h5>
                <h5 class="text-center">${player.deaths}</h5>
            </div>
            <div class="col-3 mt-2 d-flex flex-column justify-content-center border border-info">
                <h5 class="text-center">Assists</h5>
                <h5 class="text-center">${player.assists}</h5>
            </div>
        </div>
        <div class="row mt-3 justify-content-around">
            <div class="col-3 mt-2 d-flex flex-column justify-content-center border border-info">
                <h5 class="text-center">Headshots</h5>
                <h5 class="text-center">${player.headshots}</h5>
            </div>
            <div class="col-3 mt-2 d-flex flex-column justify-content-center border border-info">
                <h5 class="text-center">Damage Done</h5>
                <h5 class="text-center">${player.damageDone}</h5>
            </div>
            <div class="col-3 mt-2 d-flex flex-column justify-content-center border border-info">
                <h5 class="text-center">Damage Taken</h5>
                <h5 class="text-center">${player.damageTaken}</h5>
            </div>
        </div>
        <div class="row justify-content-around mt-3">
            <h3 class="h5 text-center mb-3">Average:</h3>
            <div class="col-3 mt-2 d-flex flex-column justify-content-center border border-info">
                <h5 class="text-center">Kills per game</h5>
                <h5 class="text-center">${player.killsPerGame.toFixed(2)}</h5>
            </div>
            <div class="col-3 mt-2 d-flex flex-column justify-content-center border border-info">
                <h5 class="text-center">Lifetime</h5>
                <h5 class="text-center">${(player.avgLifeTime / 60).toFixed(
                  2
                )} minutes</h5>
            </div>
            <div class="col-3 mt-2 d-flex flex-column justify-content-center border border-info">
                <h5 class="text-center">Score per minute</h5>
                <h5 class="text-center">${player.scorePerMinute.toFixed(2)}</h5>
            </div>
        </div>
        <div class="row justify-content-around mt-3">
            <div class="col-3 mt-2 d-flex flex-column justify-content-center border border-info">
                <h5 class="text-center">KD Ratio</h5>
                <h5 class="text-center">${player.kdRatio.toFixed(2)}</h5>
            </div>
            <div class="col-3 mt-2 d-flex flex-column justify-content-center border border-info">
                <h5 class="text-center">Headshots %</h5>
                <h5 class="text-center">${player.headshotPercentage.toFixed(2)}</h5>
            </div>
        </div>
    </div>
</div>`

  contentContainer.innerHTML = html
}
