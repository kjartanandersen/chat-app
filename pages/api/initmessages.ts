import { NextApiRequest, NextApiResponse } from "next";
import { WithId } from "mongodb";
import { getServerSession } from "next-auth";

import { IMessage } from "@/types/Messages";

import { connectToDatabase } from "@/lib/db";
import { authOptions } from "./auth/[...nextauth]";

interface ErrorData {
  body: string;
}

async function getMessagesFromDb() {
  const client = await connectToDatabase("chat-app");

  const db = client.db();

  const query = {};
  const limit: number = 100;

  const data = await db
    .collection<IMessage>("messages")
    .find(query)
    .limit(limit)
    .toArray();
  // console.log(data[0].message)
  client.close();
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WithId<IMessage>[] | ErrorData>
) {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (session) {
      const data = await getMessagesFromDb();

      if (!data) {
        res.status(422).json({ body: "Error getting chat messages" });
        return;
      }

      res.status(200).json(data);
    } else {
      res.send({
        body: "You must be signed in!",
      });
    }
  }

  req.statusCode = 200;
}
