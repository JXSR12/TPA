import { Product } from '@/interfaces/product';
import styles from '@/styles/CardGrid.module.css';
import { ALLPRODUCTS_QUERY, GRAPHQL_API, SEARCHPRODUCTS_QUERY, USERS_QUERY } from '@/utils/constants';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import ProductCard from './productcard';

export default function Searchs(props: {search: string}){

  const { search } = props;

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL')
  const [ items, setItems ] = React.useState<Product[]>([])
  const [userList, setUserList] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [noData, setNoData] = React.useState(false);
  const [scrolling, setScrolling] = React.useState(false);
  const [scrollTop, setScrollTop] = React.useState(0);

  var listenerCount = 0;
  var listenerAdded = false;

  const retrieveItems = () => {
    setLoading(true);
      axios.post(GRAPHQL_API, {
        query: SEARCHPRODUCTS_QUERY(1000, 0, search as string)
      }
      ).then(res => {
        setItems(res.data.data.products)
        if(res.data.data.products.length === 0){
          setNoData(true)
        }else{
          setNoData(false)
        }
      }).catch(err => {
        console.log("Error retrieving products")
      }).finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    retrieveItems()
  }, [search])

  return(
    <div className={styles['container']}>
      <h2 className={styles['header']}>Search result for '{search}'</h2>
      <br/>
      <div className={styles['item-container']}>
        {items.map(p =>
          <ProductCard key={p.id} product={p}/>
        )}
      </div>
      {loading ?  <div className={styles['text-center']}>Fetching products..</div> : "" }
      {noData ? <div className={styles['text-center']}>No result found for your search</div> : "" }
    </div>
  )
}
