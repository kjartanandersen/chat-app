import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { signIn, getSession, useSession } from "next-auth/react";

import styles from "./LoginPageForm.module.css";

const LoginPageForm = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    usernameRef.current?.focus();

  }, [usernameRef]);

  async function createUser(username: string, password: string) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response) {
      throw new Error(data.message || "Something went wrong!");
    }

    return data;
  }

  const loginSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (isLogin) {
      // log user in
      const result = await signIn("credentials", {
        redirect: false,
        username: username,
        password: password,
      });

      if (result && !result.error) {
        router.replace("/chat");
      }
    } else {
      // sign up user
      try {
        if (username && password) {
          const response = await createUser(username, password);

        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const switchLoginHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <section className={styles.form}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={loginSubmitHandler} className={styles.formItems}>
        <div>
          <label htmlFor="username" className={styles.control}>
            Username:
          </label>
          <input type="text" ref={usernameRef} required></input>
        </div>

        <div>
          <label htmlFor="password" className={styles.control}>
            Password:
          </label>
          <input type="password" ref={passwordRef} required></input>
        </div>
        <div className={styles.buttons}>
          <button className={styles.formBtn}>
            {isLogin ? "Login" : "Create Account"}
          </button>
          <button
            className={styles.formBtn}
            type="button"
            onClick={switchLoginHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default LoginPageForm;
