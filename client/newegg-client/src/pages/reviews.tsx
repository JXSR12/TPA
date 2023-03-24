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
import { ADDTOCART_QUERY, CANCELORDER_QUERY, COMPLETEORDER_QUERY, DELETEREVIEW_QUERY, GETUSER_QUERY, GRAPHQL_API, PROTECTED_QUERY, SHOPTRANSHEADERS_QUERY, UPDATEPASSWORD_QUERY, UPDATEPROFILE_QUERY, USERREVIEWS_QUERY, USERS_QUERY, USERTRANSHEADERS_QUERY } from '@/utils/constants';
import Router from 'next/router';
import { useSessionStorage } from 'usehooks-ts'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import Navbar from '@/components/navbar';
import Carousel, { ImageType } from '@/components/carousel';
import React from 'react';
import Recommendations from '@/components/recommendations';
import Carts, { DUMMY_DISTANCE } from '@/components/cartitems';
import validator from "validator";
import { FaAddressCard, FaBan, FaBroom, FaCamera, FaCameraRetro, FaCartPlus, FaCheck, FaCheckCircle, FaClipboard, FaCross, FaEnvelope, FaKey, FaMobile, FaMoneyBill, FaPhone, FaRegEye, FaSave, FaStar, FaTrash, FaUser } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import useChat from '@/hooks/useChat';
import { ReviewDetailModal, TopUpVoucherModal } from '@/components/modal';
import { TransactionDetail, TransactionHeader } from '@/interfaces/transaction';
import { Shipment } from '@/interfaces/shipment';
import Footer from '@/components/footer';
import { ProductReview } from '@/interfaces/review';


// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export default function ReviewsPage() {
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [ updatedReview, setUpdatedReview ] = React.useState<ProductReview>({} as ProductReview);
  const [ showDetail, setShowDetail ] = React.useState<boolean>(false);

  //Orders
  const [ reviews, setReviews ] = React.useState<ProductReview[]>([]);

  const retrieveReviews = () => {
      axios.post(GRAPHQL_API, {
        query: USERREVIEWS_QUERY
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        console.log(jwtToken)
        console.log(res.data)
        setReviews(res.data.data.userReviews)
      }).catch(err => {
        console.log("Error retrieving reviews")
      })
  }

  const deleteReview = (id: string) => {
    axios.post(GRAPHQL_API, {
      query: DELETEREVIEW_QUERY(id)
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      retrieveReviews()
    }).catch(err => {
      console.log("Error deleting review")
    })
  }

  React.useEffect(() => {
    retrieveReviews()
  }, [])

  return (
    <>
      <Head>
        <title>Oldegg - My Reviews</title>
        <meta
          name="description"
          content="Oldegg shop orders page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>

      <main className={`${styles['main']} ${styles['has-dflex-center']}`}>
        <section>
          <div className={styles['lx-container-70']}>
            <div className={styles['lx-row']}>
              <h1 className={styles['title']}>My Reviews and Questionnaires</h1>
            </div>
            <br/>
            <br/>
            <div className={`${styles['lx-row']} ${styles['align-stretch']}`}>
                <div className={`${styles['lx-column']} ${styles['column-orders']}`}>
                  <div className={`${listStyles['address-list']} ${listStyles['address-list-full']} ${listStyles['background-lighten']} ${listStyles['padding-a-bit']}`}>
                    {reviews?.map(e =>
                      <div key={e.id} className={`${listStyles['address-box']}`}>
                        <h4>Product:&nbsp;{e.product.name}</h4>
                        <br/>
                        <h4>Sold by&nbsp;{e.product.shop.name}</h4>
                        <br/>
                        <h3>
                          Posted on {new Date(e.createdAt).toLocaleString()}
                        </h3>
                        <hr className={`${listStyles['modal-div-dotted']} `}/>
                        <br/>
                        <h1>Rated {e.rating/2} out of 5</h1>
                        <br/>
                        <h3>
                          {e.description}
                        </h3>
                        <br/>
                        <br/>
                        <center className={`${listStyles['display-on-hover']}`}>
                          <div className={`${styles['actions']}`}>
                            <a id="save" className={`${styles['lx-btn']} ${styles['save']}`} onClick={ev => deleteReview(e.id)}><FaTrash/>&nbsp;&nbsp;Delete Review</a>
                            &nbsp;
                            <a id="review" className={`${styles['lx-btn']} ${styles['review']}`} onClick={ev => {
                              setUpdatedReview(e)
                              setShowDetail(true)
                            }}><FaClipboard/>&nbsp;&nbsp;View Details</a>
                          </div>
                        </center>
                      </div>)}
                      {
                        (!reviews || reviews.length <= 0) && <center><h3>You haven't made any reviews yet</h3></center>
                      }
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
        <ReviewDetailModal retrieveReviews={retrieveReviews} show={showDetail} setShow={setShowDetail} review={updatedReview} />
      </main>
      <Footer/>
    </>
  );
}
