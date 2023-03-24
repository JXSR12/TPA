import { Product } from '@/interfaces/product';
import { UserSearch } from '@/interfaces/search';
import styles from '@/styles/CardGrid.module.css';
import searchStyles from '@/styles/SearchBar.module.css'
import { ALLPRODUCTS_QUERY, GETUSERSEARCHES_QUERY, GRAPHQL_API, SAVEUSERSEARCH_QUERY, SEARCHPRODUCTS_QUERY, USERS_QUERY } from '@/utils/constants';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { Client, HydrationProvider } from 'react-hydration-provider';
import { useSessionStorage } from 'usehooks-ts';
import ProductCard from './productcard';

export default function Searchs(props: {search: string}){

  const { search } = props;

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL')
  const [ items, setItems ] = React.useState<Product[]>([])
  const [ queries, setQueries ] = React.useState<UserSearch[]>([])

  const [ filteredItems, setFilteredItems ] = React.useState<Product[]>([])

  const [ paginatedItems, setPaginatedItems ] = React.useState<Product[]>([])

  const [userList, setUserList] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [maxPage, setMaxPage] = React.useState(15);
  const [loading, setLoading] = React.useState(false);
  const [noData, setNoData] = React.useState(false);

  const [maxItem, setMaxItem] = React.useState(6);

  const [ searchQuery, setSearchQuery ] = React.useState<string>("");

  var listenerCount = 0;
  var listenerAdded = false;

  const retrieveItems = () => {
    setLoading(true);
      axios.post(GRAPHQL_API, {
        query: SEARCHPRODUCTS_QUERY(999999, 0, search as string)
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

  const retrieveSearches = () => {
    setLoading(true);
      axios.post(GRAPHQL_API, {
        query: GETUSERSEARCHES_QUERY(10)
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        console.log(res.data.data)
        setQueries(res.data.data.userSearches)
      }).catch(err => {
        console.log("Error retrieving saved queries")
      })
  }

  const saveQuery = () => {
    setLoading(true);
      axios.post(GRAPHQL_API, {
        query: SAVEUSERSEARCH_QUERY(search)
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        retrieveSearches()
      }).catch(err => {
        console.log("Error saving query")
      })
  }

  const handleSearchChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchQuery(event.target.value);
  }

  const handleSearch = (event: any) => {

  }

  const handleSaveQuery = () => {
    saveQuery();
  }

  React.useEffect(() => {
    setFilteredItems(items.filter(e => {
      return JSON.stringify(e).toLowerCase().includes(searchQuery.toLowerCase())
    }))
  }, [items, searchQuery])

  React.useEffect(() => {
    console.log("ITEM LENGTH: " + filteredItems.length)
    setMaxPage(Math.ceil(filteredItems.length / maxItem))
  }, [filteredItems, searchQuery])

  React.useEffect(() => {
    retrieveItems()
    retrieveSearches()
  }, [search])

  React.useEffect(() => {
    setPage(1)
  }, [maxPage])


  React.useEffect(() => {
    setPaginatedItems(filteredItems.slice((page-1)*maxItem,(page)*maxItem))
  }, [page, filteredItems])

  return(
    <HydrationProvider>
    <Client>
    <div className={styles['container']}>
      <h2 className={styles['header']}>Search result for '{search}'</h2>
      <br/>
      <center><button className={styles['pagination-button']} onClick={jwtToken != 'NULL' ? handleSaveQuery : e => Router.push('/login')}>{jwtToken != 'NULL' ? "Save This Search Query" : "Sign In To Save This Query"}</button></center>
      <br/>
      <h4 className={styles['header']}>{jwtToken != 'NULL' ? 'Recently saved queries' : ''}</h4>
      <br/>
        <center className={styles['chips']}>
          {queries?.map(e =>
            <div className={styles['chip']} onClick={ev => {Router.push('/search?search=' + e.search.query)}} key={e.search.id}>
              <div className={styles['chip-head']}>{e.search.query.charAt(0)}</div>
              <div className={styles['chip-content']}>{e.search.query}</div>
            </div>
          )}
        </center>
      <br/>
      <br/>
      <div className={searchStyles['search-form-order']} role="search">
        <label htmlFor='search' className={searchStyles['label']}>Search</label>
        <input className={searchStyles['input-order']} id="search" type="search" onChange={handleSearchChange} placeholder="Search within this search query.." autoFocus required />
        <button className={searchStyles['button-order']} type="submit" onClick={handleSearch}>Search</button>
      </div>

      <br/>
      {filteredItems.length > 0 &&
      <center>
        {page != 1 && <button className={styles['pagination-button']} onClick={e => setPage(1)}>First</button>}
        {page >= 2 && <button className={styles['pagination-button']} onClick={e => setPage(page-1)}>&lt;&nbsp;Prev</button>}
        {page >= 3 && <button className={styles['pagination-button']} onClick={e => setPage(page-2)}>{page-2}</button>}
        {page >= 2 && <button className={styles['pagination-button']} onClick={e => setPage(page-1)}>{page-1}</button>}
        <button className={styles['pagination-button-cur']}>{page}</button>
        {page <= (maxPage-1) && <button className={styles['pagination-button']} onClick={e => setPage(page+1)}>{page+1}</button>}
        {page <= (maxPage-2) && <button className={styles['pagination-button']} onClick={e => setPage(page+2)}>{page+2}</button>}
        {page <= (maxPage-1) && <button className={styles['pagination-button']} onClick={e => setPage(page+1)}>Next&nbsp;&gt;</button>}
        {page != maxPage && <button className={styles['pagination-button']} onClick={e => setPage(maxPage)}>Last</button>}
      </center>
      }
      <div className={styles['item-container']}>
        {paginatedItems.map(p =>
          <ProductCard key={p.id} product={p}/>
        )}
      </div>
      {filteredItems.length > 0 &&
      <center>
        {page != 1 && <button className={styles['pagination-button']} onClick={e => setPage(1)}>First</button>}
        {page >= 2 && <button className={styles['pagination-button']} onClick={e => setPage(page-1)}>&lt;&nbsp;Prev</button>}
        {page >= 3 && <button className={styles['pagination-button']} onClick={e => setPage(page-2)}>{page-2}</button>}
        {page >= 2 && <button className={styles['pagination-button']} onClick={e => setPage(page-1)}>{page-1}</button>}
        <button className={styles['pagination-button-cur']}>{page}</button>
        {page <= (maxPage-1) && <button className={styles['pagination-button']} onClick={e => setPage(page+1)}>{page+1}</button>}
        {page <= (maxPage-2) && <button className={styles['pagination-button']} onClick={e => setPage(page+2)}>{page+2}</button>}
        {page <= (maxPage-1) && <button className={styles['pagination-button']} onClick={e => setPage(page+1)}>Next&nbsp;&gt;</button>}
        {page != maxPage && <button className={styles['pagination-button']} onClick={e => setPage(maxPage)}>Last</button>}
      </center>
      }
      {loading ?  <div className={styles['text-center']}>Fetching products..</div> : "" }
      {paginatedItems.length <= 0 ? <div className={styles['text-center']}>No result found for your search</div> : "" }
    </div>
    </Client>
    </HydrationProvider>
  )
}
