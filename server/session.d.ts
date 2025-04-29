import { users } from "./database/schema";

type DrizzleUser = typeof users.$inferSelect

declare module "#auth-utils" {
  interface User extends DrizzleUser {
    
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}
