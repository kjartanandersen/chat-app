import styles from "./RoomListItem.module.css";

interface IRoomListItemProps {
  name: string;
}

const RoomListItem = ({ name }: IRoomListItemProps) => {
  return <div className={styles.roomListItem}>{name}</div>;
};

export default RoomListItem;
