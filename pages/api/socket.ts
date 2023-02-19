import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import { Server } from "socket.io";

import { ClientToServerEvents, ServerToClientEvents, SocketData, InterServerEvents } from '@/types/Messages';

interface SocketServer extends HTTPServer {
  io?: Server | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}


export default function socketHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log("Socket is already running!");
  } else {
    console.log("Socket is initializing!");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("getMsg", (msg) => {
        socket.broadcast.emit("sendMsg", msg);
      });
    });
  }
  res.end();
}
