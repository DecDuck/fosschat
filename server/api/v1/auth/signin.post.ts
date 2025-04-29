import { type } from "arktype";
import { signinValidator } from "~~/forms/signin";
import {
  PasswordCredsVersion1,
  signins,
  SigninSelectModel,
  SigninType,
  users,
} from "~~/server/database/schema";

export default defineEventHandler(async (h3) => {
  const body = await readValidatedBody(h3, (v) => signinValidator(v));
  if (body instanceof type.errors) {
    // We only show the first error so the user doesn't get confused
    const error = body.at(0)!!;
    throw createError({ statusCode: 400, statusMessage: error.message });
  }

  // This is janky, but the way to do in Drizzle just doesn't fucking work
  // I'm so pissed, their documentation is wrong at the time of writing
  const db = await useDrizzle();
  const signinObjectResults: { results: SigninSelectModel[] } = await db.run(
    sql`SELECT * FROM signins INNER JOIN users ON signins.userId = users.id WHERE signins.type = ${SigninType.Password} AND users.username = ${body.username} LIMIT 1`
  );
  const signinObject = signinObjectResults.results.at(0);
  if (!signinObject)
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid username or password.",
    });

  let valid = false;
  switch (signinObject.version) {
    case 1:
      const creds: PasswordCredsVersion1 = JSON.parse(signinObject.creds);
      valid = await verifyPassword(creds.hash, body.password);
      break;
  }
  if (!valid)
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid username or password.",
    });

  const user = (
    await db
      .select()
      .from(users)
      .where(eq(users.id, signinObject.userId))
      .limit(1)
  ).at(0);
  if (!user)
    throw createError({
      statusCode: 500,
      statusMessage: "Somehow invalid signin method - cannot find account. ",
    });

  await setUserSession(h3, { user });
});
