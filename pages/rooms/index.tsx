import Layout from "@/components/layout/Layout";
import CreateRoomForm from "@/components/rooms/CreateRoomForm";
import RoomListItem from "@/components/rooms/RoomListItem";
import { ICreateRoomForm, IRoomsWithId } from "@/types/Room";
import { WithId } from "mongodb";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";

import styles from "./Room.module.css";

const Rooms = () => {
  const [createRoomEnabled, setCreateRoomEnabled] = useState<boolean>(false);
  const { data: session, status } = useSession();

  const [rooms, setRooms] = useState<IRoomsWithId[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllRooms().then((data) => {
      if (isLoading) {
        setRooms(data);
        setIsLoading(false);
      }
    });
  }, [isLoading]);

  const createRoomBtnHandler = (e: React.MouseEvent) => {
    e.preventDefault();

    setCreateRoomEnabled(!createRoomEnabled);
  };

  const getAllRooms = async () => {
    let data: IRoomsWithId[];

    try {
      const response = await fetch("/api/rooms");
      data = await response.json();
    } catch (error) {
      throw new Error(error);
    }
    return data;
  };

  const addRoomHandler = (room: IRoomsWithId) => {
    setRooms([...rooms, room]);
  };

  return (
    <Layout>
      {createRoomEnabled && (
        <CreateRoomForm session={session} createRoomHandler={addRoomHandler} />
      )}
      <div className={styles.roomHeader}>
        <h1>Rooms</h1>
        <button onClick={createRoomBtnHandler}>+ Create Room</button>
      </div>
      {isLoading && <h2>Loading...</h2>}
      {!isLoading && (
        <div className={styles.roomList}>
          {rooms.map((room) => (
            <RoomListItem name={room.name} key={room._id} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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
    props: {
      session,
    },
  };
};

export default Rooms;
