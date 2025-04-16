import { type } from "arktype";
import { signupValidator } from "~~/forms/signup";
import {
  PasswordCredsVersion1,
  signins,
  SigninType,
  users,
} from "~~/server/database/schema";
import * as jdenticon from "jdenticon";

export default defineEventHandler(async (h3) => {
  const body = await readValidatedBody(h3, (v) => signupValidator(v));
  if (body instanceof type.errors) {
    // We only show the first error so the user doesn't get confused
    const error = body.at(0)!!;
    throw createError({ statusCode: 400, statusMessage: error.message });
  }

  const token = body.token;
  const turnstileVerification = await verifyTurnstileToken(token, h3);
  if (!turnstileVerification.success)
    throw createError({
      statusCode: 400,
      statusMessage: "Please complete CAPTCHA.",
    });

  // Check username
  const email = body.email;
  const username = body.username;
  const password = body.password;
  const displayName = body.displayName;

  const db = await useDrizzle();
  const existingUsername = await db
    .select()
    .from(users)
    .limit(1)
    .where(eq(users.username, username));
  if (existingUsername.length != 0)
    throw createError({
      statusCode: 400,
      statusMessage: "Username already taken.",
    });

  const existingEmail = await db
    .select()
    .from(users)
    .limit(1)
    .where(eq(users.email, email));
  if (existingEmail.length != 0)
    throw createError({
      statusCode: 400,
      statusMessage: "Email already used to sign up.",
    });

  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  await db.insert(users).values({
    id: userId,
    email,
    username,
    displayName,
  });

  const creds: PasswordCredsVersion1 = {
    hash: passwordHash,
  };

  await db.insert(signins).values({
    userId,
    type: SigninType.Password,
    creds: JSON.stringify(creds),
  });

  return { userId };
});
