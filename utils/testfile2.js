import config from "../config/config.js";
import getIstDate from "./getIstDate.js";

console.log(Date.now() - config.phaseStartTime[1]);
console.log(getIstDate() - config.phaseStartTime[1]);