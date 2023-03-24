import { Product } from '@/interfaces/product';
import styles from '@/styles/CardGrid.module.css';
import searchStyles from '@/styles/SearchBar.module.css'
import utilStyles from '@/styles/Utils.module.css';
import { ALLPRODUCTS_QUERY, DELETEPRODUCT_QUERY, GRAPHQL_API, USERS_QUERY } from '@/utils/constants';
import axios from 'axios';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { UpdateProductModal } from './modal';
import ProductCard from './productcard';

export default function AllShopProducts(props: {products: Product[], header: string, editMode?: boolean, retrieveProducts?: any}){
  const { products, header, editMode, retrieveProducts} = props;

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL')

  const [ filteredItems, setFilteredItems ] = React.useState<Product[]>([])

  const [ paginatedItems, setPaginatedItems ] = React.useState<Product[]>([])

  const [ showUpdate, setShowUpdate ] = React.useState<boolean>(false);
  const [ updatedProduct, setUpdatedProduct ] = React.useState<Product>({} as Product);

  const [page, setPage] = React.useState(1);
  const [maxPage, setMaxPage] = React.useState(15);
  const [loading, setLoading] = React.useState(false);
  const [noData, setNoData] = React.useState(false);

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [maxItem, setMaxItem] = React.useState(6);

  const [ searchQuery, setSearchQuery ] = React.useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchQuery(event.target.value);
  }

  const handleUpdateClick = (product: Product) => {
    setUpdatedProduct(product);
    setShowUpdate(true)
  }

  const handleDeleteClick = (product: Product) => {
    axios.post(GRAPHQL_API, {
      query: DELETEPRODUCT_QUERY(product.id),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveProducts()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error deleting product")
    })
  }

  React.useEffect(() => {
    setFilteredItems(products?.filter(e => {
      return JSON.stringify(e).toLowerCase().includes(searchQuery.toLowerCase())
    }))
  }, [products, searchQuery])

  React.useEffect(() => {
    console.log("ITEM LENGTH: " + filteredItems?.length)
    setMaxPage(Math.ceil(filteredItems?.length / maxItem))
  }, [filteredItems, searchQuery])

  React.useEffect(() => {
    setPage(1)
  }, [maxPage])

  React.useEffect(() => {
    setPaginatedItems(filteredItems?.slice((page-1)*maxItem,(page)*maxItem))
  }, [page, filteredItems])

  return(
    <div className={styles['container']}>
      <h2 className={styles['header']}>{header}</h2>
      <br/>
      <div className={searchStyles['search-form-order']} role="search">
        <label htmlFor='search' className={searchStyles['label']}>Search</label>
        <input className={searchStyles['input-order']} id="search" type="search" onChange={handleSearchChange} placeholder="Search within this search query.." autoFocus required />
        <button className={searchStyles['button-order']} type="submit" onClick={e => {}}>Search</button>
      </div>
      <br/>
      {filteredItems?.length > 0 &&
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
        {paginatedItems?.map(p =>
          <ProductCard key={p.id} product={p} editMode={editMode} onUpdateClick={(ev: any) => handleUpdateClick(p)} onDeleteClick={(ev: any) => handleDeleteClick(p)}/>
        )}
      </div>
      {filteredItems?.length > 0 &&
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
      {paginatedItems?.length <= 0 ? <div className={styles['text-center']}>No result found for your search</div> : "" }
      <UpdateProductModal show={showUpdate} setShow={setShowUpdate} product={updatedProduct} retrieveProducts={retrieveProducts}/>
      <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Error while deleting product</div>
      <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully deleted product!</div>
    </div>
  )
}
