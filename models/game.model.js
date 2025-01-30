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
      wins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Wins",
        },
      },

      longestWinStreak: {
        value: {
          // replace
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Longest Win Streak",
        },
      },

      perfectWins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Perfect Wins",
        },
      },

      mostPlayedCharacter: {
        value: {
          // replace
          type: String,
          default: "N/A",
        },
        title: {
          type: String,
          default: "Most Played Character",
        },
      },
      title: {
        type: String,
        default: "Tekken 3",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },

    tekken8: {
      wins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Wins",
        },
      },

      longestWinStreak: {
        value: {
          // replace
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Longest Win Streak",
        },
      },

      perfectWins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Perfect Wins",
        },
      },

      mostPlayedCharacter: {
        value: {
          // replace
          type: String,
          default: "N/A",
        },
        title: {
          type: String,
          default: "Most Played Character",
        },
      },
      title: {
        type: String,
        default: "Tekken 8",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },

    wwe: {
      wins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Wins",
        },
      },

      longestWinStreak: {
        value: {
          // replace
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Longest Win Streak",
        },
      },

      perfectWins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Perfect Wins",
        },
      },

      mostPlayedCharacter: {
        value: {
          // replace
          type: String,
          default: "N/A",
        },
        title: {
          type: String,
          default: "Most Played Character",
        },
      },
      title: {
        type: String,
        default: "WWE",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },

    brawlHalla: {
      wins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Wins",
        },
      },

      longestWinStreak: {
        value: {
          // replace
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Longest Win Streak",
        },
      },

      perfectWins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Perfect Wins",
        },
      },
      mostPlayedCharacter: {
        value: {
          // replace
          type: String,
          default: "N/A",
        },
        title: {
          type: String,
          default: "Most Played Character",
        },
      },
      title: {
        type: String,
        default: "Brawlhalla",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },

    miniMilitia: {
      kdRatio: {
        value: {
          type: String,
          default: "0:0",
        },
        title: {
          type: String,
          default: "Kill Death Ratio",
        },
      },
      kills: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Kills",
        },
      },
      deaths: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Deaths",
        },
      },

      wins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Wins",
        },
      },

      title: {
        type: String,
        default: "Mini Militia",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },

    clashRoyale: {
      wins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Wins",
        },
      },

      crownsEarned: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Crowns Earned",
        },
      },

      winRate: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Win Rate",
        },
      },
      title: {
        type: String,
        default: "Clash Royale",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },

    forzaHorizon: {
      racesWon: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Races Won",
        },
      },

      fastestLapTime: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Fastest Lap Time",
        },
      },
      title: {
        type: String,
        default: "Forza Horizon",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },
    csgoFullTeam: {
      kdRatio: {
        value: {
          type: String,
          default: "0:0",
        },
        title: {
          type: String,
          default: "Kill Death Ratio",
        },
      },
      kills: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Kills",
        },
      },
      deaths: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Deaths",
        },
      },

      wins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Wins",
        },
      },
      title: {
        type: String,
        default: "CSGO Full Team",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },

    csgoFFA: {
      kdRatio: {
        value: {
          type: String,
          default: "0:0",
        },
        title: {
          type: String,
          default: "Kill Death Ratio",
        },
      },
      kills: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Kills",
        },
      },
      deaths: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Deaths",
        },
      },

      wins: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Wins",
        },
      },
      title: {
        type: String,
        default: "CSGO FFA",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },
    bombDiffusal: {
      matchesWon: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Matches Won",
        },
      },
      title: {
        type: String,
        default: "Bomb Diffusal",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },

    superMario: {
      highScore: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "High Score",
        },
      },
      levelsCompleted: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Levels Completed",
        },
      },
      coinsCollected: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Coins Collected",
        },
      },
      title: {
        type: String,
        default: "Super Mario",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },
    gtaSanAndreas: {
      bestSurvivalTime: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Best Survival TIme",
        },
      },
      title: {
        type: String,
        default: "GTA V",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },
    fortnite: {
      matchesWon: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Matches Won",
        },
      },
      kills: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Total Kills",
        },
      },
      deaths: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Total Deaths",
        },
      },
      kdRatio: {
        value: {
          type: String,
          default: "0:0",
        },
        title: {
          type: String,
          default: "Kill Death Ratio",
        },
      },
      avgDamageDealt: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Average Damage Dealt",
        },
      },
      title: {
        type: String,
        default: "Fortnite",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },
    rocketLeague: {
      matchesWon: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Matches Won",
        },
      },
      totalScore: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Total Score",
        },
      },
      goalsScored: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Goals Scored",
        },
      },
      title: {
        type: String,
        default: "Rocket League",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },
    fifa: {
      matchesWon: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Matches Won",
        },
      },
      goalsScored: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Goals Scored",
        },
      },
      title: {
        type: String,
        default: "FIFA",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },
    bowling: {
      totalPoints: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Total Points",
        },
      },
      numberOfStrikes: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Number of Strikes",
        },
      },
      averagePointsPerGame: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Average Points per game",
        },
      },
      title: {
        type: String,
        default: "Bowling",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },
    shootWithAGun: {
      score: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Score",
        },
      },
      accuracy: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Accuracy",
        },
      },
      title: {
        type: String,
        default: "Nerf Showdown",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },
    bgmi: {
      matchesWon: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Matches Won",
        },
      },
      kills: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Total Kills",
        },
      },
      deaths: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Total Deaths",
        },
      },
      kdRatio: {
        value: {
          type: String,
          default: "0:0",
        },
        title: {
          type: String,
          default: "Kill Death Ratio",
        },
      },
      avgDamageDealt: {
        value: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "Average Damage Dealt",
        },
      },
      title: {
        type: String,
        default: "BGMI",
      },
      creditsGiven: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
