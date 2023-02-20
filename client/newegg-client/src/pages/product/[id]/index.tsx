import React from 'react';
import styles from '@/styles/Product.module.css';
import Navbar from '@/components/navbar';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import axios from 'axios';
import { ADDTOCART_QUERY, GRAPHQL_API, SIMILARPRODUCTS_QUERY, SINGLEPRODUCT_QUERY } from '@/utils/constants';
import { Product } from '@/interfaces/product';
import { useSessionStorage } from 'usehooks-ts';
import { FaHeart, FaShoppingCart, FaSignInAlt } from 'react-icons/fa';
import { Client, HydrationProvider } from 'react-hydration-provider';

export default function ProductPage(this: any){

  const router = useRouter();

  const [ id, setId ] = React.useState(router.query.id as string);
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [loading, setLoading] = React.useState(false);
  const [item, setItem] = React.useState<Product>();
  const [quantity, setQuantity] = React.useState<number>(0);
  const [images, setImages] = React.useState<string[]>([]);
  const [selImgIndex, setSelImgIndex ] = React.useState<number>(0);
  const [similars, setSimilars] = React.useState<Product[]>([]);

  const handleQuantityChange = (event: React.ChangeEvent<{ value: any }>) => {
    console.log("Quantity Change Custom")
    setQuantity(Math.floor(event.target.value as number));
  }

  const handleQuantityIncrease = () => {
   console.log("Quantity Change Increase")
   setQuantity(quantity + 1);
  }

  const handleSelectImage = (e: number) => {
    setSelImgIndex(e)
  }

  const handleQuantityDecrease = () => {
    console.log("Quantity Change Decrease")
    if(quantity > 0){
      setQuantity(quantity - 1);
    }
  }

  const signIn = () => {
    Router.push('/login')
  }

  const retrieveSimilars = () => {
    setLoading(true);
      axios.post(GRAPHQL_API, {
        query: SIMILARPRODUCTS_QUERY(item?.category.id as string, item?.id as string)
      }
      ).then(res => {
        setSimilars(res.data.data.products)
      }).catch(err => {
        console.log("Error retrieving similar products")
      }).finally(() => {
        setLoading(false)
      })
  }

  const retrieveItem = () => {
    setLoading(true);
      axios.post(GRAPHQL_API, {
        query: SINGLEPRODUCT_QUERY(id as string)
      }
      ).then(res => {
        console.log(id)
        if(id && typeof id !== undefined && id.length > 1){
          setItem(res.data.data.product)
        }
        console.log(res.data.data.product)
      }).catch(err => {
        console.log("Error retrieving product details")
      }).finally(() => {
        setLoading(false)
      })
  }

  const addToCart = () => {
    if(quantity > 0){
      setLoading(true);
      axios.post(GRAPHQL_API, {
        query: ADDTOCART_QUERY(id as string, quantity as number, ""),
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        console.log(id)
        console.log(res.data)
      }).catch(err => {
        console.log("Error adding product to cart")
      }).finally(() => {
        setLoading(false)
      })
    }else{
      alert("Quantity must be above 0 to add to cart!")
    }
  }

  React.useEffect(() => {
    retrieveItem()
  }, [id])

  React.useEffect(() => {
    console.log("Retrieving similar items")
    retrieveSimilars()
  }, [item])

  React.useEffect(() => {
    setId(router.query.id as string)
  }, [router.query])

  return(
    <HydrationProvider>
    <>
      <Head>
        <title>Oldegg - Product</title>
        <meta
          name="description"
          content="Oldegg product page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <div>

    <section id="services" className={` ${styles['section']} ${styles['services']} ${styles['section-bg']}`}>
      <div className={` ${styles['container-fluid']}`}>
         <div className={` ${styles['row']} ${styles['row-sm']}`}>
              <div className={` ${styles['columns']}`}>
                <div className={` ${styles['rows']} ${styles['_product-images']}`}>
                    <div className={` ${styles['picZoomer']}`}>
                      <img className={` ${styles['my_img']}`} src={(item ? item?.images[selImgIndex] ? item?.images[selImgIndex].image : "" : "") as string} alt=""/>
                    </div>
                </div>
                <div className={` ${styles['rows']}`}>
                    <ul className={` ${styles['piclist']}`}>
                      {item ? item.images.map((e, idx) =>
                        <li key={idx} onClick={e => handleSelectImage(idx)} className={idx === selImgIndex ? `${styles['sel']}` : ` ${styles['unsel']}`}><img src={item.images[idx].image} alt=""/></li>) : ""}
                    </ul>
                </div>
               </div>
               <div className={` ${styles['_product-detail-content']}`}>
                  <p className={` ${styles['_p-name']}`}>{item?.name}</p>
                  <ul className={` ${styles['spe_ul']}`}></ul>
                  <div className={` ${styles['_p-qty-and-cart']}`}>
                    <Client>
                      <div className={` ${styles['_p-add-cart']}`}>
                        {jwtToken !== 'NULL' ?
                        <button className={` ${styles['btn']} ${styles['btn-theme']} ${styles['btn-success']}`} onClick={addToCart} tabIndex={0}>
                        <FaShoppingCart/> &nbsp;Add to Cart
                      </button>
                      :
                      <button className={` ${styles['btn']} ${styles['btn-theme']} ${styles['btn-success']}`} onClick={signIn} tabIndex={0}>
                          <FaSignInAlt/> &nbsp;Sign In to Add to Cart
                        </button>
                      }
                      </div>
                    </Client>
                  </div>
                  <div className={` ${styles['_p-price-box']}`}>
                     <div className={` ${styles['p-list']}`}>
                      {item && item.discount > 0 && <span>From $<del>{item?.price}</del></span>}
                        <span className={` ${styles['price']}`}>${item ? item?.price - (item?.discount * item?.price / 100) : 0}</span>
                     </div>
                     <div className={` ${styles['_p-add-cart']}`}>
                        <div className={` ${styles['_p-qty']}`}>
                           <span>Quantity</span>
                           <br/>
                           <button className={` ${styles['value-button']} ${styles['decrease_']}`} id="" defaultValue="Decrease Value" onClick={handleQuantityDecrease}>-</button>
                           <input className={` ${styles['qty-input']}`} type="number" name="qty" id="number" value={quantity} onChange={handleQuantityChange}/>
                           <button className={` ${styles['value-button']} ${styles['increase_']}`} id="" defaultValue="Increase Value" onClick={handleQuantityIncrease}>+</button>
                        </div>
                     </div>
                     <div className={` ${styles['_p-features']}`}>
                        <span> Product Description </span>
                        <br/>
                        <div className={` ${styles['_p-descriptions']}`} dangerouslySetInnerHTML={{ __html: item?.description as string }}/>
                     </div>
                  </div>
               </div>
         </div>
      </div>
    </section>
    <section className={` ${styles['section']} ${styles['sec']} ${styles['bg-light']}`}>
      <div className={` ${styles['container']}`}>
         <div className={` ${styles['row']}`}>
            <div className={` ${styles['title_bx']} ${styles['col-sm-12']}`}>
               <h3 className={` ${styles['title']}`}> Similar Products </h3>
            </div>
         </div>
         <div className={` ${styles['row']}`}>
            <div className={` ${styles['col-md-12']} ${styles['list-slider']} ${styles['mt-4']}`}>
               <div className={` ${styles['owl-carousel']} ${styles['common_wd']} ${styles['owl-theme']}`} id="recent_post">

                {similars.map(e =>
                  <div className={` ${styles['item']}`} key={e.id}>
                  <div className={` ${styles['shadow']} ${styles['sq_box']}`}>
                     <div className={` ${styles['pdis_img']}`}>
                        <a href="#">
                        <img src={e.images[0].image}/>
                        </a>
                     </div>
                     <h4 className={` ${styles['mb-1']}`}> <a href={"/product/" + e.id}>{e.name}</a> </h4>
                     <div className={` ${styles['mb-2']} ${styles['price-box']}`}>
                        <span className={` ${styles['price']}`}>${e.price}</span>
                        {e.discount > 0 && <span className={` ${styles['offer-price']}`}>Up to <i className={` ${styles['fa']} ${styles['fa-inr']}`}></i> {e.discount} % OFF</span>}
                     </div>
                     <div className={` ${styles['btn-box']} ${styles['text-center']}`}>
                        <a className={` ${styles['btn']} ${styles['btn-sm']}`} href={"/product/" + e.id}> <FaShoppingCart/> View Details </a>
                     </div>
                  </div>
               </div>
                  )}

               </div>
            </div>
         </div>
      </div>
    </section>
    </div>
    </>
    </HydrationProvider>
  )
}
