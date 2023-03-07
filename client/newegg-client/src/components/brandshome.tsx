import { Product, ProductBrand } from '@/interfaces/product';
import styles from '@/styles/CardGrid.module.css';
import { ALLBRANDS_QUERY, GRAPHQL_API } from '@/utils/constants';
import axios from 'axios';
import Image from 'next/image';
import React from 'react';
import { FaStar } from 'react-icons/fa';

export default function BrandsView(props: {limit: number}){
  const {limit} = props;

  const [ brands, setBrands ] = React.useState<ProductBrand[]>([])

  const retrieveBrands = () => {
      axios.post(GRAPHQL_API, {
        query: ALLBRANDS_QUERY
      }
      ).then(res => {
        setBrands(res.data.data.brands)
      }).catch(err => {
        console.log("Error retrieving brands")
      })
  }

  React.useEffect(() => {
    retrieveBrands()
  }, [])

  return(
    <>
    <br/>
    <br/>
    <br/>
    <center><h1>Featured Brands</h1></center>
    <div className={styles['item-container-centered']}>
      {brands.slice(0, limit).map(b =>
      <div className={styles['goods-container']}>
        <img height={100} width={200} src={b.logo} title={b.name} alt={b.name}/>
        <br/>
        <center><h3>{b.name}</h3></center>
      </div>
      )}
    </div>
    </>
  )
}
