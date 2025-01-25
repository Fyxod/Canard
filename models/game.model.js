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
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
