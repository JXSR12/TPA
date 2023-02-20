import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/Login.module.css';
import utilStyles from '@/styles/Utils.module.css';
import React from 'react';
import axios from 'axios';
import { GRAPHQL_API, LOGIN_QUERY } from '@/utils/constants';
import Router from 'next/router';
import { useSessionStorage } from 'usehooks-ts'

// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export default function Login() {
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ inputEmail, setInputEmail ] = React.useState<string>("");
  const [ inputPassword, setInputPassword ] = React.useState<string>("");

  const [ showError, setShowError ] = React.useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputEmail(event.target.value);
  }
  const handlePasswordChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputPassword(event.target.value);
  }

  React.useEffect(() => {
    if(jwtToken !== 'NULL'){
      Router.push('/')
    }
  }, []);

  const handleSubmit = (e: any) => {
    axios.post(GRAPHQL_API, {
      query: LOGIN_QUERY,
      variables: {
        email: inputEmail,
        password: inputPassword
      }
    }).then(res => {
      console.log("From API         : " + res.data.data.auth.login.token)
      setJwtToken(res.data.data.auth.login.token)
      console.log("Saved in Storage : " + jwtToken)

      Router.push('/')
    })
    .catch(err => {
      console.log("ERROR")
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2500)
      console.log(err)
    })

    e.preventDefault()
  }

  return (
    <>
      <Head>
        <title>Oldegg - Sign In</title>
        <meta
          name="description"
          content="Oldegg sign in page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles['container']}>
      <div className={styles['container1']}>
        <Image
                src="/logo.svg"
                alt="Logo"
                height={150}
                width={450}
                className={styles['image']}
                priority
        />
        <span className={styles['text']}>Sign In</span>
        <form className={styles['form']} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email Address"
            required
            className={` ${styles['textinput']}`}
            value={inputEmail}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className={` ${styles['textinput']}`}
            value={inputPassword}
            onChange={handlePasswordChange}
          />
          <button
            className={` ${styles['button']} ${styles['btntrans']} `}
          >
            <span>
              <span>SIGN IN</span>
              <br></br>
            </span>
          </button>
          <button
            type="button"
            className={` ${styles['button1']} ${styles['button']} ${styles['btntrans']} `}
            onClick={e => {}}
          >
            <span>
              <span>GET ONE-TIME SIGN IN CODE</span>
              <br></br>
            </span>
          </button>
          <span className={styles['text07']}>
            What&apos;s one-time sign in code?
          </span>
          <div className={styles['container2']}>
            <span className={styles['text08']}>
              <span>New to Oldegg?</span>
              <br></br>
              <br></br>
            </span>
            <a
              href="/register"
              rel="noreferrer noopener"
              className={styles['link']}
            >
              <span>Sign Up!</span>
              <br></br>
              <br></br>
            </a>
          </div>
        </form>
        <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Invalid user credentials. Please try again</div>
      </div>
    </div>
    </>
  );
}
