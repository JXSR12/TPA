import { User } from '@/interfaces/user';
import { CreditVoucher } from '@/interfaces/voucher';
import styles from '@/styles/CardGrid.module.css';
import actionStyles from '@/styles/Profile.module.scss'
import Image from 'next/image';
import { VscPass, VscError } from 'react-icons/vsc';

export default function VoucherCard(props: {voucher: CreditVoucher, editMode?: boolean, onUpdateClick?: any, onDeleteClick?: any}){
  const { voucher, editMode, onUpdateClick, onDeleteClick} = props;

  return(
    <div className={`${styles['goods-container-user']}  ${styles['goods-container']} ${editMode ? styles['goods-container-shortimg'] : ''}`}>
      <a className={styles['goods-img']}>
        <img src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"} title={voucher.id} alt={voucher.id}/>
      </a>
      <center>
      <div className={styles['goods-info']}>
        <p className={styles['goods-title']}>{voucher.id}</p>
        <h3><b>{voucher.value.toFixed(2)} $</b></h3>
        <br/>
        <p>{voucher.valid ? "NOT REDEEMED" : "REDEEMED"}</p>
      </div>
      </center>
      {editMode &&
          <div className={`${actionStyles['actions']} ${actionStyles['actions-single']}`}>
            <a id="save" className={`${actionStyles['lx-btn']} ${actionStyles['save']}`} onClick={onDeleteClick}><VscError/>&nbsp;&nbsp;Delete Voucher</a>
            &nbsp;
          </div>
        }
    </div>
  )
}
