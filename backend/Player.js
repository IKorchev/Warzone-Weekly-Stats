class Player {
  constructor(data) {
    const as = data.lifetime.all.properties
    this.username = data.username
    this.wins = as.wins || 0
    this.kills = as.kills
    this.deaths = as.deaths
    this.assists = as.assists
    this.kdRatio = as.kdRatio
    this.matchesPlayed = as.gamesPlayed
    this.timePlayed = as.timePlayedTotal / 60
  }
}

module.exports = Player
