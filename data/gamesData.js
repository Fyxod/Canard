export const gamesList = [
  { title: "Tekken 3", key: "tekken3" },
  { title: "Tekken 8", key: "tekken8" },
  { title: "WWE 2K23", key: "wwe" },
  { title: "Brawl Halla", key: "brawlHalla" },
  { title: "Mini Militia", key: "miniMilitia" },
  { title: "Clash Royale", key: "clashRoyale" },
  { title: "Forza Horizon", key: "forzaHorizon" },
  { title: "CSGO (4v4)", key: "csgoFullTeam" },
  { title: "CSGO(Free for all)", key: "csgoFFA" },
  { title: "Super Mario", key: "superMario" },
  { title: "GTA V", key: "gtaSanAndreas" },
  { title: "Fortnite", key: "fortnite" },
  { title: "Rocket League", key: "rocketLeague" },
  { title: "Fifa", key: "fifa" },
  { title: "Bowling", key: "bowling" },
  { title: "Nerf Showdown", key: "shootWithAGun" },
  { title: "BGMI", key: "bgmi" },
];

export const schemaTitles = {
  "Tekken 3": {
    key: "tekken3",
    stats: [
      { title: "Wins", key: "wins" },
      { title: "Longest Win Streak", key: "longestWinStreak" },
      { title: "Perfect Wins", key: "perfectWins" },
      { title: "Most Played Character", key: "mostPlayedCharacter" },
    ],
  },
  "Tekken 8": {
    key: "tekken8",
    stats: [
      { title: "Wins", key: "wins" },
      { title: "Longest Win Streak", key: "longestWinStreak" },
      { title: "Perfect Wins", key: "perfectWins" },
      { title: "Most Played Character", key: "mostPlayedCharacter" },
    ],
  },
  "WWE 2K23": {
    key: "wwe",
    stats: [
      { title: "Wins", key: "wins" },
      { title: "Longest Win Streak", key: "longestWinStreak" },
      { title: "Perfect Wins", key: "perfectWins" },
      { title: "Most Played Character", key: "mostPlayedCharacter" },
    ],
  },
  "Brawl Halla": {
    key: "brawlHalla",
    stats: [
      { title: "Wins", key: "wins" },
      { title: "Longest Win Streak", key: "longestWinStreak" },
      { title: "Perfect Wins", key: "perfectWins" },
      { title: "Most Played Character", key: "mostPlayedCharacter" },
    ],
  },
  "Mini Militia": {
    key: "miniMilitia",
    stats: [
      { title: "Kill Death Ratio", key: "kdRatio", notShow: true },
      { title: "Kills", key: "kills" },
      { title: "Deaths", key: "deaths" },
      { title: "Wins", key: "wins" },
    ],
  },
  "Clash Royale": {
    key: "clashRoyale",
    stats: [
      { title: "Wins", key: "wins" },
      { title: "Crowns Earned", key: "crownsEarned" },
      { title: "Win Rate", key: "winRate" },
    ],
  },
  "Forza Horizon": {
    key: "forzaHorizon",
    stats: [
      { title: "Races Won", key: "racesWon" },
      { title: "Fastest Lap Time", key: "fastestLapTime" },
    ],
  },
  "CSGO (4v4)": {
    key: "csgoFullTeam",
    stats: [
      { title: "Kill Death Ratio", key: "kdRatio", notShow: true },
      { title: "Kills", key: "kills" },
      { title: "Deaths", key: "deaths" },
      { title: "Wins", key: "wins" },
    ],
  },
  "CSGO(Free for all)": {
    key: "csgoFFA",
    stats: [
      { title: "Kill Death Ratio", key: "kdRatio", notShow: true },
      { title: "Kills", key: "kills" },
      { title: "Deaths", key: "deaths" },
      { title: "Wins", key: "wins" },
    ],
  },
  "Super Mario": {
    key: "superMario",
    stats: [
      { title: "High Score", key: "highScore" },
      { title: "Levels Completed", key: "levelsCompleted" },
      { title: "Coins Collected", key: "coinsCollected" },
    ],
  },
  "GTA V": {
    key: "gtaSanAndreas",
    stats: [{ title: "Best Survival Time", key: "bestSurvivalTime" }],
  },
  Fortnite: {
    key: "fortnite",
    stats: [
      { title: "Matches Won", key: "matchesWon" },
      { title: "Total Kills", key: "totalKills" },
      { title: "Kill Death Ratio", key: "kdRatio", notShow: true },
      { title: "Average Damage Dealt", key: "avgDamageDealt" },
    ],
  },
  "Rocket League": {
    key: "rocketLeague",
    stats: [
      { title: "Matches Won", key: "matchesWon" },
      { title: "Total Score", key: "totalScore" },
      { title: "Goals Scored", key: "goalsScored" },
    ],
  },
  Fifa: {
    key: "fifa",
    stats: [
      { title: "Matches Won", key: "matchesWon" },
      { title: "Goals Scored", key: "goalsScored" },
    ],
  },
  Bowling: {
    key: "bowling",
    stats: [
      { title: "Total Points", key: "totalPoints" },
      { title: "Number of Strikes", key: "numberOfStrikes" },
      { title: "Average Points per game", key: "averagePointsPerGame" },
    ],
  },
  "Nerf Showdown": {
    key: "shootWithAGun",
    stats: [
      { title: "Score", key: "score" },
      { title: "Accuracy", key: "accuracy" },
    ],
  },
  BGMI: {
    key: "bgmi",
    stats: [
      { title: "Matches Won", key: "matchesWon" },
      { title: "Total Kills", key: "totalKills" },
      { title: "Kill Death Ratio", key: "kdRatio", notShow: true },
      { title: "Average Damage Dealt", key: "avgDamageDealt" },
    ],
  },
};

















