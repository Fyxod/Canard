import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

console.log("hashPassword", await hashPassword("12345"));

// $2b$10$GtHGMAQk8VJstsb3Bd.iGuakGDnk8bzC71DpR4xTvAro2bKTWFCXu