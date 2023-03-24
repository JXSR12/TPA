import { GRAPHQL_API } from "@/utils/constants";
import axios from "axios";
import React from "react";
import { useSessionStorage } from "usehooks-ts";
import emailjs from '@emailjs/browser';
import Modal from "./modal";
import listStyles from '@/styles/Modal.module.css';
import textStyles from '@/styles/Login.module.css';
import utilStyles from '@/styles/Utils.module.css';
import styles from '@/styles/Profile.module.scss';
import { SupportChatReview } from "@/interfaces/review";

export default function AllCSReviews(props: {reviews: SupportChatReview[]}){
  const { reviews } = props;
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  return(
    <div className={styles['lx-container-70']}>
    <div className={styles['lx-row']}>
      <h1 className={styles['title']}>Customer Service Chat Reviews</h1>
    </div>
    <br/>
    <br/>
    <div className={`${styles['lx-row']} ${styles['align-stretch']}`}>
        <div className={`${styles['lx-column']} ${styles['column-orders']}`}>
          <div className={`${listStyles['address-list']} ${listStyles['address-list-full']} ${listStyles['background-lighten']} ${listStyles['padding-a-bit']}`}>
            {reviews?.map(e =>
              <div key={e.id} className={`${listStyles['address-box']}`}>
                <br/>
                <h4>Reviewer:&nbsp;{e.user.name}</h4>
                <br/>
                <h3>
                  Posted on {new Date(e.createdAt).toLocaleString()}
                </h3>
                <hr className={`${listStyles['modal-div-dotted']} `}/>
                <br/>
                <h1>Rated {e.rating} out of 5</h1>
                <br/>
                <h3>
                  {e.description}
                </h3>
                <br/>
                <br/>
              </div>)}
              {
                (!reviews || reviews.length <= 0) && <center><h3>There are no reviews for Customer Service yet</h3></center>
              }
          </div>
        </div>
        <br/>
        <br/>
        <div className={`${styles['lx-column']} ${styles['column-orders']}`}>

        </div>
        <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Error occured while trying to add items to cart</div>
        <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully added all order items to cart!</div>
    </div>
  </div>

  )
}
