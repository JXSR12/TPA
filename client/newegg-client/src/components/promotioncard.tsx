import { PromotionBanner } from '@/interfaces/promotion';
import { User } from '@/interfaces/user';
import { CreditVoucher } from '@/interfaces/voucher';
import styles from '@/styles/CardGrid.module.css';
import actionStyles from '@/styles/Profile.module.scss'
import Image from 'next/image';
import { VscPass, VscError } from 'react-icons/vsc';

export default function PromotionCard(props: {promotion: PromotionBanner, editMode?: boolean, onUpdateClick?: any, onDeleteClick?: any}){
  const { promotion, editMode, onUpdateClick, onDeleteClick} = props;

  return(
    <div className={`${styles['goods-container-user']}  ${styles['goods-container']} ${editMode ? styles['goods-container-shortimg'] : ''}`}>
      <a className={styles['goods-img']}>
        <img src={promotion.image} title={promotion.title} alt={promotion.title}/>
      </a>
      <center>
      <div className={styles['goods-info']}>
        <p className={styles['goods-title']}>{promotion.title}</p>
      </div>
      </center>
      {editMode &&
          <div className={`${actionStyles['actions']} ${actionStyles['actions-single']}`}>
            <a id="save" className={`${actionStyles['lx-btn']} ${actionStyles['save']}`} onClick={onDeleteClick}><VscError/>&nbsp;&nbsp;Delete Promotion Banner</a>
            &nbsp;
          </div>
        }
    </div>
  )
}
