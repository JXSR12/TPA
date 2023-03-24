import React from 'react';
import styles from '@/styles/CartItem.module.css';
import actionStyles from '@/styles/Profile.module.scss'
import utilStyles from '@/styles/Utils.module.css';
import listStyles from '@/styles/Modal.module.css';
import ciStyles from '@/styles/CartItem.module.css';
import searchStyles from '@/styles/SearchBar.module.css'
import Navbar from '@/components/navbar';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import axios from 'axios';
import { ADDTOCART_QUERY, ADDTOWISHLIST_QUERY, CREATEWISHLIST_QUERY, DELETEFROMWISHLIST_QUERY, DELETEWISHLIST_QUERY, DUPLICATEWISHLISTITEMS_QUERY, FOLLOWWISHLIST_QUERY, GETUSER_QUERY, GRAPHQL_API, RECOMMENDEDPRODUCTS_QUERY, SHOPAVGRATING_QUERY, SHOPITEMSSOLD_QUERY, SHOPRECOMMENDED_QUERY, SHOPREVIEWS_QUERY, SIMILARPRODUCTS_QUERY, SINGLEPRODUCT_QUERY, SINGLESHOP_QUERY, SINGLEWISHLIST_QUERY, USERWISHLISTS_QUERY, WISHLISTCOMMENTS_QUERY, WISHLISTFOLLOWERS_QUERY } from '@/utils/constants';
import { Product } from '@/interfaces/product';
import { useSessionStorage } from 'usehooks-ts';
import { FaCartPlus, FaClipboard, FaCopy, FaEdit, FaEye, FaHeart, FaPlusCircle, FaShoppingCart, FaSignInAlt, FaTimesCircle, FaTrash } from 'react-icons/fa';
import { Client, HydrationProvider } from 'react-hydration-provider';
import Footer from '@/components/footer';
import { AddToWishlistModal, NewCommentModal, ReviewDetailModal, UpdateWishlistModal } from '@/components/modal';
import { Wishlist, WishlistItem } from '@/interfaces/wishlist';
import Image from 'next/image';
import { User } from '@/interfaces/user';
import { WishlistComment } from '@/interfaces/comment';
import { Shop } from '@/interfaces/shop';
import { ProductReview } from '@/interfaces/review';

export default function ShopReview(this: any){

  const router = useRouter();
  const [ id, setId ] = React.useState(router.query.id as string);
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ shop, setShop] = React.useState<Shop>({} as Shop);

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [ selProduct, setSelProduct] = React.useState<Product>({} as Product);

  const [ userId, setUserId ] = React.useState<string>("")

  const [ reviews, setReviews ] = React.useState<ProductReview[]>([]);

  const [ showDetail, setShowDetail ] = React.useState<boolean>(false);
  const [ updatedReview, setUpdatedReview ] = React.useState<ProductReview>({} as ProductReview);

  const [ searchQuery, setSearchQuery ] = React.useState<string>("");

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

const retrieveReviews = () => {
  axios.post(GRAPHQL_API, {
    query: SHOPREVIEWS_QUERY(id)
  },
  {
    headers: {
      Authorization: "Bearer " + jwtToken
    }
  }
  ).then(res => {
    console.log(jwtToken)
    console.log(res.data)
    setReviews(res.data.data.shopReviews)
  }).catch(err => {
    console.log("Error retrieving reviews")
  })
}

function avgRating() : number{
  var sum = 0;
  var len = reviews.length

  reviews.forEach(function(e){
    sum += e.rating
  })

  return sum/len;
}

function ratingCount(value: number) : number{
  var count = 0;

  reviews.forEach(function(e){
    if(e.rating === value){
      count++
    }
  })

  return count;
}

