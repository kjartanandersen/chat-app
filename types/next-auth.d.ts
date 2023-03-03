import {type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  type JWT = {
    username: string;
    // Default JWT properties
    sub: string;
    iat: number;
    exp: number;
    jti: string;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      username: string;
    }
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  type User = {
    username: string;
  }
}
