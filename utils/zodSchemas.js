import { z } from "zod";

export const teamRegistrationSchema = z.object({
  name: z
    .string({ required_error: "Team name is required" })
    .min(2, { message: "Team name should be atleast 2 characters long" })
    .max(50, {
      message: "Team name should not be more than 50 characters long",
    }),
});

export const userRegistrationSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(2, { message: "Username should be atleast 2 characters long" })
    .max(50, { message: "Username should not be more than 50 characters long" }),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(5, { message: "Password should be atleast 5 characters long" }),
  teamId: z.string(),
});

export const userLoginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(5, { message: "Password must be at least 5 characters long." }),
});
