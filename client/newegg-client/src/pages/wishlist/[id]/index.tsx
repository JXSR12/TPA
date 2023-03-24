import React from 'react';
import styles from '@/styles/CartItem.module.css';
import actionStyles from '@/styles/Profile.module.scss'
import utilStyles from '@/styles/Utils.module.css';
import Navbar from '@/components/navbar';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import axios from 'axios';
import { ADDTOCART_QUERY, ADDTOWISHLIST_QUERY, CREATEWISHLIST_QUERY, DELETEFROMWISHLIST_QUERY, DELETEWISHLIST_QUERY, DUPLICATEWISHLISTITEMS_QUERY, FOLLOWWISHLIST_QUERY, GETUSER_QUERY, GRAPHQL_API, SIMILARPRODUCTS_QUERY, SINGLEPRODUCT_QUERY, SINGLEWISHLIST_QUERY, USERWISHLISTS_QUERY, WISHLISTCOMMENTS_QUERY, WISHLISTFOLLOWERS_QUERY } from '@/utils/constants';
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

export default function WishlistDetailPage(this: any){

  const router = useRouter();
  const [ id, setId ] = React.useState(router.query.id as string);
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ wishlist, setWishlist] = React.useState<Wishlist>({} as Wishlist);

  const [ showCommentModal, setShowCommentModal ] = React.useState<boolean>(false);
  const [ showWishlistModal, setShowWishlistModal ] = React.useState<boolean>(false);
  const [showUpdateWModal, setShowUpdateWModal] = React.useState<boolean>(false);

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [ followers, setFollowers ] = React.useState<User[]>([]);

  const [ comments, setComments ] = React.useState<WishlistComment[]>([]);
  const [ wishlists, setWishlists] = React.useState<Wishlist[]>([]);

  const [ selProduct, setSelProduct] = React.useState<Product>({} as Product);

  const [ userId, setUserId ] = React.useState<string>("")

  const retrieveFollowers = () => {
    axios.post(GRAPHQL_API, {
      query: WISHLISTFOLLOWERS_QUERY(id)
    }
    ).then(res => {
      console.log(id)
      if(id && typeof id !== undefined && id.length > 1){
        console.log(res.data.data.wishlistFollowers)
        setFollowers(res.data.data.wishlistFollowers)
      }
    }).catch(err => {
      console.log("Error retrieving wishlist followers")
    })
}

const retrieveWishlists = () => {
  axios.post(GRAPHQL_API, {
    query: USERWISHLISTS_QUERY
  },{
    headers: {
      Authorization: "Bearer " + jwtToken
    }
  }
  ).then(res => {
    setWishlists(res.data.data.wishlists)
  }).catch(err => {
    console.log(err)
  })
}

const retrieveComments = () => {
  axios.post(GRAPHQL_API, {
    query: WISHLISTCOMMENTS_QUERY(id)
  }
  ).then(res => {
    console.log(id)
    if(id && typeof id !== undefined && id.length > 1){
      setComments(res.data.data.wishlistComments)
    }
  }).catch(err => {
    console.log("Error retrieving wishlist comments")
  })
}

  const retrieveWishlist = () => {
      axios.post(GRAPHQL_API, {
        query: SINGLEWISHLIST_QUERY(id)
      }
      ).then(res => {
        console.log(id)
        if(id && typeof id !== undefined && id.length > 1){
          setWishlist(res.data.data.wishlist)
        }
      }).catch(err => {
        console.log("Error retrieving wishlist details")
      })
  }

  const removeFromWishlist = (productId: string) => {
    axios.post(GRAPHQL_API, {
      query: DELETEFROMWISHLIST_QUERY(id, productId),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      setShowSuccess(true)
      retrieveWishlist()
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error creating new wishlist")
    }).finally(() => {
    })
}

const addAllToCart = (items: WishlistItem[]) => {
  items.forEach(i => {
    axios.post(GRAPHQL_API, {
      query: ADDTOCART_QUERY(i.product.id, 1, ""),
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
      console.log("Error occured while trying to add item '" + i.product.name.substring(0, 30) + "' to cart")
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    })
  })
}

