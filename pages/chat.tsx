import { useState, useEffect, useRef, MouseEvent } from "react";
import io, { Socket } from "socket.io-client";
import {
  IMessage,
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/Messages";

import styles from "./chat.module.css";

let socket: undefined | Socket;

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [msgIsValid, setMsgIsValid] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      socketInitializer();

  }, []);

  const socketInitializer = async () => {
    fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("sendMsg", (msg: IMessage) => {
      setMessages((prevMsg) => [...prevMsg, msg]);
    });
  };

  // socket.on("connect", () => {
  //   setIsConnected(true);
  // });

  // socket.on("disconnect", () => {
  //   setIsConnected(false);
  // });

  // socket.on("sendMsg", (msg: IMessage) => {
  //   setMessages((prevMsg) => [...prevMsg, msg]);
  // });

  const buttonClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      inputRef.current?.value === undefined ||
      inputRef.current.value === ""
    ) {
      setMsgIsValid(false);
    } else {
      const msg: IMessage = {
        username: "kjartan",
        message: inputRef.current.value,
      };

      if (socket !== undefined) {
        socket.emit("getMsg", msg);
        setMsgIsValid(true);
      }
    }
  };

  return (
    <div>
      <ul className={styles.chat_window}>
        {messages.map((msg) => (
          <li key={msg.message}>
            <p>
              {msg.username}: {msg.message}
            </p>
          </li>
        ))}
      </ul>
      <div className={styles.chat_input}>
        <input ref={inputRef} type="text" />
        <button
          className={msgIsValid ? styles.btnInvalid : ""}
          onClick={buttonClickHandler}
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Chat;
