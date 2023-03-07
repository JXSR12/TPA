import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Profile.module.scss'
import utilStyles from '@/styles/Utils.module.css';
import listStyles from '@/styles/Modal.module.css';
import searchStyles from '@/styles/SearchBar.module.css'
import Link from 'next/link';
import axios from 'axios';
import { ADDTOCART_QUERY, GETUSER_QUERY, GRAPHQL_API, PROTECTED_QUERY, UPDATEPASSWORD_QUERY, UPDATEPROFILE_QUERY, USERS_QUERY, USERTRANSHEADERS_QUERY } from '@/utils/constants';
import Router from 'next/router';
import { useSessionStorage } from 'usehooks-ts'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import Navbar from '@/components/navbar';
import Carousel, { ImageType } from '@/components/carousel';
import React from 'react';
import Recommendations from '@/components/recommendations';
import Carts, { DUMMY_DISTANCE } from '@/components/cartitems';
import validator from "validator";
import { FaAddressCard, FaBan, FaBroom, FaCamera, FaCameraRetro, FaCartPlus, FaEnvelope, FaKey, FaMobile, FaMoneyBill, FaPhone, FaRegEye, FaSave, FaStar, FaTrash, FaUser } from 'react-icons/fa';
import useChat from '@/hooks/useChat';
import { TopUpVoucherModal } from '@/components/modal';
import { TransactionDetail, TransactionHeader } from '@/interfaces/transaction';
import { Shipment } from '@/interfaces/shipment';
import Footer from '@/components/footer';


// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export default function OrdersPage() {
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');

  const [ searchQuery, setSearchQuery ] = React.useState<string>("");
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchQuery(event.target.value);
  }

  const handleSearch = (event: any) => {

  }

  const addAllToCart = (transactionDetails: TransactionDetail[]) => {
    transactionDetails.forEach(td => {
      axios.post(GRAPHQL_API, {
        query: ADDTOCART_QUERY(td.product.id, td.quantity, ""),
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        console.log(res.data)
        setShowSuccess(true)
        setTimeout(() => {setShowSuccess(false)}, 2000)
      }).catch(err => {
        console.log("Error occured while trying to add item '" + td.product.name.substring(0, 30) + "' to cart")
        setShowError(true)
        setTimeout(() => {setShowError(false)}, 2000)
      })
    })
  }

  //Orders
  const [ orders, setOrders ] = React.useState<TransactionHeader[]>([]);

  const [ filteredOrders, setFilteredOrders ] = React.useState<TransactionHeader[]>([])

  React.useEffect(() => {
    setFilteredOrders(orders.filter(e => {
      return JSON.stringify(e).toLowerCase().includes(searchQuery.toLowerCase())
    }))
  }, [orders, searchQuery])

  const retrieveOrders = () => {
      axios.post(GRAPHQL_API, {
        query: USERTRANSHEADERS_QUERY
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        setOrders(res.data.data.userOrders)
      }).catch(err => {
        console.log("Error retrieving orders")
      })
  }

  function totalValue(details: TransactionDetail[], shipment: Shipment): number{
    var total = 0.00;

    details.forEach(function(item){
      total+=((item.product.price*(100 - item.product.discount))/100) * item.quantity
    });

    total+= shipment.fee * DUMMY_DISTANCE

    return total
  }

  function totalItems(details: TransactionDetail[]): number{
    var total = 0;

    details.forEach(function(item){
      total+=item.quantity
    });

    return total
  }

  React.useEffect(() => {
    retrieveOrders()
  }, [])

  return (
    <>
      <Head>
        <title>Oldegg - Orders</title>
        <meta
          name="description"
          content="Oldegg profile page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <main className={`${styles['main']} ${styles['has-dflex-center']}`}>
        <section>
          <div className={styles['lx-container-70']}>
            <div className={styles['lx-row']}>
              <h1 className={styles['title']}>My Order History</h1>
            </div>
            <br/>
            <div className={searchStyles['search-form-order']} role="search">
              <label htmlFor='search' className={searchStyles['label']}>Search</label>
              <input className={searchStyles['input-order']} id="search" type="search" onChange={handleSearchChange} placeholder="Search by product name, order ID, etc.." autoFocus required />
              <button className={searchStyles['button-order']} type="submit" onClick={handleSearch}>Apply Filters</button>
            </div>
            <br/>
            <div className={`${styles['lx-row']} ${styles['align-stretch']}`}>
                <div className={`${styles['lx-column']} ${styles['column-orders']}`}>
                  <div className={`${listStyles['address-list']} ${listStyles['address-list-full']} ${listStyles['background-lighten']} ${listStyles['padding-a-bit']}`}>
                    {filteredOrders.map(e =>
                      <div key={e.id} className={`${listStyles['address-box']}`}>
                        <h5>
                          Order ID: {e.id}
                        </h5>
                        <br/>
                        <h3>
                          Purchased on {new Date(e.date).toLocaleString()}
                        </h3>
                        <hr className={`${listStyles['modal-div-dotted']} `}/>
                        <h2>
                          Totaling ${totalValue(e.transactionDetails, e.shipment).toFixed(2)} for {totalItems(e.transactionDetails)} items
                        </h2>
                        <br/>
                        <br/>
                        <center className={`${listStyles['display-on-hover']}`}>
                        <div className={`${styles['actions']}`}>
                          <a id="save" className={`${styles['lx-btn']} ${styles['save']}`} onClick={e => {}}><FaRegEye/>&nbsp;&nbsp;View items</a>
                          &nbsp;
                          <a id="review" className={`${styles['lx-btn']} ${styles['review']}`} onClick={ev => addAllToCart(e.transactionDetails)}><FaCartPlus/>&nbsp;&nbsp;Add all items to cart</a>
                        </div>
                        </center>
                      </div>)}
                  </div>
                </div>
                <br/>
                <br/>
                <div className={`${styles['lx-column']} ${styles['column-orders']}`}>

                </div>
                <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Error occured while trying to add items to cart</div>
                <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully added all order items to cart!</div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
