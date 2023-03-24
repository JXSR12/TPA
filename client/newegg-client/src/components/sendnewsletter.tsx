import { GRAPHQL_API } from "@/utils/constants";
import axios from "axios";
import React from "react";
import { useSessionStorage } from "usehooks-ts";
import emailjs from '@emailjs/browser';
import Modal from "./modal";
import styles from '@/styles/Modal.module.css';
import textStyles from '@/styles/Login.module.css';
import utilStyles from '@/styles/Utils.module.css';
import actionStyles from '@/styles/Profile.module.scss';

export default function SendNewsletter(props: {emails: string[], retrieveEmails: any}){
  const {emails, retrieveEmails} = props;

  const [title, setTitle] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const sendEmail = (email: string) => {
    var templateParams = {
      destination_email: email,
      news_title: title,
      news_content: content,
    };
    console.log("Sending email to " + templateParams.destination_email);
    console.log("Title: " + templateParams.news_title);
    console.log("Content: " + templateParams.news_content);
    emailjs.send('jn_oldegg_mailing', 'template_newsletter_ojn2', templateParams, "eNnoQIH00U2byF10T").then(res => {
      retrieveEmails()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
      setTitle("")
      setContent("")
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error while sending email newsletters")
    }).finally(() => {
    })
}

  const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
    setTitle(event.target.value);
  }
  const handleContentChange = (event: React.ChangeEvent<{ value: string }>) => {
    setContent(event.target.value);
  }

  const handleEmailSend = () => {
    if(title.length > 0 && content.length > 0){
      emails.forEach(function(e){
        sendEmail(e)
      })
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  return(
      <div>
        <br/>
        <h2>
          &nbsp;Newsletter Status
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <h4>Currently there are {emails.length} users subscribed to newsletter</h4>
        <br/>
        <br/>
        <h2>
          &nbsp;Send a newsletter
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="text"
            placeholder="Newsletter Title"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={title}
            onChange={handleNameChange}
          />
          <textarea
            placeholder="Newsletter Content"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={content}
            onChange={handleContentChange}
          />
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleEmailSend}
          >
            <span>
              <span>SEND NEWSLETTER</span>
              <br></br>
            </span>
          </button>
          <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>News title and content must be filled!</div>
          <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully sent email newsletters!</div>
      </div>
  )
}
