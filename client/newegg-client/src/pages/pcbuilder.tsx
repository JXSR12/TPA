import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Profile.module.scss'
import utilStyles from '@/styles/Utils.module.css';
import actionStyles from '@/styles/Profile.module.scss'
import listStyles from '@/styles/Modal.module.css';
import searchStyles from '@/styles/SearchBar.module.css'
import Link from 'next/link';
import axios from 'axios';
import { ADDTOCART_QUERY, GETUSER_QUERY, GRAPHQL_API, PROTECTED_QUERY, UPDATEPASSWORD_QUERY, UPDATEPROFILE_QUERY, USERS_QUERY, USERTRANSHEADERS_QUERY } from '@/utils/constants';
import Router from 'next/router';
import { useSessionStorage } from 'usehooks-ts'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import Navbar from '@/components/navbar';
import Carousel, { ImageType } from '@/components/carousel';
import React from 'react';
import Recommendations from '@/components/recommendations';
import Carts, { DUMMY_DISTANCE } from '@/components/cartitems';
import validator from "validator";
import { FaAddressCard, FaBan, FaBroom, FaCamera, FaCameraRetro, FaCartPlus, FaEnvelope, FaKey, FaMobile, FaMoneyBill, FaPhone, FaRegEye, FaSave, FaStar, FaTrash, FaUser } from 'react-icons/fa';
import useChat from '@/hooks/useChat';
import { TopUpVoucherModal } from '@/components/modal';
import { TransactionDetail, TransactionHeader } from '@/interfaces/transaction';
import { Shipment } from '@/interfaces/shipment';
import Footer from '@/components/footer';


// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export default function PCBuilderPage() {
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);


  return (
    <>
      <Head>
        <title>Oldegg - PC Builder</title>
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
              <h1 className={styles['title']}>PC Builder</h1>
            </div>
            <br/>
            <br/>
            <br/>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
