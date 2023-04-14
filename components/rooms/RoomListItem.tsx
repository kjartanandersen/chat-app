import Link from "next/link";
import styles from "./RoomListItem.module.css";

interface IRoomListItemProps {
  name: string;
  slugName: string;
}

const RoomListItem = ({ name, slugName }: IRoomListItemProps) => {
  const linkPath = `/rooms/${slugName}`;

  return (
    <Link href={linkPath} className={styles.roomListItem}>
      <div >
        <h2>{name}</h2>
      </div>
    </Link>
  );
};

export default RoomListItem;
