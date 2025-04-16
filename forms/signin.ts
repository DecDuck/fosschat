import { type } from "arktype";

export const signinValidator = type({
  username: "string",
  password: "string",
});

export type SigninForm = typeof signinValidator.infer;
