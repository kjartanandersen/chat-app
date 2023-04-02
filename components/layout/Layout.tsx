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
    <div className={styles.page}>
      <header>
        <nav>
          <div className={styles.layout}>
            {session && (
              <button className={styles.signBtn} onClick={btnSignOutHandler}>
                Sign Out
              </button>
            )}
          </div>
        </nav>
      </header>
      <main>{props.children}</main>
      <footer>
        <div className={styles.layoutFooter}>
          <p>By Kjartan Már Andersen</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
