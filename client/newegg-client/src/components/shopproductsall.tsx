import { Product } from '@/interfaces/product';
import styles from '@/styles/CardGrid.module.css';
import { ALLPRODUCTS_QUERY, GRAPHQL_API, USERS_QUERY } from '@/utils/constants';
import axios from 'axios';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import ProductCard from './productcard';

export default function AllShopProducts(props: {products: Product[]}){
  const { products } = props;

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL')

  return(
    <div className={styles['container']}>
      <h2 className={styles['header']}>Our Products</h2>
      <br/>
      <div className={styles['item-container']}>
        {products?.map(p =>
          <ProductCard key={p.id} product={p}/>
        )}
      </div>
      <div className={styles['text-center']}>You have reached the end of our products list</div>
    </div>
  )
}
