import React from "react";
import { signOut, useSession } from "next-auth/react";

import styles from "./Layout.module.css";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  const { data: session, status } = useSession();

  const btnSignOutHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut({ callbackUrl: "/" });
  };

  return (
    <div>
      <div className={styles.layout}>
        <div>
          {session && <button className={styles.signBtn} onClick={btnSignOutHandler}>Sign Out</button>}
        </div>
      </div>
      {props.children}
    </div>
  );
};

export default Layout;
