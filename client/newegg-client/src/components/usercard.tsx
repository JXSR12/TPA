import { User } from '@/interfaces/user';
import styles from '@/styles/CardGrid.module.css';
import actionStyles from '@/styles/Profile.module.scss'
import Image from 'next/image';
import { VscPass, VscError } from 'react-icons/vsc';

export default function UserCard(props: {user: User, editMode?: boolean, onUpdateClick?: any, onDeleteClick?: any}){
  const { user, editMode, onUpdateClick, onDeleteClick} = props;

  return(
    <div className={`${styles['goods-container-user']}  ${styles['goods-container']} ${editMode ? styles['goods-container-shortimg'] : ''}`}>
      <a className={styles['goods-img']}>
        <img src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"} title={user.name} alt={user.name}/>
      </a>
      <center>
      <div className={styles['goods-info']}>
        <p className={styles['goods-title']}>{user.name}</p>
        <p>{user.email}</p>
      </div>
      </center>
      {editMode &&
          <div className={`${actionStyles['actions']} ${actionStyles['actions-single']}`}>
            {!user.banned ?
            <>
            <a id="save" className={`${actionStyles['lx-btn']} ${actionStyles['save']}`} onClick={onDeleteClick}><VscError/>&nbsp;&nbsp;Ban User</a>
            &nbsp;
            </>
            :
            <>
            <a id="delete" className={`${actionStyles['lx-btn']} ${actionStyles['clear']}`} onClick={onDeleteClick}><VscPass/>&nbsp;&nbsp;Unban User</a>
            &nbsp;
            </>
            }
          </div>
        }
    </div>
  )
}
