import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { ICreateRoomForm } from "@/types/Room";
import { MongoClient } from "mongodb";

import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

interface ExtendsNextApiRequest extends NextApiRequest {
  body: ICreateRoomForm;
}

export default async function handler(
  req: ExtendsNextApiRequest,
  res: NextApiResponse
) {
  let client: MongoClient;

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "User is not authenticated!" });
    return;
  }

  if (req.method === "GET") {
    try {
      client = await connectToDatabase("chat-app");

      const db = client.db();

      const result = db.collection<ICreateRoomForm>("rooms").find({});

      const values = await result.toArray();

      await client.close();

      console.log(values);

      res.status(200).json(values);
      return;

    } catch (error) {
      res.status(500).json({
        message: {
          message: "Could not connect to database",
          error,
        },
      });
      await client.close();
      return;
    }
  } else if (req.method === "POST") {
    try {
      client = await connectToDatabase("chat-app");
    } catch (error) {
      res.status(500).json({
        message: {
          message: "Could not connect to database",
          error,
        },
      });
      client.close();
      return;
    }
    const db = client.db();
    const { name, createdBy } = req.body;

    if (!name || name.length < 5 || !createdBy) {
      res
        .status(422)
        .json({ message: "Error. Room name or name of creator undefined!" });
      client.close();
      return;
    }

    try {
      const result = await db.collection("rooms").insertOne({
        name: name,
        createdBy: createdBy,
      });
    } catch (error) {
      res.status(500).json({
        message: {
          message: "Could not insert to database",
          error,
        },
      });
      client.close();
      return;
    }
    client.close();
    res.status(201).json({ message: "Successfullly created room" });
  }

  req.statusCode = 200;
}
