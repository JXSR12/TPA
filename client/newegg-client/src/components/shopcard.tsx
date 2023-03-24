import { Shop } from '@/interfaces/shop';
import { User } from '@/interfaces/user';
import styles from '@/styles/CardGrid.module.css';
import actionStyles from '@/styles/Profile.module.scss'
import Image from 'next/image';
import { VscPass, VscError } from 'react-icons/vsc';

export default function ShopCard(props: {shop: Shop, editMode?: boolean, onUpdateClick?: any, onDeleteClick?: any}){
  const { shop, editMode, onUpdateClick, onDeleteClick} = props;

  return(
    <div className={`${styles['goods-container-user']}  ${styles['goods-container']}`}>
      <a className={styles['goods-img']}>
        <img src={shop.profilePic} title={shop.name} alt={shop.name}/>
      </a>
      <center>
      <div className={styles['goods-info']}>
        <p className={styles['goods-title']}>{shop.name}</p>
        <p>Managed by [{shop.user.name}]</p>
      </div>
      </center>
      {editMode &&
          <div className={`${actionStyles['actions']} ${actionStyles['actions-single']}`}>
            {!shop.user.banned ?
            <>
            <a id="save" className={`${actionStyles['lx-btn']} ${actionStyles['save']}`} onClick={onDeleteClick}><VscError/>&nbsp;&nbsp;Ban Shop</a>
            &nbsp;
            </>
            :
            <>
            <a id="delete" className={`${actionStyles['lx-btn']} ${actionStyles['clear']}`} onClick={onDeleteClick}><VscPass/>&nbsp;&nbsp;Unban Shop</a>
            &nbsp;
            </>
            }
          </div>
        }
    </div>
  )
}
