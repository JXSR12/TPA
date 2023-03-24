import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Profile.module.scss'
import utilStyles from '@/styles/Utils.module.css';
import actionStyles from '@/styles/Profile.module.scss'
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

  const [ orderFilter, setOrderFilter ] = React.useState<string>("Any");

  const [ orderPeriod, setOrderPeriod ] = React.useState<string>("Any");

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

  const handleFilterChange = (event: React.ChangeEvent<{ value: string }>) => {
    setOrderFilter(event.target.value);
  }

  const handlePeriodChange = (event: React.ChangeEvent<{ value: string }>) => {
    setOrderPeriod(event.target.value);
  }

  React.useEffect(() => {
    setFilteredOrders(orders?.filter(e => {
      let statusFilterPassed = true;
      if (orderFilter !== "Any") {
        statusFilterPassed = e.status.toUpperCase() === orderFilter.toUpperCase();
      }
      let dateFilterPassed = true;
      if (orderPeriod !== "Any") {
        const currentDate = new Date();
        const orderDate = new Date(e.date);
        if (orderPeriod === "Today") {
          dateFilterPassed = Math.abs(currentDate.getTime() - orderDate.getTime()) < 24 * 60 * 60 * 1000;
        } else if (orderPeriod === "Recent") {
          dateFilterPassed = Math.abs(currentDate.getTime() - orderDate.getTime()) < 7 * 24 * 60 * 60 * 1000;
        } else if (orderPeriod === "This Month") {
          dateFilterPassed = (currentDate.getMonth() === orderDate.getMonth()) && (currentDate.getFullYear() === orderDate.getFullYear());
        }
      }
      return JSON.stringify(e).toLowerCase().includes(searchQuery.toLowerCase()) && statusFilterPassed && dateFilterPassed;
    }))
    }, [orders, searchQuery, orderFilter, orderPeriod])

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
        console.log(jwtToken)
        console.log(res.data)
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
            <select name="select-content" value={orderFilter} className={`${actionStyles['select-content']} ${styles['w-20']}`} onChange={handleFilterChange}>
              <option value="Any" selected>Any Status</option>
              <option value="Open" selected>Open</option>
              <option value="Cancelled" selected>Cancelled</option>
              <option value="Completed" selected>Completed</option>
            </select>
            <select name="select-content" value={orderPeriod} className={`${actionStyles['select-content']} ${styles['w-20']}`} onChange={handlePeriodChange}>
              <option value="Any" selected>Any Period</option>
              <option value="Today" selected>Today (24h)</option>
              <option value="Recent" selected>Recent (7d)</option>
              <option value="This Month" selected>This Month (30d)</option>
            </select>
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
                    {filteredOrders?.map(e =>
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
                      {
                        (!filteredOrders || filteredOrders.length <= 0) && <center><h3>You haven't made any orders yet</h3></center>
                      }
                  </div>
                </div>
                <br/>
                <br/>
                <div className={`${styles['lx-column']} ${styles['column-orders']}`}>
                  <a href={'/reviewproducts'}>View Reviewable Products</a>
                  &nbsp;
                  |
                  &nbsp;
                  <a href={'/reviews'}>View All My Reviews</a>
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
