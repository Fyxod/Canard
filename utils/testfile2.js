export const gamesList = [
    "Tekken 3",
    "Tekken 8",
    "WWE 2K23",
    "Brawl Halla",
    "Mini Militia",
    "Clash Royale",
    "Forza Horizon",
    "CSGO (4v4)",
    "CSGO(Free for all)",
    "Bomb Diffusal",
    "Super Mario",
    "GTA San Andreas",
    "Fortnite",
    "Rocket League",
    "Fifa",
    "Bowling",
    "Shoot with a gun",
    "BGMI",
  ];
  
  // Mapping for schema keys corresponding to the gamesList
  const schemaKeys = {
    "Tekken 3": "tekken3",
    "Tekken 8": "tekken8",
    "WWE 2K23": "wwe",
    "Brawl Halla": "brawlHalla",
    "Mini Militia": "miniMilitia",
    "Clash Royale": "clashRoyale",
    "Forza Horizon": "forzaHorizon",
    "CSGO (4v4)": "csgoFullTeam",
    "CSGO(Free for all)": "csgoFFA",
    "Bomb Diffusal": "bombDiffusal",
    "Super Mario": "superMario",
    "GTA San Andreas": "gtaSanAndreas",
    "Fortnite": "fortnite",
    "Rocket League": "rocketLeague",
    "Fifa": "fifa",
    "Bowling": "bowling",
    "Shoot with a gun": "shootWithAGun",
    "BGMI": "bgmi",
  };
  
  // Converting to an array of objects
  const gamesWithKeys = gamesList.map((game) => ({
    title: game,
    key: schemaKeys[game] || game.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(), // Fallback to sanitized version
  }));
  
  console.log(gamesWithKeys);
  