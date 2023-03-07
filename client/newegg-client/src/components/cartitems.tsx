import { Address } from '@/interfaces/address';
import { CartItem } from '@/interfaces/cart';
import { PaymentMethod } from '@/interfaces/paymentmethod';
import { Product } from '@/interfaces/product';
import { Shipment } from '@/interfaces/shipment';
import { User } from '@/interfaces/user';
import { Wishlist } from '@/interfaces/wishlist';
import styles from '@/styles/CartItem.module.css';
import utilStyles from '@/styles/Utils.module.css';
import { ALLADDRESS_QUERY, ALLPAYMENTMETHODS_QUERY, ALLPRODUCTS_QUERY, ALLSHIPMENTS_QUERY, CARTCHECKOUT_QUERY, CARTPRODUCTS_QUERY, GETUSER_QUERY, GRAPHQL_API, REMOVECART_QUERY, SEARCHPRODUCTS_QUERY, UPDATECART_QUERY, USERS_QUERY, USERWISHLISTS_QUERY } from '@/utils/constants';
import axios from 'axios';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import Modal, { AddToWishlistModal, NewAddressModal } from './modal';
import ProductCard from './productcard';
export const DUMMY_DISTANCE = 13.89;

export default function Carts(){
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL')
  const [ items, setItems ] = React.useState<CartItem[]>([])
  const [loading, setLoading] = React.useState(false);
  const [noData, setNoData] = React.useState(false);
  const [subtotalPrice, setSubtotalPrice] = React.useState<number>(0);
  const [promoPrice, setPromoPrice] = React.useState<number>(0);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);

  const [shipmentFee, setShipmentFee] = React.useState<number>(0);
  const [balance, setBalance] = React.useState<number>(-1);

  const [shipments, setShipments] = React.useState<Shipment[]>([]);
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [pmethods, setPmethods] = React.useState<PaymentMethod[]>([]);
  const [selShipment, setSelShipment] = React.useState<Shipment>({id: "0", name: "Select Shipment Type", fee: 0});
  const [selAddress, setSelAddress] = React.useState<Address>({id: "0", name: "Select Saved Address", content: "", primary: false})
  const [selPayment, setSelPayment] = React.useState<PaymentMethod>({id: "0", name: "Select Payment Method"})

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [ coError, setCoError ] = React.useState<boolean>(false);
  const [ coSuccess, setCoSuccess ] = React.useState<boolean>(false);

  const [ showAddressModal, setShowAddressModal ] = React.useState<boolean>(false);

  const handleShipmentChange = (event: React.ChangeEvent<{ value: any }>) => {
    if(event.target.value === "NULL"){
      setShipmentFee(0);
      setSelShipment({id: "0", name: "Select Shipment Type", fee: 0});
    }else{
      setSelShipment(shipments[event.target.value as number]);
    }
  }

  const handleAddressChange = (event: React.ChangeEvent<{ value: any }>) => {
    if(event.target.value === "NULL"){
      setSelAddress({id: "0", name: "Select Saved Address", content: "", primary: false});
    }else{
      setSelAddress(addresses[event.target.value as number]);
    }
  }

  const handlePaymentChange = (event: React.ChangeEvent<{ value: any }>) => {
    if(event.target.value === "NULL"){
      setSelPayment({id: "0", name: "Select Payment Method"});
    }else{
      setSelPayment(pmethods[event.target.value as number]);
    }
  }

  const handleQuantityChange = (event: React.ChangeEvent<{ value: any }>, productId: string) => {
    var newqty : number = event.target.value as number;
    updateCart(productId, newqty);
  }

  const retrieveShipments = () => {
    setLoading(true);
      axios.post(GRAPHQL_API, {
        query: ALLSHIPMENTS_QUERY
      }
      ).then(res => {
        setShipments(res.data.data.shipmentTypes)
      }).catch(err => {
        console.log("Error retrieving shipments")
      }).finally(() => {
        setLoading(false)
      })
  }

  const retrieveAddresses = () => {
    setLoading(true);
      axios.post(GRAPHQL_API, {
        query: ALLADDRESS_QUERY
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        setAddresses(res.data.data.addresses)
      }).catch(err => {
        console.log("Error retrieving addresses")
      }).finally(() => {
        setLoading(false)
      })
  }

  const retrievePaymentMethods = () => {
    setLoading(true);
      axios.post(GRAPHQL_API, {
        query: ALLPAYMENTMETHODS_QUERY
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        setPmethods(res.data.data.paymentMethods)
      }).catch(err => {
        console.log("Error retrieving payment methods")
      }).finally(() => {
        setLoading(false)
      })
  }

  const retrieveItems = () => {
    setLoading(true);
      axios.post(GRAPHQL_API, {
        query: CARTPRODUCTS_QUERY
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        setItems(res.data.data.carts)
        if(res.data.data.products.length === 0){
          setNoData(true)
        }else{
          setNoData(false)
        }
      }).catch(err => {
        console.log("Error retrieving products")
      }).finally(() => {
        setLoading(false)
      })
  }

  const updateCart = (id: string, quantity: number) => {
    if(quantity > 0){
      setLoading(true);
      axios.post(GRAPHQL_API, {
        query: UPDATECART_QUERY(id as string, quantity as number, ""),
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        console.log(id)
        console.log(res.data)
        retrieveItems()
        setShowSuccess(true)
        setTimeout(() => {setShowSuccess(false)}, 2000)
      }).catch(err => {
        setShowError(true)
        setTimeout(() => {setShowError(false)}, 2000)
        console.log("Error updating product in cart")
      }).finally(() => {
        setLoading(false)
      })
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  const deleteCart = (id: string) => {
      setLoading(true);
      axios.post(GRAPHQL_API, {
        query: REMOVECART_QUERY(id as string),
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        console.log(id)
        console.log(res.data)
        retrieveItems()
        setShowSuccess(true)
        setTimeout(() => {setShowSuccess(false)}, 2000)
      }).catch(err => {
        setShowError(true)
        setTimeout(() => {setShowError(false)}, 2000)
        console.log("Error deleting product in cart")
      }).finally(() => {
        setLoading(false)
      })
  }

  const [ showWishlistModal, setShowWishlistModal ] = React.useState<boolean>(false);

  const [ wishlists, setWishlists] = React.useState<Wishlist[]>([]);

  const [ clickedProduct, setClickedProduct ] = React.useState<Product>({} as Product);

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

  const addToWishlist = (product: Product) => {
    setClickedProduct(product)
    setShowWishlistModal(true);
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
      setBalance(res.data.data.getUser.creditBalance)
    }).catch(err => {
      console.log(err)
    })
  }

  const checkOut = () => {
    if(selShipment.id != "0" && selAddress.id != "0" && selPayment.id != "0" && balance >= totalPrice){
      // console.log(CARTCHECKOUT_QUERY(selShipment.id, selAddress.id, selPayment.id, DUMMY_DISTANCE))
      axios.post(GRAPHQL_API, {
        query: CARTCHECKOUT_QUERY(selShipment.id, selAddress.id, selPayment.id, DUMMY_DISTANCE)
      },{
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        console.log(res)
        setCoSuccess(true)
        setTimeout(() => {setCoSuccess(false)}, 2000)
        retrieveItems()
      }).catch(err => {
        console.log(err)
        setCoError(true)
        setTimeout(() => {setCoError(false)}, 2000)
      })
    }else{
      setCoError(true)
      setTimeout(() => {setCoError(false)}, 2000)
    }
  }

  React.useEffect(() => {
    var subtotal = 0;
    var promo = 0;
    var total = 0;
    items.forEach(e => {
      subtotal += (e.product.price * e.quantity);
      promo +=(e.product.price * e.product.discount / 100);
    });

      setSubtotalPrice(subtotal);
      setPromoPrice(promo);
      setTotalPrice(subtotal - promo + shipmentFee);
  }, [items, shipmentFee])

  React.useEffect(() => {
    setShipmentFee(selShipment.fee * DUMMY_DISTANCE);
  }, [selShipment])

  React.useEffect(() => {
    getUser()
    retrieveItems()
    retrieveShipments()
    retrieveAddresses()
    retrievePaymentMethods()
    retrieveWishlists()
  }, [])

  return(
    <div className={`${styles['main']}`}>

    {items.length > 0 ?
    <div className={`${styles['basket']}`}>
      <div className={`${styles['basket-labels']}`}>
        <ul className={`${styles['ul']}`}>
          <li className={`${styles['li']} ${styles['item']} ${styles['item-heading']}`}>Item</li>
          <li className={`${styles['li']} ${styles['price']}`}>Price</li>
          <li className={`${styles['li']} ${styles['quantity']}`}>Quantity</li>
          <li className={`${styles['li']} ${styles['subtotal']}`}>Subtotal</li>
        </ul>
      </div>
      {items.map(i =>
        <div className={`${styles['basket-product']}`}>
        <div className={`${styles['item']}`}>
          <div className={`${styles['product-image']}`}>
            <Image src={i.product.images[0].image} alt="product image" className={`${styles['product-frame']}`} width={150} height={150}/>
          </div>
          <div className={`${styles['product-details']}`}>
            <h1>{i.product.name}</h1>
            <p className={`${styles['product-id']}`}>{i.product.id}</p>
          </div>
        </div>
        <div className={`${styles['price']}`}>{i.product.price}</div>
        <div className={`${styles['quantity']}`}>
          <input type="number" value={i.quantity} min="1" onChange={e => handleQuantityChange(e, i.product.id)} className={`${styles['quantity-field']}`}/>
        </div>
        <div className={`${styles['subtotal']}`}>{(i.quantity * i.product.price).toFixed(2)}</div>
        <div className={`${styles['remove']}`}>
          <button className={`${styles['button']}`} onClick={e => deleteCart(i.product.id)}>Remove</button>
          <br/>
          <br/>
          <button className={`${styles['button']}`} onClick={e => addToWishlist(i.product)}>Add to Wishlist</button>
        </div>
      </div>
      )}

    <aside className={`${styles['aside']}`}>
      <div className={`${styles['summary']}`}>
        <div className={`${styles['summary-total-items']}`}><span className={`${styles['total-items']}`}></span>Your Shopping Cart</div>
        <div className={`${styles['summary-subtotal']}`}>
          <div className={`${styles['subtotal-title']}`}>Subtotal</div>
          <div className={`${styles['subtotal-value']} ${styles['final-value']}`} id="basket-subtotal">{subtotalPrice.toFixed(2)}</div>
          <div className={`${styles['summary-promo-hide']}`}>
            <div className={`${styles['promo-title']}`}>Promotion</div>
            <div className={`${styles['promo-value']} ${styles['final-value']}`} id="basket-promo">{promoPrice.toFixed(2)}</div>
          </div>
          {selShipment.id !== "0" &&
          <div className={`${styles['summary-shipping-hide']}`}>
            <div className={`${styles['shipping-title']}`}>Shipment Fee</div>
            <div className={`${styles['shipping-value']}`} id="basket-promo">{shipmentFee.toFixed(2)}</div>
          </div>
          }
        </div>
        <div className={`${styles['summary-delivery']}`}>
          <select name="delivery-collection" className={`${styles['summary-delivery-selection']}`} onChange={handleShipmentChange}>
             <option value="NULL" selected={true}>Select Shipping Method</option>
             {shipments.map((e, idx)=> <option value={idx}>{e.name}</option>)}
          </select>
        </div>
        <div className={`${styles['summary-total-items']}`}><span className={`${styles['total-items']}`}></span>Shipping Address</div>
        <br/>
        <div className={`${styles['summary-addresss']}`}>
          <select name="delivery-collection" className={`${styles['summary-delivery-selection']}`} onChange={handleAddressChange}>
             <option value="NULL" selected={true}>Select Saved Address</option>
             {addresses.map((e, idx)=> <option value={idx}>{e.name}</option>)}
          </select>
          <br/>

          {selAddress.id != "0" &&
          <div>
            <h3>Shipping to</h3>
            <br/>
            <h4>{selAddress.name}</h4>
            <hr/>
            <p>{selAddress.content}</p>
          </div>
          }

          <br/>
          <button className={`${styles['button']} ${styles['address-cta']}`} onClick={e => {setShowAddressModal(true)}}>Add New Address</button>
        </div>

        <br/>
        <div className={`${styles['summary-addresss']}`}>
          <select name="delivery-collection" className={`${styles['summary-delivery-selection']}`} onChange={handlePaymentChange}>
             <option value="NULL" selected={true}>Select Payment Method</option>
             {pmethods.map((e, idx)=> <option value={idx}>{e.name}</option>)}
          </select>
          <br/>

          {selPayment.id != "0" &&
          <div>
            <br/>
            <h4>Paying using {selPayment.name}</h4>
            <hr/>
            <h5>Your balance</h5>
            <h2>${balance.toFixed(2)}</h2>
          </div>
          }

          <br/>
        </div>

        <div className={`${styles['summary-total']}`}>
          <div className={`${styles['total-title']}`}>Total</div>
          <div className={`${styles['total-value']} ${styles['final-value']}`} id="basket-total">{totalPrice.toFixed(2)}</div>
        </div>
        <div className={`${styles['summary-checkout']}`}>
          <button className={`${styles['button']} ${styles['checkout-cta']}`} onClick={checkOut}><b>Checkout Items</b></button>
        </div>
      </div>
    </aside>
    </div>
    : <div className={`${styles['empty-cart-container']}`}>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <h2 className={`${styles['empty-cart']}`}>You do not have anything in your cart, add some items first</h2>
        <br/>
        <br/>
        <br/>
        <br/>
        <button className={`${styles['button']} ${styles['backhome-cta']}`} onClick={e => Router.push('/')}><b>Go back to Home</b></button>
        <br/>
        <br/>
      </div>}

    <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Quantity must be above 0 to update cart, remove item instead!</div>
    <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully updated cart!</div>

    <div id={utilStyles['error-snackbar']} className={coError ? utilStyles['show'] : ''}>Shipment type, shipping address must be selected. Selected payment method balance must suffice!</div>
    <div id={utilStyles['success-snackbar']} className={coSuccess ? utilStyles['show'] : ''}>Successfully checked out cart!</div>
    <NewAddressModal show={showAddressModal} setShow={setShowAddressModal} addresses={addresses} retrieveAddresses={retrieveAddresses}/>
    <AddToWishlistModal product={clickedProduct} show={showWishlistModal} setShow={setShowWishlistModal} wishlists={wishlists} />
    </div>
  )
}
