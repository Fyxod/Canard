import express from "express"
import { safeHandler } from "../middlewares/safeHandler.js"
import taskData from "../data/taskData.js"

const router = express.Router()

router.get("/taskdata", safeHandler((req, res) => {
    return res.success(200, "Task data successfully fetched", { taskData })
}))

export default router