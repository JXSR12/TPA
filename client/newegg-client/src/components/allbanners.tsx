import { Product } from '@/interfaces/product';
import { PromotionBanner } from '@/interfaces/promotion';
import { User } from '@/interfaces/user';
import { CreditVoucher } from '@/interfaces/voucher';
import styles from '@/styles/CardGrid.module.css';
import searchStyles from '@/styles/SearchBar.module.css'
import utilStyles from '@/styles/Utils.module.css';
import { ALLPRODUCTS_QUERY, BANUSER_QUERY, CREATEBANNER_QUERY, CREATEVOUCHER_QUERY, DELETEBANNER_QUERY, DELETEPRODUCT_QUERY, DELETEVOUCHER_QUERY, GRAPHQL_API, USERS_QUERY } from '@/utils/constants';
import axios from 'axios';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { CreateNewPromotionModal, UpdateProductModal } from './modal';
import ProductCard from './productcard';
import PromotionCard from './promotioncard';
import UserCard from './usercard';
import VoucherCard from './vouchercard';

export default function AllBanners(props: {banners: PromotionBanner[], header: string, editMode?: boolean, retrieveBanners?: any}){
  const { banners, header, editMode, retrieveBanners} = props;

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL')

  const [ paginatedBanners, setPaginatedBanners ] = React.useState<PromotionBanner[]>([])

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

  const handleCreateBanner = (title: string, link: string, image: string) => {
    axios.post(GRAPHQL_API, {
      query: CREATEBANNER_QUERY(title, link, image),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveBanners()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error creating banner")
    })
  }

  const handleDeleteBanner = (banner: PromotionBanner) => {
    axios.post(GRAPHQL_API, {
      query: DELETEBANNER_QUERY(banner.id),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveBanners()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error deleting banner")
    })
  }

  React.useEffect(() => {
    console.log("ITEM LENGTH: " + banners?.length)
    setMaxPage(Math.ceil(banners?.length / maxItem))
  }, [banners, searchQuery])

  React.useEffect(() => {
    setPage(1)
  }, [maxPage])

  React.useEffect(() => {
    setPaginatedBanners(banners?.slice((page-1)*maxItem,(page)*maxItem))
  }, [page, banners])

  return(
    <div className={styles['container']}>
      <h2 className={styles['header']}>{header}</h2>
      <br/>
      <center><button className={styles['pagination-button']} onClick={e => setShowCreate(true)}>Create New Promotional Banner</button></center>
      <br/>
      <br/>
      {banners?.length > 0 &&
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
        {paginatedBanners?.map(u =>
          <PromotionCard key={u.id} promotion={u} editMode={editMode} onDeleteClick={(ev: any) => handleDeleteBanner(u)}/>
        )}
      </div>
      {banners?.length > 0 &&
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
      {loading ?  <div className={styles['text-center']}>Fetching banners..</div> : "" }
      {paginatedBanners?.length <= 0 ? <div className={styles['text-center']}>There is no promotional banners found</div> : "" }

      <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Error while deleting banner</div>
      <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully made changes to promotion banners</div>
      <CreateNewPromotionModal retrievePromotions={retrieveBanners} setShow={setShowCreate} show={showCreate} />
    </div>
  )
}