export const schemaKeys = {
  tekken3: {
    title: "Tekken 3",
    credits: 50,
    stats: [
      { title: "Wins", key: "wins" },
      { title: "Longest Win Streak", key: "longestWinStreak", replace: true },
      { title: "Perfect Wins", key: "perfectWins" },
      {
        title: "Most Played Character",
        key: "mostPlayedCharacter",
        replace: true,
      },
    ],
  },
  tekken8: {
    title: "Tekken 8",
    credits: 50,
    stats: [
      { title: "Wins", key: "wins" },
      { title: "Longest Win Streak", key: "longestWinStreak", replace: true },
      { title: "Perfect Wins", key: "perfectWins" },
      {
        title: "Most Played Character",
        key: "mostPlayedCharacter",
        replace: true,
      },
    ],
  },
  wwe: {
    title: "WWE 2K23",
    credits: 100,
    stats: [
      { title: "Wins", key: "wins" },
      { title: "Longest Win Streak", key: "longestWinStreak", replace: true },
      { title: "Perfect Wins", key: "perfectWins" },
      {
        title: "Most Played Character",
        key: "mostPlayedCharacter",
        replace: true,
      },
    ],
  },
  brawlHalla: {
    title: "Brawl Halla",
    credits: 50,
    stats: [
      { title: "Wins", key: "wins" },
      { title: "Longest Win Streak", key: "longestWinStreak", replace: true },
      { title: "Perfect Wins", key: "perfectWins" },
      {
        title: "Most Played Character",
        key: "mostPlayedCharacter",
        replace: true,
      },
    ],
  },
  miniMilitia: {
    title: "Mini Militia",
    credits: 75,
    stats: [
      { title: "Kill Death Ratio", key: "kdRatio", notShow: true },
      { title: "Kills", key: "kills" },
      { title: "Deaths", key: "deaths" },
      { title: "Wins", key: "wins" },
    ],
  },
  clashRoyale: {
    title: "Clash Royale",
    credits: 100,
    stats: [
      { title: "Wins", key: "wins" },
      { title: "Crowns Earned", key: "crownsEarned" },
      { title: "Win Rate", key: "winRate" },
    ],
  },
  forzaHorizon: {
    title: "Forza Horizon",
    credits: 75,
    stats: [
      { title: "Races Won", key: "racesWon" },
      { title: "Fastest Lap Time", key: "fastestLapTime" },
    ],
  },
  csgoFullTeam: {
    title: "CSGO (4v4)",
    credits: 75,
    stats: [
      { title: "Kill Death Ratio", key: "kdRatio", notShow: true },
      { title: "Kills", key: "kills" },
      { title: "Deaths", key: "deaths" },
      { title: "Wins", key: "wins" },
    ],
  },
  csgoFFA: {
    title: "CSGO(Free for all)",
    credits: 100,
    stats: [
      { title: "Kill Death Ratio", key: "kdRatio", notShow: true },
      { title: "Kills", key: "kills" },
      { title: "Deaths", key: "deaths" },
      { title: "Wins", key: "wins" },
    ],
  },
  superMario: {
    title: "Super Mario",
    credits: 100,
    stats: [
      { title: "High Score", key: "highScore" },
      { title: "Levels Completed", key: "levelsCompleted" },
      { title: "Coins Collected", key: "coinsCollected" },
    ],
  },
  gtaSanAndreas: {
    title: "GTA V",
    credits: 100,
    stats: [{ title: "Best Survival Time", key: "bestSurvivalTime" }],
  },
  fortnite: {
    title: "Fortnite",
    credits: 75,
    stats: [
      { title: "Matches Won", key: "matchesWon" },
      { title: "Total Kills", key: "kills" },
      { title: "Deaths", key: "deaths" },
      { title: "Kill Death Ratio", key: "kdRatio", notShow: true },
      { title: "Average Damage Dealt", key: "avgDamageDealt" },
    ],
  },
  rocketLeague: {
    title: "Rocket League",
    credits: 75,
    stats: [
      { title: "Matches Won", key: "matchesWon" },
      { title: "Total Score", key: "totalScore" },
      { title: "Goals Scored", key: "goalsScored" },
    ],
  },
  fifa: {
    title: "Fifa",
    credits: 100,
    stats: [
      { title: "Matches Won", key: "matchesWon" },
      { title: "Goals Scored", key: "goalsScored" },
    ],
  },
  bowling: {
    title: "Bowling",
    credits: 50,
    stats: [
      { title: "Total Points", key: "totalPoints" },
      { title: "Number of Strikes", key: "numberOfStrikes" },
      { title: "Average Points per game", key: "averagePointsPerGame" },
    ],
  },
  shootWithAGun: {
    title: "Nerf Showdown",
    credits: 50,
    stats: [
      { title: "Score", key: "score" },
      { title: "Accuracy", key: "accuracy" },
    ],
  },
  bgmi: {
    title: "BGMI",
    credits: 100,
    stats: [
      { title: "Matches Won", key: "matchesWon" },
      { title: "Total Kills", key: "kills" },
      { title: "Deaths", key: "deaths" },
      { title: "Kill Death Ratio", key: "kdRatio", notShow: true },
      { title: "Average Damage Dealt", key: "avgDamageDealt" },
    ],
  },
};

// export const gamesWithStats = gamesList.map((game) => ({
//   title: game,
//   key: schemaKeys[game]?.key || game.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(),
//   stats: schemaKeys[game]?.stats || [],
// }));
