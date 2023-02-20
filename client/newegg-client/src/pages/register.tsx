import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/Login.module.css';
import utilStyles from '@/styles/Utils.module.css';
import pwCheckStyles from '@/styles/PwCheck.module.css';
import { useState } from 'react';
import print from 'graphql'
import React from 'react';
import axios from 'axios'
import { GRAPHQL_API, REGISTER_QUERY } from '@/utils/constants';
import Router from 'next/router';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import validator from "validator";

const inter = Inter({ subsets: ['latin'] });

export default function Register() {

  // const [ jwtToken, setJwtToken ] = React.useState<string | null>(sessionStorage.getItem("jwtToken"));
  const [ inputName, setInputName ] = React.useState<string>("");
  const [ inputEmail, setInputEmail ] = React.useState<string>("");
  const [ inputPhone, setInputPhone ] = React.useState<string>("");
  const [ inputPassword, setInputPassword ] = React.useState<string>("");
  const [ inputMailing, setInputMailing ] = React.useState<boolean>(false);

  const [ showError, setShowError ] = React.useState<boolean>(false);

  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState("");

  const [hidePassword, setHidePassword] = useState(true);

  const handlePassword = (passwordValue: any) => {
    const strengthChecks = {
      length: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false,
    };

    strengthChecks.length = passwordValue.length >= 8 ? true : false;
    strengthChecks.hasUpperCase = /[A-Z]+/.test(passwordValue);
    strengthChecks.hasLowerCase = /[a-z]+/.test(passwordValue);
    strengthChecks.hasDigit = /[0-9]+/.test(passwordValue);
    strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(passwordValue);

    let verifiedList = Object.values(strengthChecks).filter((value) => value);

    let strength =
      verifiedList.length == 5
        ? "Strong"
        : verifiedList.length >= 2
        ? "Medium"
        : "Weak";

    setInputPassword(passwordValue);
    setProgress(`${(verifiedList.length / 5) * 100}%`);
    setMessage(strength);

    console.log("verifiedList: ", `${(verifiedList.length / 5) * 100}%`);
  };

  const getActiveColor = (type: any) => {
    if (type === "Strong") return "#8BC926";
    if (type === "Medium") return "#FEBD01";
    return "#FF0054";
  };

  const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputName(event.target.value);
  }
  const handleEmailChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputEmail(event.target.value);
  }
  const handlePhoneChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputPhone(event.target.value);
  }
  const handlePasswordChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputPassword(event.target.value);
  }
  const handleMailingChange = (event: React.ChangeEvent<{ value: any }>) => {
    setInputMailing(!inputMailing);
  }
  const handleSubmit = (e: any) => {
    if(!validator.isEmail(inputEmail) || !validator.isMobilePhone(inputPhone) || inputPassword.length < 8 || inputName.length < 5){
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2500)
      return
    }

    axios.post(GRAPHQL_API, {
      query: REGISTER_QUERY,
      variables: {
        name: inputName,
        email: inputEmail,
        phone: inputPhone,
        password: inputPassword,
        banned: false,
        role: "USER",
        mailing: inputMailing
      }
    }).then(res => {
      Router.push('/login')
      console.log(res.data.data.auth.register.token)
    })
    .catch(err => {
      console.log(inputName, inputEmail, inputPhone, inputPassword)
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2500)
      console.log(err)
    })

    e.preventDefault()
  }

  return (
    <>
      <Head>
        <title>Oldegg - Sign Up</title>
        <meta
          name="description"
          content="Oldegg sign up page"
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
        <span className={styles['text']}>Sign Up</span>
          <input
            type="text"
            placeholder="Full Name"
            required
            className={` ${styles['textinput']} ${styles['input']} `}
            value={inputName}
            onChange={handleNameChange}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            className={` ${styles['textinput']} ${styles['input']} `}
            value={inputEmail}
            onChange={handleEmailChange}
          />
          <input
            type="text"
            placeholder="Phone Number"
            required
            className={` ${styles['textinput']} ${styles['input']} `}
            value={inputPhone}
            onChange={handlePhoneChange}
          />
        <div className={pwCheckStyles['card-body']}>
          <div className={pwCheckStyles['input-container']}>
            <div className={pwCheckStyles['input-box']}>
              <input
                type={hidePassword ? "password" : "text"}
                placeholder="Password"
                required
                className={`${styles['textinput-no-border']}`}
                value={inputPassword}
                onChange={({ target }) => {
                  handlePassword(target.value);
                }}
              />

              <a
                href="#"
                className={pwCheckStyles['toggle-btn']}
                onClick={() => {
                  setHidePassword(!hidePassword);
                }}
              >
                <span
                  style={{ color: !hidePassword ? "#FF0054" : "#c3c3c3" }}
                >
                  {hidePassword ? <FaEye/>: <FaEyeSlash/>}
                </span>
              </a>
            </div>

            <div className={pwCheckStyles['progress-bg']}>
              <div
                className={pwCheckStyles['progress']}
                style={{
                  width: progress,
                  backgroundColor: getActiveColor(message),
                }}
              />
            </div>
          </div>

          {inputPassword.length !== 0 ? (
            <p className={pwCheckStyles['message']} style={{ color: getActiveColor(message) }}>
              Your password is {message}
            </p>
          ) : null}
        </div>
          <div className={styles['container3']}>
            <input type="checkbox" checked={inputMailing} className={`${styles['switch-checkbox']} `} id="switch" onChange={handleMailingChange}/>
            <label htmlFor="switch" className={`${styles['switch-label']} `}>a</label>
            <p className={`${styles['text09']} `}>Subscribe for exclusive email offers and discounts</p>
          </div>
          <button
            className={` ${styles['button']} ${styles['btntrans']} `}
            onClick={handleSubmit}
          >
            <span>
              <span>SIGN UP</span>
              <br></br>
            </span>
          </button>
          <div className={styles['container2']}>
            <span className={styles['text08']}>
              <span>Already a member?</span>
              <br></br>
              <br></br>
            </span>
            <a
              href="/login"
              rel="noreferrer noopener"
              className={styles['link']}
            >
              <span>Sign In!</span>
              <br></br>
              <br></br>
            </a>
          </div>
        <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>There is a problem with your registration. Please make sure all fields are valid!</div>
      </div>
    </div>
    </>
  );
}
