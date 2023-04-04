import React from "react";
import { signOut, useSession } from "next-auth/react";

import styles from "./Layout.module.css";
import { useRouter } from "next/router";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  const { data: session, status } = useSession();

  const router = useRouter();

  const btnSignOutHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut({ callbackUrl: "/" });
  };

  const btnGoToRooms = (e: React.MouseEvent) => {
    e.preventDefault();
    router.replace("/rooms");
  };

  return (
    <div className={styles.page}>
      <header>
        <nav>
          <div className={styles.layout}>
            {session && (
              <ul>
                <li>
                  <button
                    className={styles.signBtn}
                    onClick={btnSignOutHandler}
                  >
                    Sign Out
                  </button>
                </li>
                <li>
                  <button
                    className={styles.signBtn}
                    onClick={btnGoToRooms}
                  >
                    Rooms
                  </button>
                </li>
              </ul>
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
