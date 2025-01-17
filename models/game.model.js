import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    tekken3: {
      highScore: {
        type: String,
        default: 0,
      },
      wins: {
        type: String,
        default: 0,
      },
      losses: {
        type: String,
        default: 0,
      },
      longestWinStreak: {
        type: String,
        default: 0,
      },
      fastestVictoryTime: {
        type: String,
        default: 0,
      },
      mostPlayedCharacter: {
        type: String,
        default: "N/A",
      },
    },
    tekken8: {
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
      totalMatchesPlayed: {
        type: Number,
        default: 0,
      },
      perfectRoundsWon: {
        type: Number,
        default: 0,
      },
      comboExecutionAccuracy: {
        type: Number,
        default: 0,
      },
      fastestVictoryTime: {
        type: Number,
        default: 0,
      },
    },
    wwe: {
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
      pinsSubmissionsExecuted: {
        type: Number,
        default: 0,
      },
      reversalsSuccessRate: {
        type: Number,
        default: 0,
      },
      damageDealt: {
        type: Number,
        default: 0,
      },
      specialMovesExecuted: {
        type: Number,
        default: 0,
      },
    },
    brawlhalla: {
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
      damageDealt: {
        type: Number,
        default: 0,
      },
      koCount: {
        type: Number,
        default: 0,
      },
      matchesPlayed: {
        type: Number,
        default: 0,
      },
      recoverySuccessRate: {
        type: Number,
        default: 0,
      },
    },
    miniMilitia: {
      killsDeathsRatio: {
        type: Number,
        default: 0,
      },
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
      accuracy: {
        // shots fired vs hits
        type: Number,
        default: 0,
      },
      powerUpsCollected: {
        type: Number,
        default: 0,
      },
      longestSurvivalTime: {
        type: Number,
        default: 0,
      },
    },
    clashRoyale: {
      trophiesEarned: {
        type: Number,
        default: 0,
      },
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
      crownCount: {
        type: Number,
        default: 0,
      },
      averageElixirUsage: {
        type: Number,
        default: 0,
      },
      favouriteDeck: {
        type: String,
        default: "N/A",
      },
    },
    forzaHorizon: {
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
      fastestLapTime: {
        type: Number,
        default: 0,
      },
      totalDistanceDriven: {
        type: Number,
        default: 0,
      },
      averageSpeed: {
        type: Number,
        default: 0,
      },
      achievementsCollected: {
        type: Number,
        default: 0,
      },
    },
    csgoFullTeam: {
      kiils: {
        type: Number,
        default: 0,
      },
      deaths: {
        type: Number,
        default: 0,
      },
      assists: {
        type: Number,
        default: 0,
      },
      roundsWon: {
        type: Number,
        default: 0,
      },
      roundsLost: {
        type: Number,
        default: 0,
      },
      headshots: {
        type: Number,
        default: 0,
      },
      bombPlants: {
        type: Number,
        default: 0,
      },
      bombDefusals: {
        type: Number,
        default: 0,
      },
    },
    csgoFFA: {
      kills: {
        type: Number,
        default: 0,
      },
      deaths: {
        type: Number,
        default: 0,
      },
      kdRatio: {
        type: Number,
        default: 0,
      },
      score: {
        type: Number,
        default: 0,
      },
      maxKillStreak: {
        type: Number,
        default: 0,
      },
      mostUsedWeapon: {
        type: String,
        default: "N/A",
      },
    },
    bombDiffusal: {
      successfulBombDiffusals: {
        type: Number,
        default: 0,
      },
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
      timeTakenForDiffusal: {
        type: Number,
        default: 0,
      },
      kills: {
        type: Number,
        default: 0,
      },
      objectivesCompleted: {
        type: Number,
        default: 0,
      },
    },
    superMario: {
      highScore: {
        type: Number,
        default: 0,
      },
      levelsCompleted: {
        type: Number,
        default: 0,
      },
      fastestCompletionTime: {
        type: Number,
        default: 0,
      },
      livesLost: {
        type: Number,
        default: 0,
      },
      coinsCollected: {
        type: Number,
        default: 0,
      },
    },
    gtaSanAndreas: {
      missionsCompleted: {
        type: Number,
        default: 0,
      },
      kdRatio: {
        type: Number,
        default: 0,
      },
      achievementsEarned: {
        type: Number,
        default: 0,
      },
      totalCashEarned: {
        type: Number,
        default: 0,
      },
      fastestTimeInRacesChallenges: {
        type: Number,
        default: 0,
      },
    },
    fortnite: {
      kdRatio: {
        type: Number,
        default: 0,
      },
      victoryRoyales: {
        type: Number,
        default: 0,
      },
      damageDealt: {
        type: Number,
        default: 0,
      },
      survivalTime: {
        type: Number,
        default: 0,
      },
      shotsAccuracy: {
        type: Number,
        default: 0,
      },
    },
    rocketLeague: {
      goalsScored: {
        type: Number,
        default: 0,
      },
      assists: {
        type: Number,
        default: 0,
      },
      saves: {
        type: Number,
        default: 0,
      },
      mvpAwards: {
        type: Number,
        default: 0,
      },
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
    },
    fifa: {
      goalsScored: {
        type: Number,
        default: 0,
      },
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
      cleanSheets: {
        type: Number,
        default: 0,
      },
      shotsOnTarget: {
        type: Number,
        default: 0,
      },
      possessionPercentage: {
        type: Number,
        default: 0,
      },
    },
    bowling: {
      totalPoints: {
        type: Number,
        default: 0,
      },
      numberOfStrikes: {
        type: Number,
        default: 0,
      },
      numberOfSpares: {
        type: Number,
        default: 0,
      },
      averageScorePerGame: {
        //check this out
        type: Number,
        default: 0,
      },
      longestStreakOfStrikes: {
        type: Number,
        default: 0,
      },
    },
    shootWithAGun: {
      hits: {
        type: Number,
        default: 0,
      },
      misses: {
        type: Number,
        default: 0,
      },
      hitsMissesRatio: {
        type: Number,
        default: 0,
      },
      totalTargetsHit: {
        type: Number,
        default: 0,
      },
      score: {
        type: Number,
        default: 0,
      },
      accuracy: {
        type: Number,
        default: 0,
      },
    },
    bgmi: {
      kills: {
        type: Number,
        default: 0,
      },
      deaths: {
        type: Number,
        default: 0,
      },
      kdRatio: {
        type: Number,
        default: 0,
      },
      chickenDinners: {
        type: Number,
        default: 0,
      },
      damageDealt: {
        type: Number,
        default: 0,
      },
      revivesPerformed: {
        type: Number,
        default: 0,
      },
      longestSurvivalTime: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;

// 1. Tekken 3 (1v1, arcade)
// 	•	High Score
// 	•	Wins/Losses
// 	•	Perfect Rounds Won
// 	•	Longest Win Streak
// 	•	Fastest Victory Time
// 	•	Most Played Character

// 2. Tekken 8 (1v1, 2 controllers)
// 	•	High Score
// 	•	Wins/Losses
// 	•	Perfect Rounds Won
// 	•	Longest Win Streak
// 	•	Combo Execution Accuracy
// 	•	Fastest Victory Time
// 	•	Most Played Character

// 3. WWE (2v2, 4 controllers, 4-min match)
// 	•	Wins/Losses (Team)
// 	•	Pins/Submissions Executed
// 	•	Reversals Success Rate
// 	•	Damage Dealt
// 	•	Special Moves Executed

// 4. Brawlhalla (2/4 controllers)
// 	•	Wins/Losses
// 	•	Damage Dealt
// 	•	KO Count
// 	•	Matches Played
// 	•	Recovery Success Rate

// 5. Mini Militia (4 phones)
// 	•	Kills/Deaths Ratio (K/D)
// 	•	Wins/Losses
// 	•	Accuracy (Shots Fired vs Hits)
// 	•	Power-Ups Collected
// 	•	Longest Survival Time

// 6. Clash Royale (2v2, 4 tablets)
// 	•	Trophies Earned
// 	•	Wins/Losses
// 	•	Crown Count (Per Game)
// 	•	Average Elixir Usage
// 	•	Favorite Deck

// 7. Forza Horizon (race, 2 laptops)
// 	•	Races Won/Lost
// 	•	Fastest Lap Time
// 	•	Total Distance Driven
// 	•	Average Speed
// 	•	Achievements Collected

// 8. CS:GO (full team, 8 laptops)
// 	•	Kills/Deaths/Assists (K/D/A)
// 	•	Rounds Won/Lost
// 	•	Headshot Percentage
// 	•	Bomb Plants/Defuses

// 9. CS:GO (Free for All, Top Players TDM)
// 	•	Kills/Deaths Ratio (K/D)
// 	•	Score Per Match - will be added up
// 	•	Kill Streaks - this value will be replaced each time instead of being updated
// 	•	Most Used Weapon

// 10. Bomb Diffusal (full team, 1 laptop)
// 	•	Successful Bomb Diffuses
// 	•	Rounds Won/Lost
// 	•	Time Taken for Diffusal
// 	•	Kill Count
// 	•	Objectives Completed

// 11. Super Mario (1 controller)
// 	•	High Score
// 	•	Levels Completed
// 	•	Fastest Completion Time - replace value
// 	•	Lives Lost
// 	•	Coins Collected

// 12. GTA San Andreas (multiplayer)
// 	•	Missions Completed
// 	•	Kills/Deaths Ratio
// 	•	Achievements Earned
// 	•	Total Cash Earned
// 	•	Fastest Time in Races/Challenges

// 13. Fortnite (1v1, 2 laptops)
// 	•	Kills/Deaths Ratio (K/D)
// 	•	Victory Royales
// 	•	Damage Dealt
// 	•	Survival Time
// 	•	Shots Accuracy

// 14. Rocket League (3v3, 6 laptops)
// 	•	Goals Scored
// 	•	Assists
// 	•	Saves
// 	•	MVP Awards
// 	•	Matches Won/Lost

// 15. FIFA (2v2, 4 controllers)
// 	•	Goals Scored
// 	•	Matches Won/Lost
// 	•	Clean Sheets (No Goals Conceded)
// 	•	Shots on Target
// 	•	Possession Percentage

// 16. Bowling
// 	•	Total Points
// 	•	Number of Strikes
// 	•	Number of Spares
// 	•	Average Score Per Game
// 	•	Longest Streak of Strikes - replace value

// 17. Shoot with a Gun
// 	•	Hits/Misses Ratio
// 	•	Total Targets Hit
// 	•	Score
// 	•	Accuracy

// 18. BGMI (Battle Royale)
// 	•	Kills/Deaths Ratio (K/D)
// 	•	Chicken Dinners (Wins)
// 	•	Damage Dealt
// 	•	Revives Performed
// 	•	Longest Survival Time
