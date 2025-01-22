import Settings from "../models/settings.model.js";

export default async function isEventActive(req, res, next) {
  const settings = await Settings.findOne();
  if (settings.eventStatus !== "active") {
    return res.error(400, "Event is not active", "EVENT_NOT_ACTIVE");
  }
  return next();
}
