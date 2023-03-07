import { Product } from '@/interfaces/product';
import styles from '@/styles/CardGrid.module.css';
import { ALLPRODUCTS_QUERY, GRAPHQL_API, USERS_QUERY } from '@/utils/constants';
import axios from 'axios';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import ProductCard from './productcard';

export default function Recommendations(){

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

  const retrieveItems = (page: number) => {
    setLoading(true);
      axios.post(GRAPHQL_API, {
        query: ALLPRODUCTS_QUERY(6, page*6)
      }
      ).then(res => {
        var newPage = page + 1
        setPage(newPage)
        var newItems = items.concat(res.data.data.products);
        setItems(newItems)
        if(res.data.data.products.length === 0){
          setNoData(true);
        }

      }).catch(err => {
        console.log("Error retrieving products")
      }).finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    const onScroll = (e: any) => {
      setScrollTop(e.target.documentElement.scrollTop);
      setScrolling(e.target.documentElement.scrollTop > scrollTop);
      if (window.innerHeight + e.target.documentElement.scrollTop + 2 >= e.target.documentElement.offsetHeight) {
        if(!noData) {
          retrieveItems(page);
        }
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  React.useEffect(() => {
    retrieveItems(page)
  }, [])

  return(
    <div className={styles['container']}>
      <h2 className={styles['header']}>You might also like</h2>
      <br/>
      <div className={styles['item-container']}>
        {items.map(p =>
          <ProductCard key={p.id} product={p}/>
        )}
      </div>
      {loading ?  <div className={styles['text-center']}>Fetching products..</div> : "" }
      {noData ? <div className={styles['text-center']}>You have reached the end of our products list</div> : "" }
    </div>
  )
}
