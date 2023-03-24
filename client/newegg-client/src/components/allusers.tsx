import { Product } from '@/interfaces/product';
import { User } from '@/interfaces/user';
import styles from '@/styles/CardGrid.module.css';
import searchStyles from '@/styles/SearchBar.module.css'
import utilStyles from '@/styles/Utils.module.css';
import { ALLPRODUCTS_QUERY, BANUSER_QUERY, DELETEPRODUCT_QUERY, GRAPHQL_API, USERS_QUERY } from '@/utils/constants';
import axios from 'axios';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { UpdateProductModal } from './modal';
import ProductCard from './productcard';
import UserCard from './usercard';

export default function AllUsers(props: {users: User[], header: string, editMode?: boolean, retrieveUsers?: any}){
  const { users, header, editMode, retrieveUsers} = props;

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL')

  const [ paginatedUsers, setPaginatedUsers ] = React.useState<User[]>([])

  const [ showUpdate, setShowUpdate ] = React.useState<boolean>(false);

  const [page, setPage] = React.useState(1);
  const [maxPage, setMaxPage] = React.useState(15);
  const [loading, setLoading] = React.useState(false);
  const [noData, setNoData] = React.useState(false);

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [maxItem, setMaxItem] = React.useState(6);

  const [ searchQuery, setSearchQuery ] = React.useState<string>("");

  const handleBanClick = (user: User) => {
    axios.post(GRAPHQL_API, {
      query: BANUSER_QUERY(user.id),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveUsers()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error banning user")
    })
  }

  React.useEffect(() => {
    console.log("ITEM LENGTH: " + users?.length)
    setMaxPage(Math.ceil(users?.length / maxItem))
  }, [users, searchQuery])

  React.useEffect(() => {
    setPage(1)
  }, [maxPage])

  React.useEffect(() => {
    setPaginatedUsers(users?.slice((page-1)*maxItem,(page)*maxItem))
  }, [page, users])

  return(
    <div className={styles['container']}>
      <h2 className={styles['header']}>{header}</h2>
      <br/>
      {users?.length > 0 &&
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
        {paginatedUsers?.map(u =>
          <UserCard key={u.id} user={u} editMode={editMode} onDeleteClick={(ev: any) => handleBanClick(u)}/>
        )}
      </div>
      {users?.length > 0 &&
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
      {loading ?  <div className={styles['text-center']}>Fetching users..</div> : "" }
      {paginatedUsers?.length <= 0 ? <div className={styles['text-center']}>There is no user found</div> : "" }

      <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Error while banning user</div>
      <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully changed user ban status</div>
    </div>
  )
}
