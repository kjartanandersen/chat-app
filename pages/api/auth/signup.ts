import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "@/lib/db";

import { hashPassword } from "@/lib/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const data = req.body;

    const { username, password } = data;

    if (
      !username ||
      username.trim().length < 5 ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({ message: "Username is Invalid!" });
      return;
    }

    const client = await connectToDatabase("chat-app");

    const db = client.db();

    const existingUser = await db
      .collection("users")
      .findOne({ username: username });

    if (existingUser) {
      res.status(422).json({ message: "User already exists" });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);

    const result = await db.collection("users").insertOne({
      username: username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Created User!" });
    client.close();
  }
}

export default handler;
