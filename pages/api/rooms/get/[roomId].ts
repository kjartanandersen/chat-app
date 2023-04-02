import { NextApiRequest, NextApiResponse } from "next";
import { Sort, WithId } from "mongodb";
import { getServerSession } from "next-auth";

import { IMessage } from "@/types/Messages";

import { connectToDatabase } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]";

interface ErrorData {
  body: string;
}

async function getMessagesFromDb(roomName: string) {
  const client = await connectToDatabase("chat-app");

  const db = client.db();

  const query = { roomName: roomName };
  const limit: number = 100;
  const messages = db.collection<IMessage>("messages");

  const estimate = await messages.estimatedDocumentCount();

  let skipNum: number;

  if (estimate > 100) {
    skipNum = (estimate - limit);
  } else {
    skipNum = 0;
  }

  const data = await messages
    .find(query)
    .skip(skipNum)
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
    const { roomId } = req.query;
    if (typeof roomId !== "string") {
      res.status(400).json({ body: "Invalid path" });
      return;
    }
    const session = await getServerSession(req, res, authOptions);
    if (session) {
      const data = await getMessagesFromDb(roomId);

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