const deleteWishlist = () => {
  axios.post(GRAPHQL_API, {
    query: DELETEWISHLIST_QUERY(id as string),
  },
  {
    headers: {
      Authorization: "Bearer " + jwtToken
    }
  }
  ).then(res => {
    console.log(res)
    // retrieveWishlist();
    Router.push('/')
    setShowSuccess(true)
    setTimeout(() => {setShowSuccess(false)}, 2000)
  }).catch(err => {
    setShowError(true)
    setTimeout(() => {setShowError(false)}, 2000)
    console.log("Error deleting wishlist")
  }).finally(() => {
  })
}

const followWishlist = (id: string) => {
  axios.post(GRAPHQL_API, {
    query: FOLLOWWISHLIST_QUERY(id as string),
  },
  {
    headers: {
      Authorization: "Bearer " + jwtToken
    }
  }
  ).then(res => {
    console.log(res)
    retrieveFollowers();
    setShowSuccess(true)
    setTimeout(() => {setShowSuccess(false)}, 2000)
  }).catch(err => {
    setShowError(true)
    setTimeout(() => {setShowError(false)}, 2000)
    console.log("Error deleting wishlist")
  })
}

const duplicateWishlistItems = (sourceId: string, destinationId: string) => {
  axios.post(GRAPHQL_API, {
    query: DUPLICATEWISHLISTITEMS_QUERY(sourceId as string, destinationId as string),
  },
  {
    headers: {
      Authorization: "Bearer " + jwtToken
    }
  }
  ).then(res => {
    console.log(res.data)
    retrieveWishlists();
    setShowSuccess(true)
    setTimeout(() => {setShowSuccess(false)}, 2000)
  }).catch(err => {
    setShowError(true)
    setTimeout(() => {setShowError(false)}, 2000)
    console.log("Error duplicating wishlist items")
  })
}

