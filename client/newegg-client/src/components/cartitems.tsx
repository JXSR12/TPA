import { CartItem } from '@/interfaces/cart';
import { Product } from '@/interfaces/product';
import styles from '@/styles/CartItem.module.css';
import { ALLPRODUCTS_QUERY, CARTPRODUCTS_QUERY, GRAPHQL_API, REMOVECART_QUERY, SEARCHPRODUCTS_QUERY, UPDATECART_QUERY, USERS_QUERY } from '@/utils/constants';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import CartItemCard from './cartitemcard';
import ProductCard from './productcard';

export default function Carts(){

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL')
  const [ items, setItems ] = React.useState<CartItem[]>([])
  const [loading, setLoading] = React.useState(false);
  const [noData, setNoData] = React.useState(false);
  const [subtotalPrice, setSubtotalPrice] = React.useState<number>(0);
  const [promoPrice, setPromoPrice] = React.useState<number>(0);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);

  const handleQuantityChange = (event: React.ChangeEvent<{ value: any }>, productId: string) => {
    var newqty : number = event.target.value as number;
    updateCart(productId, newqty);
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
      }).catch(err => {
        console.log("Error updating product in cart")
      }).finally(() => {
        setLoading(false)
      })
    }else{
      alert("Quantity must be above 0 to update cart, remove item instead!")
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
      }).catch(err => {
        console.log("Error deleting product in cart")
      }).finally(() => {
        setLoading(false)
      })
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
      setTotalPrice(subtotal - promo);
  }, [items])

  React.useEffect(() => {
    retrieveItems()
  }, [])

  return(
    <div className={`${styles['main']}`}>
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
        </div>
      </div>
      )}


      <div className={`${styles['basket-module']}`}>
        <label htmlFor="promo-code">Enter a promo code</label>
        <input id="promo-code" type="text" name="promo-code" maxLength={6} className={`${styles['promo-code-field']}`}/>
        <button className={`${styles['promo-code-cta']} ${styles['button']}`}>Apply Code</button>
      </div>
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
        </div>
        <div className={`${styles['summary-delivery']}`}>
          <select name="delivery-collection" className={`${styles['summary-delivery-selection']}`}>
             <option value="0" selected={true}>Select Shipping Method</option>
             <option value="dhl">DHL</option>
             <option value="royalmail">Royal Mail</option>
             <option value="ups">UPS Postal Service</option>
             <option value="fedex">Federal Express</option>
          </select>
        </div>
        <div className={`${styles['summary-total']}`}>
          <div className={`${styles['total-title']}`}>Total</div>
          <div className={`${styles['total-value']} ${styles['final-value']}`} id="basket-total">{totalPrice.toFixed(2)}</div>
        </div>
        <div className={`${styles['summary-checkout']}`}>
          <button className={`${styles['button']} ${styles['checkout-cta']}`}>Go to Secure Checkout</button>
        </div>
      </div>
    </aside>
    </div>
    </div>
  )
}
