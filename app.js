// libraries
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
//utils
import sendErrorMail from "./utils/sendErrorMail.js";
import responseHandler from "./middlewares/responseHandler.js";
import connectMongo from "./config/db.js";
import config from "./config/config.js";
import getIstDate from "./utils/getIstDate.js";
//routes
import teamRoutes from "./routes/team.routes.js";
import userRoutes from "./routes/user.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import handRoutes from "./routes/hand.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import gameRoutes from "./routes/game.routes.js";

console.log(getIstDate());

const app = express();
const server = http.createServer(app);
export const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectMongo();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(responseHandler);
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./public/views"));

app.use((req, res, next) => {
  console.log(req.headers);
  console.log("printing body", req.body);
  console.log(req.url, req.method);
  next();
});

app.use((req, res, next) => {
  const host = req.headers.host;
  const adminAppDomain = "admin.mlsc.tech";
  const userAppDomain = "app.mlsc.tech";

  return res.sendFile(
    path.join(__dirname, "./public/adminApp/index.html")
  );
  // const host = req.headers.host.split(':')[0]; // Get the host without port
  const parts = host.split('.');

  if (host === adminAppDomain) {
    if (req.path === "/") {
    }
  } else if (host === userAppDomain) {
    if (req.path === "/") {
      return res.sendFile(
        path.join(__dirname, "public", "userApp", "index.html")
      );
    }
  } else if (parts.length > 2 && parts[0] === "game") {
    gameRoutes(req, res, next);
  } else {
    next();
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Canard 2025</h1>");
});

app.use("/team", teamRoutes);
app.use("/user", userRoutes);
app.use("/settings", settingsRoutes);
app.use("/hand", handRoutes);
app.use("/admin", adminRoutes);
app.use("/game", gameRoutes);
// app.use("/", extraRoutes);

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
    // sendErrorMail(error);
    console.error("ALERT ALERT ALERT");
    console.error("Unhandled error:", error);
    return res.error(500, "Internal Server Error", "UNHANDLED_ERROR");
  }
});

server.listen(config.server.port, () => {
  console.log(`Server is running on http://localhost:${config.server.port}`);
});

// prepare the role based access control and role priority
// check parseInt everywhere
// convert to IST everywhere
// powerups
// add a failsafe that the distribution script runs if it has not already before the event starts
// send registration mails
// check for blocked teams everywhere
// read team post route once more
// add announcement route in admin routes - do you want a route to announce to different teams or all teams
// what all information about the team do you want after completion of the event

// see if you can add a task time limit if its possible

//STATEMENTS
// completed tasks are the no of major tasks done
// I am not noting down the time of completion of minor tasks by any team
// the completed time of a phase is defined as the point of time when the team enters the correct answer for the phase (NOT WHEN THEY COMPLETE ALL THE MAJOR AND MINOR TASKS)
// dont make team idle after completion of major tasks, only after completion of all tasks(i.e. minor included)
// Allow dynamic task changing and completion

// shaders cache karne hain before rebuilding the app

//email registration template
