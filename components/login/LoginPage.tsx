import { Fragment, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import LoginPageForm from "./LoginPageForm";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace("/rooms");
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <LoginPageForm />
    </Fragment>
  );
};

export default LoginPage;
