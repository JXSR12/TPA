import { Product } from '@/interfaces/product';
import styles from '@/styles/CardGrid.module.css';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

export default function ProductCard(props: {product: Product}){
  const { product } = props;

  const price_before = product.price
  const price_after = product.price - (product.discount * product.price / 100)
  const price_before_front = Math.floor(price_before)
  const price_after_front = Math.floor(price_after)
  const price_before_back = Math.floor((price_before - price_before_front) * 100)
  const price_after_back = Math.floor((price_after - price_after_front) * 100)

  function averageRating(){
    var sum = 0;

    product.reviews.forEach(function(e){
      sum += e.rating;
    })

    return (sum/product.reviews.length)/2;
  }

  return(
    <div className={styles['goods-container']}>
      <a href={"/product/" + product.id} className={styles['goods-img']}>
      <a href={"/product/" + product.id} className={styles['goods-img']}>
        <img src={product.images[0].image} title={product.name} alt={product.name}/>
      </a>
      <div className={styles['goods-info']}>
        <p><FaStar/>{averageRating()} / 5</p>
        <p className={styles['goods-title']} title="View Details">{product.name}</p>
        <div className={styles['tag-list']}>
        {product.discount > 0 ? <div className={styles['discount-tag']}>Save {product.discount}%</div> : <div className={styles['discount-tag-invisible']}>`</div>}
        {product.stock <= 0 ? <div className={styles['oos-tag']}>Out of Stock</div> : <div className={styles['oos-tag-invisible']}>`</div>}
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
