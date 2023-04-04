import Link from "next/link";
import styles from "./RoomListItem.module.css";

interface IRoomListItemProps {
  name: string;
}

const RoomListItem = ({ name }: IRoomListItemProps) => {
  const linkPath = `/rooms/${name}`;

  return (
    <Link href={linkPath}>
      <div className={styles.roomListItem}>
        <h2>{name}</h2>
      </div>
    </Link>
  );
};

export default RoomListItem;
