import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import { Server } from "socket.io";
import { connectToDatabase } from "@/lib/db";
import { IMessage } from "@/types/Messages";

interface SocketServer extends HTTPServer {
  io?: Server | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

async function insertMsgToDb(msg: IMessage) {
  const client = await connectToDatabase("chat-app");

  const db = client.db();

  const result = await db.collection<IMessage>("messages").insertOne({
    username: msg.username,
    message: msg.message,
    roomName: msg.roomName,
  });

  if (result.acknowledged) {
    client.close();

    return result;
  } else {
    client.close();
    throw new Error("Could not insert message");
  }
}

export default async function socketHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log("Socket is already running!");
  } else {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", async (socket) => {
      console.log(`${socket.id} Connected!`);
      socket.on("getMsg", async (msg) => {
        const result = await insertMsgToDb(msg);
        if (result.acknowledged) {
          socket.broadcast.emit("sendMsg", msg);
        } else {
          throw new Error("Could not insert message");
        }
      });
    });
  }
  res.end();
}
