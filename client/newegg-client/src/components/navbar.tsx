import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home2.module.css';
import searchStyles from '@/styles/SearchBar.module.css'
import Link from 'next/link';
import Router from 'next/router';
import { useSessionStorage } from 'usehooks-ts'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import axios from 'axios';
import { GETUSER_QUERY, GRAPHQL_API, USERS_QUERY } from '@/utils/constants';
import { User } from '@/interfaces/user';
import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdClose } from 'react-icons/io'
import { IoPersonCircleSharp } from 'react-icons/io5'

export default function Navbar(){
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ authUserId, setAuthUserId ] = useSessionStorage('authUserId', 'NULL');
  const [ searchQuery, setSearchQuery ] = React.useState<string>("");
  const [ mobile, setMobile ] = React.useState<boolean>(false);
  const [ userName, setUserName ] = React.useState<string>("My Profile");

  const getUser = () => {
    axios.post(GRAPHQL_API, {
      query: GETUSER_QUERY
    },{
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      setUserName(res.data.data.getUser.name)
    }).catch(err => {
      console.log(err)
    })
  }

  const handleSearchChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchQuery(event.target.value);
  }

  const toggleMobileMenu = () => {
    setMobile(!mobile);
  }

  const signOut = () => {
    Router.push('/login')
    setJwtToken('NULL');
  }

  const handleSearch = (event: any) => {
    if(searchQuery.length > 0){
      window.location.href = '/search?search=' + searchQuery
    }
  }

  React.useEffect(() => {
    getUser()
  }, [jwtToken]);

  return(
    <HydrationProvider>
      <Client>
      <div className={styles['container']}>
      <header data-thq="thq-navbar" className={styles['navbar-interactive']}>

      {/* + (mobile ? `${styles['desktop-inactive']}` : "") */}


        <div
          data-thq="thq-navbar-nav"
          data-role="Nav"
          className={`${styles['desktop-menu']}`}
        >
          <a href='/'>
          <Image
              src="/logo.svg"
              alt="Logo"
              height={150}
              width={450}
              className={styles['image']}
              priority
            />
          </a>
          <div className={searchStyles['search-form']} role="search">
            <label htmlFor='search' className={searchStyles['label']}>Search</label>
            <input className={searchStyles['input']} id="search" type="search" onChange={handleSearchChange} placeholder="Search anything..." autoFocus required />
            <button className={searchStyles['button']} type="submit" onClick={handleSearch}>Go</button>
          </div>
          <nav
            data-thq="thq-navbar-nav-links"
            data-role="Nav"
            className={styles['nav']}
          >

            <Link href={jwtToken !== 'NULL' ? "/" : "/login"} className={styles['navlink']}>
              Select Address
            </Link>
            <Link href={jwtToken !== 'NULL' ? "/" : "/login"} className={styles['navlink']}>
              Returns &amp; Orders
            </Link>
            <Link href={jwtToken !== 'NULL' ? "/cart" : "/login"} className={styles['navlink']}>
              <span>Cart</span>
              <br></br>
            </Link>

          </nav>

        </div>


        <div className={styles['burger-menu']} onClick={toggleMobileMenu}>
            <GiHamburgerMenu/>
        </div>


        <Link href={jwtToken !== 'NULL' ? "/profile" : "/login"} className={styles['username']}>
              <IoPersonCircleSharp/> &nbsp; {userName}
        </Link>

        {
            jwtToken !== 'NULL' &&
          <button onClick={signOut} className={` ${styles['button-orange']} ${styles['btntrans']}  ${styles['button']} `}>
            Sign Out
          </button>
          }
          {
            jwtToken === 'NULL' &&
          <button onClick={() => Router.push('/login')} className={` ${styles['button-orange']} ${styles['btntrans']}  ${styles['button']} `}>
            Sign In / Register
          </button>
          }


        <div className={(mobile ? `${styles['mobile-active']}` : `${styles['mobile-menu']}`)}>
          <div
            data-role="Nav"
            className={styles['nav1']}
          >
            <div className={styles['container1']}>
            <Image
              src="/logo.svg"
              alt="Logo"
              height={150}
              width={450}
              className={styles['image']}
              priority
            />
              <div data-thq="thq-close-menu" className={styles['menu-close']} onClick={toggleMobileMenu}>
                <IoMdClose className={styles['close-icon']}/>
              </div>
            </div>
            <nav
              data-thq="thq-mobile-menu-nav-links"
              data-role="Nav"
              className={styles['nav2']}
            >
              <div className={searchStyles['search-form-m']} role="search">
                <label htmlFor='search' className={searchStyles['label']}>Search</label>
                <input className={searchStyles['input']} id="search" type="search" onChange={handleSearchChange} placeholder="Search anything..." autoFocus required />
                <button className={searchStyles['button']} type="submit" onClick={handleSearch}>Go</button>
              </div>
              <Link href={jwtToken !== 'NULL' ? "/" : "/login"} className={styles['text-m']}>
                Select Address
              </Link>
              <Link href={jwtToken !== 'NULL' ? "/" : "/login"} className={styles['text-m']}>
                Returns &amp; Orders
              </Link>
              <Link href={jwtToken !== 'NULL' ? "/cart" : "/login"} className={styles['text-m']}>
                <span>Cart</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </div>
    </Client>
    </HydrationProvider>
  )
}
