import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Profile.module.scss'
import utilStyles from '@/styles/Utils.module.css';
import Link from 'next/link';
import axios from 'axios';
import { GETUSER_QUERY, GRAPHQL_API, PROTECTED_QUERY, UPDATEPASSWORD_QUERY, UPDATEPROFILE_QUERY, USERS_QUERY } from '@/utils/constants';
import Router from 'next/router';
import { useSessionStorage } from 'usehooks-ts'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import Navbar from '@/components/navbar';
import Carousel, { ImageType } from '@/components/carousel';
import React from 'react';
import Recommendations from '@/components/recommendations';
import Carts from '@/components/cartitems';
import validator from "validator";
import { FaAddressCard, FaBan, FaBroom, FaCamera, FaCameraRetro, FaEnvelope, FaKey, FaMobile, FaPhone, FaSave, FaUser } from 'react-icons/fa';


// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export default function ProfilePage() {
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');

  const [ inputName, setInputName ] = React.useState<string>("");
  const [ inputEmail, setInputEmail ] = React.useState<string>("");
  const [ inputPhone, setInputPhone ] = React.useState<string>("");
  const [ inputPassword, setInputPassword ] = React.useState<string>("");

  const [ inputOldPass, setInputOldPass ] = React.useState<string>("");
  const [ inputNewPass, setInputNewPass ] = React.useState<string>("");
  const [ inputNewPassConfirm, setInputNewPassConfirm ] = React.useState<string>("");

  const [ changePw, setChangePw ] = React.useState<boolean>(false);

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputName(event.target.value);
  }
  const handleEmailChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputEmail(event.target.value);
  }
  const handlePhoneChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputPhone(event.target.value);
  }
  const handleOldPassChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputOldPass(event.target.value);
  }
  const handleNewPassChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputNewPass(event.target.value);
  }
  const handleNewPassConfirmChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputNewPassConfirm(event.target.value);
  }

  const getUser = () => {
    axios.post(GRAPHQL_API, {
      query: GETUSER_QUERY
    },{
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      setInputName(res.data.data.getUser.name)
      setInputEmail(res.data.data.getUser.email)
      setInputPhone(res.data.data.getUser.phone)
      setInputPassword("PASSWORDPASSWORD")
    }).catch(err => {
      console.log(err)
    })
  }

  const toggleChangePw = () => {
    setChangePw(!changePw)
  }

  const deleteAccount = () => {
    alert("Account deletion is still WIP")
  }

  const clearAllFields = () => {
    setInputName("");
    setInputPhone("");
  }

  const handleSave = () => {
    if(!validator.isMobilePhone(inputPhone) || inputName.length < 5){
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      return;
    }

    if(changePw === true && inputNewPass.length > 0){
      handleUpdatePassword()
    }

    axios.post(GRAPHQL_API, {
      query: UPDATEPROFILE_QUERY(inputName, inputPhone)
    },{
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      setInputName(res.data.data.updateUser.name)
      setInputEmail(res.data.data.updateUser.email)
      setInputPhone(res.data.data.updateUser.phone)
      setInputPassword("PASSWORDPASSWORD")
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log(err)
    })
  }

  const handleUpdatePassword = () => {
    if(inputNewPass.length < 8 || inputNewPass !== inputNewPassConfirm || inputOldPass.length < 8){
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      return;
    }

    axios.post(GRAPHQL_API, {
      query: UPDATEPASSWORD_QUERY(inputOldPass, inputNewPass)
    },{
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      setInputName(res.data.data.updateUserPassword.name)
      setInputEmail(res.data.data.updateUserPassword.email)
      setInputPhone(res.data.data.updateUserPassword.phone)
      setInputPassword("PASSWORDPASSWORD")
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log(err)
    })
  }

  React.useEffect(() => {
    getUser()
  }, [jwtToken]);

  return (
    <>
      <Head>
        <title>Oldegg - Profile</title>
        <meta
          name="description"
          content="Oldegg profile page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <main className={`${styles['main']} ${styles['has-dflex-center']}`}>
        <section>
          <div className={styles['lx-container-70']}>
            <div className={styles['lx-row']}>
              <h1 className={styles['title']}>My Profile</h1>
            </div>
            <div className={`${styles['lx-row']} ${styles['align-stretch']}`}>
              <div className={`${styles['lx-column']} ${styles['column-user-pic']}`}>
                <div className={`${styles['profile-pic']} ${styles['bs-md']}`}>
                  <h1 className={`${styles['pic-label']}`}>Display Picture</h1>
                  <div className={`${styles['pic']} ${styles['bs-md']}`}>
                    <img src="https://res.cloudinary.com/dcy3tftwo/image/upload/v1676907609/images/Profile_avatar_placeholder_large_jphbqz.png" alt="" width="4024" height="6048" loading="lazy"/>
                    <a id="change-avatar" className={`${styles['lx-btn']}`}><FaCamera/>&nbsp;&nbsp;Profile pictures are coming soon</a>
                  </div>
                  <div className={`${styles['pic-info']}`}>
                    <p><i className="fas fa-exclamation-triangle"></i>&nbsp;&nbsp;This picture will appear on your profile, posts, reviews, and other user interactions.</p>
                  </div>
                </div>
              </div>
              <div className={`${styles['lx-column']}`}>
                <form action='get'>
                <div className={`${styles['fieldset']}`}>
                    <label htmlFor="email">Registered Email</label>
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaEnvelope/></span>
                      <input type="email" readOnly id="email" placeholder="Email Address" onChange={handleEmailChange} value={inputEmail} autoComplete="username"/>
                    </div>
                    <div id="email-helper" className={`${styles['helper']}`}>Your email address. (You cannot change this)</div>
                  </div>

                  <div className={`${styles['fieldset']}`}>
                    <label htmlFor="user-name">Display Name</label>
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaUser/></span>
                      <input type="text" id="user-name" placeholder="Display Name" onChange={handleNameChange} value={inputName} autoComplete="username" required/>
                    </div>
                    <div id="user-name-helper" className={`${styles['helper']}`}>
                      <p>Your profile name.</p>
                    </div>
                  </div>

                  <div className={`${styles['fieldset']}`}>
                    <label htmlFor="phone-num">Mobile Phone</label>
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaMobile/></span>
                      <input type="tel" id="phone-num" placeholder="Mobile Phone" onChange={handlePhoneChange} value={inputPhone} required/>
                    </div>
                    <div id="phone-num-helper" className={`${styles['helper']}`}>Your mobile phone number.</div>
                  </div>

                  <div className={`${styles['fieldset']}`}>
                    <label htmlFor="pass">{changePw ? "Change Password" : "Password"}</label>
                    {!changePw &&
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaKey/></span>
                      <input type="password" readOnly id="pass" placeholder="Password" value={inputPassword} autoComplete="current-password"/>
                    </div>
                    }

                    {changePw &&
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaKey/></span>
                      <input type="password" id="pass-old" placeholder="Your Current Password" onChange={handleOldPassChange} value={inputOldPass} autoComplete="current-password"/>
                    </div>
                    }
                    {changePw &&
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaKey/></span>
                      <input type="password" id="pass-new" placeholder="Your New Password" onChange={handleNewPassChange} value={inputNewPass} autoComplete="new-password"/>
                    </div>
                    }
                    {changePw &&
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaKey/></span>
                      <input type="password" id="pass-new-confirm" placeholder="Confirm New Password" onChange={handleNewPassConfirmChange} value={inputNewPassConfirm} autoComplete="new-password-confirm"/>
                    </div>
                    }

                    <div id="pass-helper" className={`${styles['helper']}`}>{!changePw? "Your password, keep it secret." : "Make sure to use a strong one."}</div>
                    &nbsp;
                    <a className={`${styles['changepw-link']}`} onClick={toggleChangePw}>{!changePw ? "Change it here" : "Cancel"}</a>
                  </div>

                  <div className={`${styles['actions']}`}>
                    <a id="cancel" className={`${styles['lx-btn']} ${styles['cancel']}`} onClick={deleteAccount}><FaBan/>&nbsp;&nbsp;Delete Account</a>
                    <a id="clear" className={`${styles['lx-btn']} ${styles['clear']}`} onClick={clearAllFields}><FaBroom/>&nbsp;&nbsp;Clear All</a>
                    <a id="save" className={`${styles['lx-btn']} ${styles['save']}`} onClick={handleSave}><FaSave/>&nbsp;&nbsp;Save Changes</a>
                  </div>
                  </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Please make sure all the updated fields are valid!</div>
      <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Sucessfully updated profile!</div>
    </>
  );
}
