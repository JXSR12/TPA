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


// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export default function Home() {

  const [images, setImages] = React.useState<ImageType[]>()

  React.useEffect(() => {
    setImages([
      { id: 1, url: 'https://res.cloudinary.com/dcy3tftwo/image/upload/v1676046241/promos/promo1_pub9yj.jpg' },
      { id: 2, url: 'https://res.cloudinary.com/dcy3tftwo/image/upload/v1676046239/promos/promo2_mbtnpo.jpg' },
      { id: 3, url: 'https://res.cloudinary.com/dcy3tftwo/image/upload/v1676046239/promos/promo2_mbtnpo.jpg' },
      { id: 4, url: 'https://res.cloudinary.com/dcy3tftwo/image/upload/v1676046256/promos/promo4_fqopqu.jpg' },
      { id: 5, url: 'https://res.cloudinary.com/dcy3tftwo/image/upload/v1676046239/promos/promo5_qben28.jpg' },
      { id: 6, url: 'https://res.cloudinary.com/dcy3tftwo/image/upload/v1676046241/promos/promo6_sj5hfd.jpg' },
      { id: 7, url: 'https://res.cloudinary.com/dcy3tftwo/image/upload/v1676046242/promos/promo7_muw9dm.jpg' },
    ])
  }, [])

  return (
    <>
      <Head>
        <title>Oldegg - Home</title>
        <meta
          name="description"
          content="Oldegg home page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <main>
        <Carousel images={images}></Carousel>
        <Recommendations/>
      </main>
    </>
  );
}
