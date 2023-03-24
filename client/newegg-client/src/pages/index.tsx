import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home2.module.css';
import Link from 'next/link';
import axios from 'axios';
import { BANNERS_QUERY, GRAPHQL_API, PROTECTED_QUERY, USERS_QUERY } from '@/utils/constants';
import Router from 'next/router';
import { useSessionStorage } from 'usehooks-ts'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import Navbar from '@/components/navbar';
import Carousel, { ImageType } from '@/components/carousel';
import React from 'react';
import Recommendations from '@/components/recommendations';
import Footer from '@/components/footer';
import BrandsView from '@/components/brandshome';
import ShopsView from '@/components/shopshome';
import { PromotionBanner } from '@/interfaces/promotion';


// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export default function Home() {

  const [images, setImages] = React.useState<ImageType[]>()
  const [banners, setBanners] = React.useState<PromotionBanner[]>([])

  const retrieveBanners = () => {
    axios.post(GRAPHQL_API, {
      query: BANNERS_QUERY
    }
    ).then(res => {
      console.log(res.data)
      setBanners(res.data.data.promotionBanners)
    }).catch(err => {
      console.log("Error retrieving promotion banners")
    })
  }

  React.useEffect(() => {
    retrieveBanners()
  }, [])

  React.useEffect(() => {
    setImages(banners.map(e => {return {id: e.id, url: e.image}}))
  }, [banners])

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
        <BrandsView limit={10}/>
        <ShopsView limit={3}/>
        <Recommendations/>
      </main>
      <Footer/>
    </>
  );
}
