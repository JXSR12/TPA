import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home2.module.css';
import Link from 'next/link';
import axios from 'axios';
import { GRAPHQL_API, PROTECTED_QUERY, USERS_QUERY } from '@/utils/constants';
import Router, { useRouter } from 'next/router';
import { useSessionStorage } from 'usehooks-ts'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import Navbar from '@/components/navbar';
import Carousel, { ImageType } from '@/components/carousel';
import React from 'react';
import Recommendations from '@/components/recommendations';
import Searchs from '@/components/searchproduct';

const inter = Inter({ subsets: ['latin'] });

export default function SearchProduct() {

  const router = useRouter();
  const { search } = router.query;

  return (
    <>
      <Head>
        <title>Oldegg - Search '{search}'</title>
        <meta
          name="description"
          content="Oldegg search page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <main>
        <Searchs search={search as string}/>
      </main>
    </>
  );
}
