import { Product, ProductBrand } from '@/interfaces/product';
import { Shop } from '@/interfaces/shop';
import styles from '@/styles/CardGrid.module.css';
import { ALLBRANDS_QUERY, ALLSHOPS_QUERY, GRAPHQL_API } from '@/utils/constants';
import axios from 'axios';
import Image from 'next/image';
import React from 'react';
import { FaStar } from 'react-icons/fa';

export default function ShopsView(props: {limit: number}){
  const {limit} = props;

  const [ shops, setShops ] = React.useState<Shop[]>([])

  const retrieveShops = () => {
      axios.post(GRAPHQL_API, {
        query: ALLSHOPS_QUERY
      }
      ).then(res => {
        setShops(res.data.data.shops)
      }).catch(err => {
        console.log("Error retrieving shops")
      })
  }

  React.useEffect(() => {
    retrieveShops()
  }, [])

  return(
    <>
    <center><h1>Featured Shops</h1></center>
    <div className={styles['item-container-centered']}>
      {shops.slice(0, limit).map(b =>
      <a href={"/shop/" + b.id}>
      <div className={styles['goods-container']}>
        <img height={300} width={300} src={b.profilePic} title={b.name} alt={b.name}/>
        <br/>
        <center><h3>{b.name}</h3></center>
      </div>
      </a>
      )}
    </div>
    </>
  )
}
