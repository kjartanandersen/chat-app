import { useState, useEffect, useRef, FormEvent, Fragment } from "react";
import io, { Socket } from "socket.io-client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { Session, getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { MongoClient, WithId } from "mongodb";

import { IMessage } from "@/types/Messages";

import { authOptions } from "../api/auth/[...nextauth]";

import styles from "./ChatRoom.module.css";

import Layout from "@/components/layout/Layout";
import DialougeItem from "@/components/chat/DialougeItem";
import DialogueForm from "@/components/chat/DialogueForm";
import Head from "next/head";
import { connectToDatabase } from "@/lib/db";
import { IRoomsWithId } from "@/types/Room";

let socket: undefined | Socket;

interface INewMessage {
  id: string;
  username: string;
  message: string;
}

const ChatRoom = ({ session }) => {
  const [initMessages, setInitMessages] = useState<WithId<IMessage>[]>(null);
  const [msgHasInit, setMsgHasInit] = useState<boolean>(false);
  const [messages, setMessages] = useState<INewMessage[]>([]);
  const [msgIsValid, setMsgIsValid] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  // const { data: session, status } = useSession();

  const router = useRouter();

  const { roomId } = router.query;

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
    <Fragment>
      <Head>
        <title>{roomId}</title>
      </Head>
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
                    <DialougeItem
                      message={msg.message}
                      username={msg.username}
                    />
                  </li>
                ))}

              {messages.length > 0 &&
                messages.map((msg) => (
                  <li className={styles.litem + " container"} key={msg.id}>
                    <DialougeItem
                      message={msg.message}
                      username={msg.username}
                    />
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
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => {
  const { req, res } = context;

  const { roomId } = context.query;

  let client: MongoClient;

  // Check if room exists
  try {
    client = await connectToDatabase("chat-app");

    const db = client.db();

    const room = await db.collection<IRoomsWithId>("rooms").findOne<IRoomsWithId>({nameSlug: roomId});

    if (room === null) {
      return {
        notFound: true,
      }
    }

  } catch (error) {
    console.log(error);

  }

  const session = await getServerSession(req, res, authOptions);

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