function questionnairePercentage(field: string) : number{
  var sum = 0;
  var len = reviews.length;

  reviews.forEach(function(e){
    if(field === "delivery"){
      if(e.onTimeDelivery){
        sum++;
      }
    }else if(field === "accuracy"){
      if(e.productAccuracy){
        sum++;
      }
    }else if(field === "satisfaction"){
      if(e.serviceSatisfaction){
        sum++;
      }
    }
  })

  return (sum/len) * 100;
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

const handleSearchChange = (event: React.ChangeEvent<{ value: string }>) => {
  setSearchQuery(event.target.value);
}

const handleSearch = (event: any) => {

}

const [ reviewPeriod, setReviewPeriod ] = React.useState<string>("Any");

const handlePeriodChange = (event: React.ChangeEvent<{ value: string }>) => {
  setReviewPeriod(event.target.value);
}

const [ filteredReviews, setFilteredReviews ] = React.useState<ProductReview[]>([])

React.useEffect(() => {
  setFilteredReviews(reviews?.filter(e => {
    let dateFilterPassed = true;
    if (reviewPeriod !== "Any") {
      const currentDate = new Date();
      const orderDate = new Date(e.createdAt);
      if (reviewPeriod === "Today") {
        dateFilterPassed = Math.abs(currentDate.getTime() - orderDate.getTime()) < 24 * 60 * 60 * 1000;
      } else if (reviewPeriod === "Recent") {
        dateFilterPassed = Math.abs(currentDate.getTime() - orderDate.getTime()) < 7 * 24 * 60 * 60 * 1000;
      } else if (reviewPeriod === "This Month") {
        dateFilterPassed = (currentDate.getMonth() === orderDate.getMonth()) && (currentDate.getFullYear() === orderDate.getFullYear());
      }
    }
    return JSON.stringify(e).toLowerCase().includes(searchQuery.toLowerCase()) && dateFilterPassed;
  }))
  }, [reviews, searchQuery, reviewPeriod])

  React.useEffect(() => {
    retrieveShop()
    getUser()
    retrieveReviews()
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
        <center>

        <main className={`${actionStyles['main']} ${actionStyles['has-dflex-center']}`}>
        <>
          <h2>Insights and Statistics</h2>
          <br/>
          <hr className={`${listStyles['modal-div-dotted']} `}/>
          <br/>
          <h1>{(avgRating()/2).toFixed(2)}</h1>
          <h3>Average Rating</h3>
          <h4>from {reviews.length} ratings</h4>
          <br/>

          {[1, 2, 3, 4, 5].map(e =>
          <>
            <h4>{e + " - " + (e+0.5) + " stars (" + (ratingCount(e*2) + ratingCount((e+0.5)*2))+ " ratings)"}</h4>
            <br/>
          </>
          )}



          <hr className={`${listStyles['modal-div-dotted']} `}/>
          <br/>
          <h1>{questionnairePercentage("delivery").toFixed(2)} %</h1>
          <h3>On-Time Delivery</h3>
          <br/>
          <h1>{questionnairePercentage("accuracy").toFixed(2)} %</h1>
          <h3>Product Accuracy</h3>
          <br/>
          <h1>{questionnairePercentage("satisfaction").toFixed(2)} %</h1>
          <h3>Service Satisfaction</h3>
          <br/>
          <hr/>
          <br/>
        </>
        <section>
          <div className={actionStyles['lx-container-70']}>
            <div className={actionStyles['lx-row']}>
              <h1 className={actionStyles['title']}>All Shop Reviews</h1>
            </div>
            <br/>
            <div className={searchStyles['search-form-order']} role="search">
              <label htmlFor='search' className={searchStyles['label']}>Search</label>
              <input className={searchStyles['input-order']} id="search" type="search" onChange={handleSearchChange} placeholder="Search by product name, reviewer name, description, etc." autoFocus required />
              <button className={searchStyles['button-order']} type="submit" onClick={handleSearch}>Apply Filters</button>
            </div>
            <br/>
            <select name="select-content" value={reviewPeriod} className={`${actionStyles['select-content']} ${styles['w-20']}`} onChange={handlePeriodChange}>
              <option value="Any" selected>Any Period</option>
              <option value="Today" selected>Today (24h)</option>
              <option value="Recent" selected>Recent (7d)</option>
              <option value="This Month" selected>This Month (30d)</option>
            </select>
            <br/>
            <div className={`${actionStyles['lx-row']} ${actionStyles['align-stretch']}`}>
                <div className={`${actionStyles['lx-column']} ${actionStyles['column-orders']}`}>
                  <div className={`${listStyles['address-list']} ${listStyles['address-list-full']} ${listStyles['background-lighten']} ${listStyles['padding-a-bit']}`}>
                    {filteredReviews?.map(e =>
                      <div key={e.id} className={`${listStyles['address-box']}`}>
                        <h4>Product:&nbsp;{e.product.name}</h4>
                        <br/>
                        <h4>Sold by&nbsp;{e.product.shop.name}</h4>
                        <br/>
                        <h4>Reviewed by&nbsp;{e.user.name}</h4>
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
                          <div className={`${actionStyles['actions']}`}>
                            <a id="review" className={`${actionStyles['lx-btn']} ${actionStyles['review']}`} onClick={ev => {
                              setUpdatedReview(e)
                              setShowDetail(true)
                            }}><FaClipboard/>&nbsp;&nbsp;View Details</a>
                          </div>
                        </center>
                      </div>)}
                      {
                        (!reviews || reviews.length <= 0) && <center><h3>There isn't any reviews for this shop yet</h3></center>
                      }
                  </div>
                </div>
                <br/>
                <br/>
                <div className={`${actionStyles['lx-column']} ${actionStyles['column-orders']}`}>

                </div>
                <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Error occured while trying to add items to cart</div>
                <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully added all order items to cart!</div>
            </div>
          </div>
        </section>
        <ReviewDetailModal retrieveReviews={retrieveReviews} show={showDetail} setShow={setShowDetail} review={updatedReview} />
      </main>
      </center>
        <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>An error occured while executing the action</div>
        <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Action successfully done</div>
      </div>
  }
      <Footer/>
    </>
  )
}
