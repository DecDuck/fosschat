import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),

  avatar: text("avatar").notNull(),
});

export enum SigninType {
  Password = "password",
}

export const signin = sqliteTable(
  "signin",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    type: text("type").$type<SigninType>().notNull(),
    version: integer("version").notNull().default(1),
    creds: text("creds").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.type] })]
);
