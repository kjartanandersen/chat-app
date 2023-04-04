import { useState, useEffect, useRef, FormEvent } from "react";
import io, { Socket } from "socket.io-client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { WithId } from "mongodb";

import { IMessage } from "@/types/Messages";

import styles from "./ChatRoom.module.css";

import Layout from "@/components/layout/Layout";
import DialougeItem from "@/components/chat/DialougeItem";
import DialogueForm from "@/components/chat/DialogueForm";

let socket: undefined | Socket;

interface INewMessage {
  id: string;
  username: string;
  message: string;
}

const ChatRoom = () => {
  const [initMessages, setInitMessages] = useState<WithId<IMessage>[]>(null);
  const [msgHasInit, setMsgHasInit] = useState<boolean>(false);
  const [messages, setMessages] = useState<INewMessage[]>([]);
  const [msgIsValid, setMsgIsValid] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    socketInitializer();
    if (!msgHasInit) {
      fetch(`/api/rooms/get/${router.query.roomId}`)
        .then((response) => response.json())
        .then((data) => {
          setInitMessages(data);
        });
    }
    inputRef.current?.focus();
  }, [msgHasInit, router]);

  const socketInitializer = async () => {
    if (socket) {
      return;
    }
    fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("sendMsg", (msg: INewMessage) => {
      setMessages((prevMsg) => [...prevMsg, msg]);
    });
  };

  const sendMessageHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      inputRef.current?.value === undefined ||
      inputRef.current.value === "" ||
      !session
    ) {
      setMsgIsValid(false);
    } else {
      const { roomId } = router.query;
      if (typeof roomId !== "string") {
        return;
      }

      const msg: INewMessage = {
        id: new Date().toISOString(),
        username: session.user.username,
        message: inputRef.current.value,
      };

      const msgToSend: IMessage = {
        username: session.user.username,
        message: inputRef.current.value,
        roomName: roomId,
      };

      if (socket !== undefined && session.user.username) {
        socket.emit("getMsg", msgToSend);
        setMsgIsValid(true);
        setMessages((prevMessages) => [...prevMessages, msg]);
        inputRef.current.value = "";
      }
    }
  };

  if (!session) {
    router.replace("/");
  }

  return (
    <Layout>
      {!initMessages && <p>Loading...</p>}
      {initMessages && (
        <div className={styles.chat}>
          <ul>
            {initMessages.length > 0 &&
              initMessages.map((msg) => (
                <li
                  className={styles.litem + " container"}
                  key={msg._id.toString()}
                >
                  <DialougeItem message={msg.message} username={msg.username} />
                </li>
              ))}

            {messages.length > 0 &&
              messages.map((msg) => (
                <li className={styles.litem + " container"} key={msg.id}>
                  <DialougeItem message={msg.message} username={msg.username} />
                </li>
              ))}
          </ul>

          <DialogueForm
            inputRef={inputRef}
            sendMessageHandler={sendMessageHandler}
          />
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => {
  const session = await getSession(context);

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

export default ChatRoom;
