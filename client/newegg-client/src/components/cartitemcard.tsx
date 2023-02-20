import { CartItem } from '@/interfaces/cart';
import { Product } from '@/interfaces/product';
import styles from '@/styles/CartItem.module.css';
import Image from 'next/image';

export default function CartItemCard(props: {item: CartItem}){
  const { item } = props;

  const product = item.product;
  const user = item.user;

  const price_before = product.price
  const price_after = product.price - (product.discount * product.price / 100)
  const price_before_front = Math.floor(price_before)
  const price_after_front = Math.floor(price_after)
  const price_before_back = Math.floor((price_before - price_before_front) * 100)
  const price_after_back = Math.floor((price_after - price_after_front) * 100)

  return(
    <div className={styles['goods-container']}>
      <a href={"/product/" + product.id} className={styles['goods-img']}>
      <a href="" className={styles['goods-img']}>
        <img src={product.images[0].image} title={product.name} alt={product.name}/>
      </a>
      <div className={styles['goods-info']}>
        <p className={styles['goods-title']} title="View Details">{product.name}</p>
        <div className={styles['tag-list']}>
        {product.discount > 0 ? <div className={styles['discount-tag']}>Save {product.discount}%</div> : <div className={styles['discount-tag-invisible']}>`</div>}
        </div>
        <div className={styles['goods-price is-horizontal']}>
          <div className={styles['goods-price-current']}>
            <span className={styles['goods-price-label']}></span>
            <span className={styles['goods-price-symbol']}>$</span>
            <span className={styles['goods-price-value']}><strong>{price_after_front}</strong><sup>.{price_after_back}</sup></span>
          </div>
          {product.discount > 0 && <div className={styles['goods-price-was']}>${price_before_front}.{price_before_back}</div>}
        </div>
      </div>
      </a>
    </div>
  )
}
