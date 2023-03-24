import { Product } from '@/interfaces/product';
import { User } from '@/interfaces/user';
import { CreditVoucher } from '@/interfaces/voucher';
import styles from '@/styles/CardGrid.module.css';
import searchStyles from '@/styles/SearchBar.module.css'
import utilStyles from '@/styles/Utils.module.css';
import { ALLPRODUCTS_QUERY, BANUSER_QUERY, CREATEVOUCHER_QUERY, DELETEPRODUCT_QUERY, DELETEVOUCHER_QUERY, GRAPHQL_API, USERS_QUERY } from '@/utils/constants';
import axios from 'axios';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { CreateNewVoucherModal, UpdateProductModal } from './modal';
import ProductCard from './productcard';
import UserCard from './usercard';
import VoucherCard from './vouchercard';

export default function AllVouchers(props: {vouchers: CreditVoucher[], header: string, editMode?: boolean, retrieveVouchers?: any}){
  const { vouchers, header, editMode, retrieveVouchers} = props;

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL')

  const [ paginatedVouchers, setPaginatedVouchers ] = React.useState<CreditVoucher[]>([])

  const [ showUpdate, setShowUpdate ] = React.useState<boolean>(false);

  const [page, setPage] = React.useState(1);
  const [maxPage, setMaxPage] = React.useState(15);
  const [loading, setLoading] = React.useState(false);
  const [noData, setNoData] = React.useState(false);

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [ showCreate, setShowCreate ] = React.useState<boolean>(false);

  const [maxItem, setMaxItem] = React.useState(4);

  const [ searchQuery, setSearchQuery ] = React.useState<string>("");

  const handleCreateVoucher = (code: string, value: number) => {
    axios.post(GRAPHQL_API, {
      query: CREATEVOUCHER_QUERY(code, value),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveVouchers()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error creating voucher")
    })
  }

  const handleDeleteVoucher = (voucher: CreditVoucher) => {
    axios.post(GRAPHQL_API, {
      query: DELETEVOUCHER_QUERY(voucher.id),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveVouchers()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error deleting voucher")
    })
  }

  React.useEffect(() => {
    console.log("ITEM LENGTH: " + vouchers?.length)
    setMaxPage(Math.ceil(vouchers?.length / maxItem))
  }, [vouchers, searchQuery])

  React.useEffect(() => {
    setPage(1)
  }, [maxPage])

  React.useEffect(() => {
    setPaginatedVouchers(vouchers?.slice((page-1)*maxItem,(page)*maxItem))
  }, [page, vouchers])

  return(
    <div className={styles['container']}>
      <h2 className={styles['header']}>{header}</h2>
      <br/>
      <center><button className={styles['pagination-button']} onClick={e => setShowCreate(true)}>Create New Credit Voucher</button></center>
      <br/>
      <br/>
      {vouchers?.length > 0 &&
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
        {paginatedVouchers?.map(u =>
          <VoucherCard key={u.id} voucher={u} editMode={editMode} onDeleteClick={(ev: any) => handleDeleteVoucher(u)}/>
        )}
      </div>
      {vouchers?.length > 0 &&
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
      {loading ?  <div className={styles['text-center']}>Fetching vouchers..</div> : "" }
      {paginatedVouchers?.length <= 0 ? <div className={styles['text-center']}>There is no vouchers found</div> : "" }

      <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Error while deleting voucher</div>
      <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully made changes to vouchers</div>
      <CreateNewVoucherModal retrieveVouchers={retrieveVouchers} setShow={setShowCreate} show={showCreate}/>
    </div>
  )
}
