import LoginPage from "@/components/login/LoginPage";
import Layout from "@/components/layout/Layout";
import Head from "next/head";
import { Fragment } from "react";

function Home() {
  return (
    <Fragment>
      <Head>
        <title>Login / Signup</title>
      </Head>
      <Layout>
        <LoginPage />
      </Layout>
    </Fragment>
  );
}

export default Home;
