const { z } = require("zod");

const signupSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(3, { message: "Email must be atleast of three character" })
    .max(255, { message: "Email must not be more than 255 character" })
    .email({ message: "Invalid email address" }),

  fullname: z
    .string({ required_error: "fullname is required" })
    .trim()
    .min(3, { message: "name must be atleast of three character" })
    .max(255, { message: "name must not be more than 255 character" }),

  username: z
    .string({ required_error: "username is required" })
    .trim()
    .min(3, { message: "username must be atleast of three character" })
    .max(255, { message: "username must not be more than 255 character" }),

  password: z
    .string({ required_error: "password is required" })
    .trim()
    .min(3, { message: "password must be atleast of three character" })
    .max(255, { message: "password must not be more than 255 character" }),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(3, { message: "Email must be atleast of three character" })
    .max(255, { message: "Email must not be more than 255 character" })
    .email({ message: "Invalid email address" }),

  password: z
    .string({ required_error: "password is required" })
    .trim()
    .min(3, { message: "password must be atleast of three character" })
    .max(255, { message: "password must not be more than 255 character" })
});

module.exports = {signupSchema,loginSchema};
