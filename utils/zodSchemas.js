import { z } from "zod";

export const teamRegistrationSchema = z.object({
  name: z
    .string({ required_error: "Team name is required" })
    .min(2, { message: "Team name should be atleast 2 characters long" })
    .max(50, {
      message: "Team name should not be more than 50 characters long",
    }),
  callingCard: z
    .number({ required_error: "Calling card is required" })
    .min(1, { message: "Calling card should be atleast 1" })
    .max(10, { message: "Calling card should not be more than 10" }),
});

export const userRegistrationSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(2, { message: "Username should be at least 2 characters long" })
    .max(50, {
      message: "Username should not be more than 50 characters long",
    }),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(5, { message: "Password should be at least 5 characters long" }),
  teamName: z.string({ required_error: "Team name is required" }),
});

export const userLoginSchema = z.object({
  username: z.string({ required_error: "Username is required" }),
  password: z
    .string({ required_error: "Password is required." })
    .min(5, { message: "Password must be at least 5 characters long." }),
});
