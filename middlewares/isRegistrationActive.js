import Settings from "../models/settings.model.js";

export default async function isRegistrationActive(req, res, next) {
  const settings = await Settings.findOne();
  if (!settings.registrationsActive) {
    return res.error(400, "Registrations are closed", "REGISTRATIONS_CLOSED");
  }
  return next();
}
