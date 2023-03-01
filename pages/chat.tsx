import { useState, useEffect, useRef, MouseEvent, FormEvent } from "react";
import io, { Socket } from "socket.io-client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import {
  IMessage,
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/Messages";

import UsernameForm from "@/components/chat/UsernameForm";

import styles from "./chat.module.css";

let socket: undefined | Socket;

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [msgIsValid, setMsgIsValid] = useState(true);
  const [username, setUsername] = useState<string>("");

  const usernameInputRef = useRef<HTMLInputElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    if (socket) {
      return;
    }
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
        username: username,
        message: inputRef.current.value,
      };

      if (socket !== undefined) {
        socket.emit("getMsg", msg);
        setMsgIsValid(true);
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    }
  };

  const usernameButtonHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      usernameInputRef.current?.value == null ||
      usernameInputRef.current?.value === ""
    ) {
      alert(`Username is incorrect`);
    } else {
      setUsername(usernameInputRef.current.value);
    }
  };

  if (username === "") {
    return (
      <UsernameForm
        UsernameInputRef={usernameInputRef}
        usernameButtonHandler={usernameButtonHandler}
      />
    );
  }

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default Chat;
