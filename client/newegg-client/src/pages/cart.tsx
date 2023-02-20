import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home2.module.css';
import Link from 'next/link';
import axios from 'axios';
import { GRAPHQL_API, PROTECTED_QUERY, USERS_QUERY } from '@/utils/constants';
import Router from 'next/router';
import { useSessionStorage } from 'usehooks-ts'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import Navbar from '@/components/navbar';
import Carousel, { ImageType } from '@/components/carousel';
import React from 'react';
import Recommendations from '@/components/recommendations';
import Carts from '@/components/cartitems';


// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export default function Cart() {

  return (
    <>
      <Head>
        <title>Oldegg - Shopping Cart</title>
        <meta
          name="description"
          content="Oldegg cart page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <main>
        <Carts/>
      </main>
    </>
  );
}
