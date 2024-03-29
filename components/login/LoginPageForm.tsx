import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { signIn } from "next-auth/react";

import styles from "./LoginPageForm.module.css";

const LoginPageForm = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    if (response.status === 422) {
      setError(true);
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
        router.replace("/rooms");
      } else {
        setError(true);
        setErrorMessage("Error: Invalid username or password!");
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
    setError(false);
    usernameRef.current.value = "";
    passwordRef.current.value = "";
  };

  return (
    <section className={styles.form}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      {error && <p className={styles.errorParagraph}>{errorMessage}</p>}
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
