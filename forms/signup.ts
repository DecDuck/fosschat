import { type } from "arktype";

export const signupValidator = type({
  email: "string.email",
  username: "5 <= string.alphanumeric <= 15",
  displayName: "string",
  password: "string > 12",
  token: "string",
});
export type SignupForm = typeof signupValidator.infer;
