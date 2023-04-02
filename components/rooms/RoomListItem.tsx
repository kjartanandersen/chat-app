import Link from "next/link";
import styles from "./RoomListItem.module.css";

interface IRoomListItemProps {
  name: string;
}

const RoomListItem = ({ name }: IRoomListItemProps) => {
  const linkPath = `/rooms/${name}`;

  return (
    <div className={styles.roomListItem}>
      <h2>{name}</h2>
      <Link href={linkPath}>
        <button className={styles.roomListItemBtn}>{"->"}</button>
      </Link>
    </div>
  );
};

export default RoomListItem;
