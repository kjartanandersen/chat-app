import { ICreateRoomForm } from "@/types/Room";
import { Session } from "next-auth";
import { FormEvent, useRef } from "react";
import { WithId } from "mongodb";

import styles from "./CreateRoomForm.module.css";

interface IProps {
  session: Session;
  createRoomHandler: (room: ICreateRoomForm) => void;
}

const CreateRoomForm = ({ session, createRoomHandler }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const sendRoomData = async (roomData: ICreateRoomForm) => {
    const response = await fetch("/api/rooms", {
      method: "POST",
      body: JSON.stringify(roomData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || " Something went wrong!");
    }
  };

  const roomFormOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const roomData: ICreateRoomForm = {
      createdBy: session.user.username,
      name: inputRef.current.value,
    };

    sendRoomData(roomData);
    createRoomHandler(roomData);
  };

  return (
    <div>
      <form className={styles.createRoomForm} onSubmit={roomFormOnSubmit}>
        <label>Room Name</label>
        <input ref={inputRef} type="text" placeholder="Enter Room Name Here" />
        <div>
          <button>Create Room</button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoomForm;
