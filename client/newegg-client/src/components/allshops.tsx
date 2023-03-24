import { Product } from '@/interfaces/product';
import { Shop } from '@/interfaces/shop';
import { User } from '@/interfaces/user';
import styles from '@/styles/CardGrid.module.css';
import actionStyles from '@/styles/Profile.module.scss'
import searchStyles from '@/styles/SearchBar.module.css'
import utilStyles from '@/styles/Utils.module.css';
import { ALLPRODUCTS_QUERY, BANUSER_QUERY, DELETEPRODUCT_QUERY, GRAPHQL_API, USERS_QUERY } from '@/utils/constants';
import axios from 'axios';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { CreateShopModal, UpdateProductModal } from './modal';
import ProductCard from './productcard';
import ShopCard from './shopcard';
import UserCard from './usercard';

export default function AllShops(props: {shops: Shop[], header: string, editMode?: boolean, retrieveShops?: any}){
  const { shops, header, editMode, retrieveShops} = props;

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL')

  const [ paginatedShops, setPaginatedShops ] = React.useState<Shop[]>([])

  const [ showUpdate, setShowUpdate ] = React.useState<boolean>(false);

  const [page, setPage] = React.useState(1);
  const [maxPage, setMaxPage] = React.useState(15);
  const [loading, setLoading] = React.useState(false);
  const [noData, setNoData] = React.useState(false);

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [ showCreate, setShowCreate ] = React.useState<boolean>(false);

  const [maxItem, setMaxItem] = React.useState(6);

  const [ searchQuery, setSearchQuery ] = React.useState<string>("");

  const [ bannedToggle, setBannedToggle ] = React.useState<boolean>(false);

  const handleBanClick = (shop: Shop) => {
    axios.post(GRAPHQL_API, {
      query: BANUSER_QUERY(shop.user.id),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveShops()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error banning shop user")
    })
  }

  React.useEffect(() => {
    console.log("ITEM LENGTH: " + shops?.length)
    var filteredShops = shops.filter((s) => {
      return s.user.banned === bannedToggle
    })
    setMaxPage(Math.ceil(filteredShops?.length / maxItem))
  }, [shops, searchQuery, bannedToggle])

  React.useEffect(() => {
    setPage(1)
  }, [maxPage])

  React.useEffect(() => {
    var filteredShops = shops.filter((s) => {
      return s.user.banned === bannedToggle
    })
    setPaginatedShops(filteredShops?.slice((page-1)*maxItem,(page)*maxItem))
  }, [page, shops, bannedToggle])


  const handleBannedChange = (event: React.ChangeEvent<{ value: string }>) => {
    setBannedToggle(event.target.value == "Banned");
  }

  return(
    <div className={styles['container']}>
      <h2 className={styles['header']}>{header}</h2>
      <br/>
      <center><button className={styles['pagination-button']} onClick={e => setShowCreate(true)}>Register New Shop</button></center>
      <br/>
      <br/>
      <select name="select-content" className={`${actionStyles['select-content']} ${styles['w-20']}`} onChange={handleBannedChange}>
        <option value="Unbanned" selected>Unbanned Shops</option>
        <option value="Banned">Banned Shops</option>
      </select>
      <br/>
      <br/>
      {shops?.length > 0 &&
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
      <div className={styles['item-container-users']}>
        {paginatedShops?.map(u =>
          <ShopCard key={u.id} shop={u} editMode={editMode} onDeleteClick={(ev: any) => handleBanClick(u)}/>
        )}
      </div>
      {shops?.length > 0 &&
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
      {loading ?  <div className={styles['text-center']}>Fetching shops..</div> : "" }
      {paginatedShops?.length <= 0 ? <div className={styles['text-center']}>There is no shop found</div> : "" }

      <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Error while banning shop</div>
      <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully changed shop ban status</div>
      <CreateShopModal retrieveShops={retrieveShops} setShow={setShowCreate} show={showCreate} />
    </div>
  )
}
