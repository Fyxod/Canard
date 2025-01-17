import express from "express";
import connectMongo from "./config/db.js";
import config from "./config/config.js";
import responseHandler from "./middlewares/responseHandler.js";
import cors from "cors";
import path from "path";
//routes
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const __dirname = path.resolve();

connectMongo();

app.use((req, res, next) => {
  console.log(req.headers);
  console.log(req.url, req.method);
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*");
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseHandler);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("<h1>Canard 2025</h1>");
});

app.use("/team", teamRoutes);
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  if (error.errors && error.errors[0].message) {
    return res.error(400, error.errors[0].message, "VALIDATION_ERROR");
  }

  if (error.isOperational) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    return res.error(statusCode, message, error.errorCode, error.data);
  } else {
    sendErrorMail(error);
    console.error("ALERT ALERT ALERT");
    console.error("Unhandled error:", error);
    return res.error(500, "Internal Server Error", "UNHANDLED_ERROR");
  }
});

app.listen(config.server.port, () => {
  console.log(`Server is running on port ${config.server.port}`);
});

// check whether all are safehandled
// prepare the role based access control and role priority
// check for invalid object id everywhere
// get all users of a team
// powerups
// check parseInt everywhere