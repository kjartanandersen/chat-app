import { verifyPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import NextAuth from "next-auth/next";
import { AuthOptions, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const client = await connectToDatabase("chat-app");

        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({
          username: credentials.username,
        });

        if (!user) {
          client.close();
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Invalid Password!");
        }

        client.close();

        const sessionUser: User = { username: credentials.username };

        return sessionUser;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // console.log({ message: "Session", session });
      // console.log({ message: "Token", token });
      // console.log({ message: "User", user });
      // if (session.user) {
      //   session.user.username = token.username;
      // }

      if (session.user) {
        const { sub, iat, exp, jti, ...rest } = token;

        session.user = rest;
      }
      return session;
    },
    async jwt({ token, account, user, profile }) {
      if (user) {
        const u = user as User;

        token.username = u.username;
      }

      return token;
    },
  },
};

export default NextAuth(authOptions)
