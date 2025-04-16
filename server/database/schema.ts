import { InferSelectModel, relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  foreignKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),

  username: text("username").notNull().unique(),
  displayName: text("displayName").notNull(),
  email: text("email").notNull().unique(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const usersRelation = relations(users, ({ many }) => ({
  signins: many(signins, { relationName: "user_signins" }),
}));

export enum SigninType {
  Password = "password",
}

export const signins = sqliteTable(
  "signins",
  {
    userId: text("userId").notNull(),
    type: text("type").$type<SigninType>().notNull(),
    version: integer("version").notNull().default(1),
    creds: text("creds").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.type] }),
    foreignKey({
      name: "userId",
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  ]
);

export type SigninSelectModel = InferSelectModel<typeof signins>;

export type PasswordCredsVersion1 = {
  hash: string;
};

export const signinsRelation = relations(signins, ({ one }) => ({
  user: one(users, {
    fields: [signins.userId],
    references: [users.id],
    relationName: "user_signins",
  }),
}));
