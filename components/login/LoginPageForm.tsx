import { FormEvent, useEffect, useRef } from "react";
import styles from "./LoginPageForm.module.css";

const LoginPageForm = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, [usernameRef]);

  const loginSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(usernameRef.current?.value);
  };

  return (
    <div>
      <form onSubmit={loginSubmitHandler}>
        <label>
          Username:
          <input type="text" ref={usernameRef}></input>
        </label>
        <label>
          Password:
          <input type="password" ref={passwordRef}></input>
        </label>
        <input type="submit" value="submit" />
      </form>
    </div>
  );
};

export default LoginPageForm;
