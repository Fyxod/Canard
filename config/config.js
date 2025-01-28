import dotenv from "dotenv";
dotenv.config();

const config = {

  environment: process.env.NODE_ENV || "development",

  server: {
    port: process.env.PORT || 3000,
  },

  database: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/",
  },
  priority: {
    user: 1,
    admin: 2,
    superAdmin: 3,
  },
  auth: {
    tokenSecret: process.env.JWT_TOKEN || "thisbetterbeasecret",
    tokenExpiration: "8h",
  },
  leftHandHealth: 1000,
  rightHandHealth: 1000,
  phaseInterval: 45 * 60 * 1000, // 45 minutes
  phaseStartTime: {
    // year month date hour minute second
    1: new Date(2025, 0, 24, 22, 30, 0), // 1st Feb 2025, 2 PM  
    2: new Date(2025, 0, 24, 22, 45, 0), // 1st Feb 2025, 3 PM
    3: new Date(2025, 0, 24, 23, 0, 0), // 1st Feb 2025, 4 PM
    // 1: new Date(2025, 1, 1, 14, 0, 0), // 1st Feb 2025, 2 PM
    // 2: new Date(2025, 1, 1, 15, 0, 0), // 1st Feb 2025, 3 PM
    // 3: new Date(2025, 1, 1, 16, 0, 0), // 1st Feb 2025, 4 PM
  },
};

export default config;
