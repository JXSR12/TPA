import React from 'react';
import styles from '@/styles/CartItem.module.css';
import actionStyles from '@/styles/Profile.module.scss'
import utilStyles from '@/styles/Utils.module.css';
import ciStyles from '@/styles/CartItem.module.css';
import Navbar from '@/components/navbar';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import axios from 'axios';
import { ADDTOCART_QUERY, ADDTOWISHLIST_QUERY, CREATEWISHLIST_QUERY, DELETEFROMWISHLIST_QUERY, DELETEWISHLIST_QUERY, DUPLICATEWISHLISTITEMS_QUERY, FOLLOWWISHLIST_QUERY, GETUSER_QUERY, GRAPHQL_API, RECOMMENDEDPRODUCTS_QUERY, SHOPAVGRATING_QUERY, SHOPITEMSSOLD_QUERY, SHOPRECOMMENDED_QUERY, SIMILARPRODUCTS_QUERY, SINGLEPRODUCT_QUERY, SINGLESHOP_QUERY, SINGLEWISHLIST_QUERY, USERWISHLISTS_QUERY, WISHLISTCOMMENTS_QUERY, WISHLISTFOLLOWERS_QUERY } from '@/utils/constants';
import { Product } from '@/interfaces/product';
import { useSessionStorage } from 'usehooks-ts';
import { FaCartPlus, FaCopy, FaEdit, FaEye, FaHeart, FaPlusCircle, FaShoppingCart, FaSignInAlt, FaTimesCircle, FaTrash } from 'react-icons/fa';
import { Client, HydrationProvider } from 'react-hydration-provider';
import Footer from '@/components/footer';
import { AddToWishlistModal, NewCommentModal, UpdateWishlistModal } from '@/components/modal';
import { Wishlist, WishlistItem } from '@/interfaces/wishlist';
import Image from 'next/image';
import { User } from '@/interfaces/user';
import { WishlistComment } from '@/interfaces/comment';
import { Shop } from '@/interfaces/shop';

export default function ShopAbout(this: any){

  const router = useRouter();
  const [ id, setId ] = React.useState(router.query.id as string);
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ shop, setShop] = React.useState<Shop>({} as Shop);

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [ selProduct, setSelProduct] = React.useState<Product>({} as Product);

  const [ itemsSold, setItemsSold ] = React.useState<number>(0);
  const [ avgRating, setAvgRating ] = React.useState<number>(0);

  const [ userId, setUserId ] = React.useState<string>("")

  const retrieveShop = () => {
    axios.post(GRAPHQL_API, {
      query: SINGLESHOP_QUERY(id)
    }
    ).then(res => {
      console.log(id)
      if(id && typeof id !== undefined && id.length > 1){
        setShop(res.data.data.shop)
      }
    }).catch(err => {
      console.log("Error retrieving shop")
    })
}

const retrieveRating = () => {
  axios.post(GRAPHQL_API, {
    query: SHOPAVGRATING_QUERY(id)
  }
  ).then(res => {
    console.log(id)
    setAvgRating(res.data.data.averageRating)
  }).catch(err => {
    console.log("Error retrieving shop ratings")
  })
}

const retrieveSales = () => {
  axios.post(GRAPHQL_API, {
    query: SHOPITEMSSOLD_QUERY(id)
  }
  ).then(res => {
    console.log(id)
    setItemsSold(res.data.data.itemsSold)
  }).catch(err => {
    console.log("Error retrieving shop sales")
  })
}

const getUser = () => {
  axios.post(GRAPHQL_API, {
    query: GETUSER_QUERY
  },{
    headers: {
      Authorization: "Bearer " + jwtToken
    }
  }
  ).then(res => {
    setUserId(res.data.data.getUser.id)
  }).catch(err => {
    console.log(err)
  })
}

  React.useEffect(() => {
    retrieveShop()
    getUser()
    retrieveRating()
    retrieveSales()
  }, [id])

  React.useEffect(() => {
    setId(router.query.id as string)
  }, [router.query])

  return(
    <>
      <Head>
        <title>Oldegg - Shop</title>
        <meta
          name="description"
          content="Oldegg shop page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>

      {shop?.user?.banned ?
      <div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <center>This shop is currently being suspended</center>
        <br/>
        {shop?.user?.id == userId && <center>Please contact OldEgg Support Team via Customer Service to appeal for suspension</center>}
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <center>
          <button className={`${ciStyles['button']} ${ciStyles['backhome-cta']}`} onClick={e => Router.push('/')}><b>Go back to Home</b></button>
        </center>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
      :
      <div>
        <div>
          <br/>
          <center>
            <br/>
            <img height={200} width={200} src={shop?.profilePic} title={shop?.name} alt={shop?.name}/>
            <h1>{shop?.name}</h1>
            <br/>
            <br/>
            <br/>
          </center>
          {/* {shop?.user?.id == userId &&
          <div className={`${actionStyles['actions']}`}>
            <a id="save" className={`${actionStyles['lx-btn']} ${actionStyles['save']}`} onClick={e => {}}><FaPlusCircle/>&nbsp;&nbsp;Add New Product</a>
            &nbsp;
          </div>
          } */}
          <br/>
          <hr/>
          <div>
            <center>
            <a href={'/shop/' + id + '/'} className={` ${styles['navlinks']}`}>Home</a>
            &nbsp;|&nbsp;
            <a href={'/shop/' + id + '/about'} className={` ${styles['navlinks']}`}>About Us</a>
            &nbsp;|&nbsp;
            <a href={'/shop/' + id + '/products'} className={` ${styles['navlinks']}`}>Products ({shop?.products?.length})</a>
            &nbsp;|&nbsp;
            <a href={'/shop/' + id + '/review'} className={` ${styles['navlinks']}`}>Reviews</a>
            </center>
          </div>
          <hr/>

          <br/>
        </div>

        <center><h2>About Us</h2></center>
        <br/>
        <center><h3>{itemsSold} item sales with an average rating of {avgRating/2} / 5</h3></center>
        <br/>
        <center><p>{shop?.description}</p></center>
        <br/>
        <br/>
        <br/>
        <center><h2>Shop Address</h2></center>
        <br/>
        <center><p>{shop?.address}</p></center>

        <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>An error occured while executing the action</div>
        <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Action successfully done</div>
      </div>
  }
      <Footer/>
    </>
  )
}
