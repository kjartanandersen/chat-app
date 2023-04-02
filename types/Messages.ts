export interface IMessage {
  username: string;
  message: string;
  roomName: string;
}


export interface ServerToClientEvents {
  sendMsg: (msg: IMessage) => void;
}

export interface ClientToServerEvents {
  getMsg: (msg: IMessage) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