const duplicateWishlist = (title: string, wprivate: string, id: string) => {
  axios.post(GRAPHQL_API, {
    query: CREATEWISHLIST_QUERY(title as string, wprivate as string),
  },
  {
    headers: {
      Authorization: "Bearer " + jwtToken
    }
  }
  ).then(res => {
    console.log(res.data)
    duplicateWishlistItems(id, res.data.data.createWishlist.id)
    retrieveWishlists();
    setShowSuccess(true)
    setTimeout(() => {setShowSuccess(false)}, 2000)
  }).catch(err => {
    setShowError(true)
    setTimeout(() => {setShowError(false)}, 2000)
    console.log("Error duplicating wishlist")
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

const addToWishlist = () => {
  setShowWishlistModal(true)
}

const handleUpdateWishlist = () => {
  setShowUpdateWModal(true);
}

  React.useEffect(() => {
    retrieveWishlist()
    retrieveFollowers()
    retrieveComments()
    retrieveWishlists()
    getUser()
  }, [id])

  React.useEffect(() => {
    setId(router.query.id as string)
  }, [router.query])

  return(
    <>
      <Head>
        <title>Oldegg - Wishlist</title>
        <meta
          name="description"
          content="Oldegg wishlist page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <div>
        <br/>
        <center>
          <br/>
          <h1>{wishlist?.title}</h1>
          <h4>by {wishlist?.user?.name}</h4>
          <br/>
          <h4>
            Followers ({followers.length})
          </h4>
          <h4>
            Items ({wishlist?.items?.length})
          </h4>
          <br/>
        </center>
        <hr/>
        {wishlist?.user?.id == userId ?
        <div className={`${actionStyles['actions']}`}>
          <a id="save" className={`${actionStyles['lx-btn']} ${actionStyles['save']}`} onClick={e => {handleUpdateWishlist()}}><FaEdit/>&nbsp;&nbsp;Edit</a>
          &nbsp;
          <a id="delete" className={`${actionStyles['lx-btn']} ${actionStyles['review']}`} onClick={ev => {deleteWishlist()}}><FaTrash/>&nbsp;&nbsp;Delete</a>
          &nbsp;
          <a id="view" className={`${actionStyles['lx-btn']} ${actionStyles['review']}`} onClick={e => addAllToCart(wishlist.items)}><FaCartPlus/>&nbsp;&nbsp;Add All to Cart</a>
        </div>
        :
        <div className={`${actionStyles['actions']}`}>
          {false ?
            <a id="unfollow" className={`${actionStyles['lx-btn']} ${actionStyles['review']}`} onClick={ev => {followWishlist(wishlist.id)}}><FaTimesCircle/>&nbsp;&nbsp;Unfollow</a>
          :
            <a id="follow" className={`${actionStyles['lx-btn']} ${actionStyles['save']}`} onClick={e => {followWishlist(wishlist.id)}}><FaPlusCircle/>&nbsp;&nbsp;Follow</a>
          }
          &nbsp;
          <a id="duplicate" className={`${actionStyles['lx-btn']} ${actionStyles['review']}`} onClick={e => {duplicateWishlist(wishlist.title, wishlist.type, wishlist.id)}}><FaCopy/>&nbsp;&nbsp;Duplicate</a>
          &nbsp;
          <a id="view" className={`${actionStyles['lx-btn']} ${actionStyles['review']}`} onClick={e => addAllToCart(wishlist.items)}><FaCartPlus/>&nbsp;&nbsp;Add All to Cart</a>
        </div>
        }
        <br/>
      </div>
      <div className={`${styles['basket']} `}>
        <div className={`${styles['basket-labels']}`}>
          <ul className={`${styles['ul']}`}>
            <li className={`${styles['li']} ${styles['item']} ${styles['item-heading']}`}>Product</li>
            <li className={`${styles['li']} ${styles['price']}`}>Price</li>
            <li className={`${styles['li']} ${styles['promo']}`}>Promotions</li>
          </ul>
        </div>
        {wishlist?.items?.length <= 0 &&
        <div className={`${styles['basket-product']}`}>
          <br/>
          <center>
            <h3>This list has no items at the moment</h3>
          </center>
          <br/>
        </div>
        }
        {wishlist?.items?.map(i =>
          <div className={`${styles['basket-product']}`} key={i.product.id}>
          <div className={`${styles['item']}`}>
            <div className={`${styles['product-image']}`}>
              <img src={i.product.images[0].image} alt="product image" className={`${styles['product-frame']}`} width={150} height={150}/>
            </div>
            <div className={`${styles['product-details']}`}>
              <h1>{i.product.name}</h1>
              <p className={`${styles['product-id']}`}>{i.product.id}</p>
            </div>
          </div>
          <div className={`${styles['price']}`}>{i.product.price}</div>
          <div className={`${styles['promo']}`}>{i.product.discount > 0 && <>{i.product.discount}% off, now ${((100-i.product.discount)/100 * i.product.price).toFixed(2)}</>}</div>
          <div className={`${styles['remove']}`}>
          {userId == wishlist?.user?.id &&
            <button className={`${styles['button']}`} onClick={e => {
              removeFromWishlist(i.product.id)
            }}>Remove from list</button>
          }
            <br/>
            <br/>

            <button className={`${styles['button']}`} onClick={e => {
              setSelProduct(i.product)
              addToWishlist()
            }}>Add to wishlist</button>

          </div>
        </div>)
        }
      </div>
      <br/>
      <div>
        <br/>
        <h3>Comments</h3>
        <br/>
        <br/>
        <br/>
        <div className={`${styles['comment-container']}`}>
        <button className={`${styles['button']} ${styles['checkout-cta']} ${styles['comment-btn']}`} onClick={e => setShowCommentModal(true)}><b>Add a Comment</b></button>
        {comments.map(e =>
          <div className={`${styles['comment-box']}`}>
          <div className={`${styles['comment-content']}`}>
            {e.content}
          </div>
          <div className={`${styles['comment-user']}`}>
            {e.user.name} - {new Date(e.date).toLocaleString()}
          </div>
        </div>
          )}
        </div>
      </div>
      <UpdateWishlistModal id={wishlist.id} oldisprivate={wishlist.type == "PRIVATE"} oldtitle={wishlist.title} show={showUpdateWModal} setShow={setShowUpdateWModal} retrieveWishlists={() => {retrieveWishlists()}} />
      <AddToWishlistModal product={selProduct} show={showWishlistModal} setShow={setShowWishlistModal} wishlists={wishlists} />
      <NewCommentModal retrieveComments={retrieveComments} setShow={setShowCommentModal} show={showCommentModal} wishlistId={id}/>
      <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>An error occured while executing the action</div>
      <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Action successfully done</div>
      <Footer/>
    </>
  )
}
