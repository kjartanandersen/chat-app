import { useState, useEffect, useRef, MouseEvent, FormEvent } from "react";
import io, { Socket } from "socket.io-client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { Session } from "next-auth";

import {
  IMessage,
} from "@/types/Messages";

import styles from "./chat.module.css";
import { useRouter } from "next/router";

let socket: undefined | Socket;

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [msgIsValid, setMsgIsValid] = useState(true);

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {data: session, status} = useSession();

  const router = useRouter();

  useEffect(() => {
    socketInitializer();
    inputRef.current?.focus();
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

  const sendMessageHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(session?.user.username)

    if (
      inputRef.current?.value === undefined ||
      inputRef.current.value === "" ||
      !session
    ) {
      setMsgIsValid(false);
    } else {
      const msg: IMessage = {
        username: session.user.username,
        message: inputRef.current.value,
      };

      if (socket !== undefined && session.user.username) {
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
    }
  };

  if (!session) {
    router.replace("/");
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
      <form className={styles.chat_input} onSubmit={sendMessageHandler}>
        <input ref={inputRef} type="text" />
        <button
          className={msgIsValid ? styles.btnInvalid : ""}

        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{session: Session | null}> = async (context) => {
  const session = await getSession(context);


  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  console.log(session.user.username)

  return {
    props: { session },
  };
};

export default Chat;
