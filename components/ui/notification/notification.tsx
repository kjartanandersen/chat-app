import ReactDOM from "react-dom";

import styles from "./notification.module.css";

const notification = () => {
  return ReactDOM.createPortal(
    <div></div>,
    document.getElementById("notification")
  );
};

export default notification;
