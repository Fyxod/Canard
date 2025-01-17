import dotenv from "dotenv";
dotenv.config();

const config = {
  environment: process.env.NODE_ENV || "development",

  server: {
    port: process.env.PORT || 3000,
  },

  database: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/canardtest",
  },
  priority: {
    candidate: 0,
    expert: 1,
    admin: 2,
    superadmin: 3,
  },
  auth: {
    tokenSecret: process.env.JWT_TOKEN || "thisbetterbeasecret",
    tokenExpiration: "8h",
  },
  leftHandHealth: 1000,
  rightHandHealth: 1000,
};

export default config;
