import { Fragment } from 'react'

import LoginPageForm from './LoginPageForm';

import styles from './LoginPage.module.css';

const LoginPage = () => {
  return (
    <Fragment>
      <div className={styles.loginPage}>Login Page</div>
      <LoginPageForm />
    </Fragment>
  )
}

export default LoginPage;
