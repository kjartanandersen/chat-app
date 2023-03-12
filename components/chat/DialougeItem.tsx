
import { Fragment } from "react";
import styles from "./DialougeItem.module.css";

interface IProps {
  username: string;
  message: string;
}

const DialougeItem = ({username, message}: IProps) => {
  return (
    <Fragment>
      <label className="title">{username}</label>
      <p className={""}> {message}</p>

    </Fragment>
  )
}

export default DialougeItem
