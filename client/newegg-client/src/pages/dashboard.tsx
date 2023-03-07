import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Profile.module.scss'
import listStyles from '@/styles/Modal.module.css';
import utilStyles from '@/styles/Utils.module.css';
import Link from 'next/link';
import axios from 'axios';
import { CREATEWISHLIST_QUERY, DELETEWISHLIST_QUERY, DUPLICATEWISHLISTITEMS_QUERY, FOLLOWEDWISHLISTSID_QUERY, FOLLOWEDWISHLISTS_QUERY, FOLLOWWISHLIST_QUERY, GETUSER_QUERY, GRAPHQL_API, PROTECTED_QUERY, PUBLICWISHLISTS_QUERY, UPDATEPASSWORD_QUERY, UPDATEPROFILE_QUERY, USERS_QUERY, USERWISHLISTS_QUERY } from '@/utils/constants';
import Router from 'next/router';
import { useSessionStorage } from 'usehooks-ts'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import Navbar from '@/components/navbar';
import Carousel, { ImageType } from '@/components/carousel';
import React from 'react';
import Recommendations from '@/components/recommendations';
import Carts, { DUMMY_DISTANCE } from '@/components/cartitems';
import validator from "validator";
import { FaAddressCard, FaBan, FaBroom, FaCamera, FaCameraRetro, FaCopy, FaCross, FaEdit, FaEnvelope, FaEye, FaKey, FaMobile, FaMoneyBill, FaPhone, FaPlusCircle, FaSave, FaTimesCircle, FaTrash, FaUser } from 'react-icons/fa';
import useChat from '@/hooks/useChat';
import { NewWishlistModal, TopUpVoucherModal, UpdateWishlistModal } from '@/components/modal';
import { Wishlist, WishlistItem } from '@/interfaces/wishlist';
import { Shipment } from '@/interfaces/shipment';
import { TransactionDetail } from '@/interfaces/transaction';
import { User } from '@/interfaces/user';
import Footer from '@/components/footer';


// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export enum ChatMessageType{
  INCOMING,
  OUTGOING
}

export interface ChatMessage{
  type: ChatMessageType
  text: string
}

export default function ProfilePage() {
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');

  const [ content, setContent ] = React.useState<string>("my profile");

  const handleContentChange = (event: React.ChangeEvent<{ value: string }>) => {
    setContent(event.target.value);
  }

  //Profile
  const [ inputName, setInputName ] = React.useState<string>("");
  const [ inputEmail, setInputEmail ] = React.useState<string>("");
  const [ inputPhone, setInputPhone ] = React.useState<string>("");
  const [ inputPassword, setInputPassword ] = React.useState<string>("");

  const [ inputOldPass, setInputOldPass ] = React.useState<string>("");
  const [ inputNewPass, setInputNewPass ] = React.useState<string>("");
  const [ inputNewPassConfirm, setInputNewPassConfirm ] = React.useState<string>("");

  const [ changePw, setChangePw ] = React.useState<boolean>(false);

  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputName(event.target.value);
  }
  const handleEmailChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputEmail(event.target.value);
  }
  const handlePhoneChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputPhone(event.target.value);
  }
  const handleOldPassChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputOldPass(event.target.value);
  }
  const handleNewPassChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputNewPass(event.target.value);
  }
  const handleNewPassConfirmChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputNewPassConfirm(event.target.value);
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
      setInputName(res.data.data.getUser.name)
      setInputEmail(res.data.data.getUser.email)
      setInputPhone(res.data.data.getUser.phone)
      setBalance(res.data.data.getUser.creditBalance)
      setInputPassword("PASSWORDPASSWORD")
    }).catch(err => {
      console.log(err)
    })
  }

  const toggleChangePw = () => {
    setChangePw(!changePw)
  }

  const deleteAccount = () => {
    alert("Account deletion is still WIP")
  }

  const clearAllFields = () => {
    setInputName("");
    setInputPhone("");
  }

  const handleSave = () => {
    if(!validator.isMobilePhone(inputPhone) || inputName.length < 5){
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      return;
    }

    if(changePw === true && inputNewPass.length > 0){
      handleUpdatePassword()
    }

    axios.post(GRAPHQL_API, {
      query: UPDATEPROFILE_QUERY(inputName, inputPhone)
    },{
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      setInputName(res.data.data.updateUser.name)
      setInputEmail(res.data.data.updateUser.email)
      setInputPhone(res.data.data.updateUser.phone)
      setInputPassword("PASSWORDPASSWORD")
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log(err)
    })
  }

  const handleUpdatePassword = () => {
    if(inputNewPass.length < 8 || inputNewPass !== inputNewPassConfirm || inputOldPass.length < 8){
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      return;
    }

    axios.post(GRAPHQL_API, {
      query: UPDATEPASSWORD_QUERY(inputOldPass, inputNewPass)
    },{
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      setInputName(res.data.data.updateUserPassword.name)
      setInputEmail(res.data.data.updateUserPassword.email)
      setInputPhone(res.data.data.updateUserPassword.phone)
      setInputPassword("PASSWORDPASSWORD")
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log(err)
    })
  }

  React.useEffect(() => {
    getUser()
  }, [jwtToken]);

  //Message Center

  const [ messageType, setMessageType ] = React.useState<string>("customer service");

  const roomId = 1010192;

  const { messages, sendMessage } = useChat(roomId);
  const [newMessage, setNewMessage] = React.useState<string>("");

  const [ csMessages, setCsMessages ] = React.useState<ChatMessage[]>([]);

  const handleMessageTypeChange = (event: React.ChangeEvent<{ value: string }>) => {
    setMessageType(event.target.value);
  }

  const handleNewMessageChange = (event: React.ChangeEvent<{ value: string }>) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");

    var newmsg : ChatMessage = {type: ChatMessageType.OUTGOING, text: newMessage};
    var newMessages = csMessages.concat(newmsg);
    setCsMessages(newMessages);

    dummyReplyMessage();
  };

  const dummyReplyMessage = () => {
    var reply : ChatMessage = {type: ChatMessageType.INCOMING, text: "This is a default reply by OldEgg Customer Service."};
    var newMessages = csMessages.concat(reply);

    setCsMessages(newMessages);
  }

  //OldEgg Credits
  const [balance, setBalance] = React.useState<number>(-1);

  const [showVoucherModal, setShowVoucherModal] = React.useState<boolean>(false);


  //Wishlists
  const [ wishlistType, setWishlistType ] = React.useState<string>("my lists");

  const [updatedWishlist, setUpdatedWishlist ] = React.useState<Wishlist>({id: "NULL", title: "NULL", type: "NULL", user: {} as User, items: []});

  const [showCreateWModal, setShowCreateWModal] = React.useState<boolean>(false);
  const [showUpdateWModal, setShowUpdateWModal] = React.useState<boolean>(false);

  const handleUpdateWishlist = (updated: Wishlist) => {
    setUpdatedWishlist(updated);
    setShowUpdateWModal(true);
  }

  const handleWishlistTypeChange = (event: React.ChangeEvent<{ value: string }>) => {
    setWishlistType(event.target.value);
  }

  const [ wishlists, setWishlists ] = React.useState<Wishlist[]>([])
  const [ followeds, setFolloweds ] = React.useState<Wishlist[]>([])
  const [ followedIds, setFollowedIds ] = React.useState<string[]>([])

  const retrieveFollowedIds = () => {
    axios.post(GRAPHQL_API, {
      query: FOLLOWEDWISHLISTSID_QUERY
    },{
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      var followedids : string[] = []
      res.data.data.followedWishlists.forEach(function(item : any){
        followedids.concat(item.id)
      })
      console.log(followedids)
      setFollowedIds(followedids)

    }).catch(err => {
      console.log(err)
    })
  }

  const retrieveWishlists = (query: string) => {
    axios.post(GRAPHQL_API, {
      query: query
    },{
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      setWishlists(query === USERWISHLISTS_QUERY ? res.data.data.wishlists : query === FOLLOWEDWISHLISTS_QUERY ? res.data.data.followedWishlists : res.data.data.publicWishlists)
    }).catch(err => {
      console.log(err)
    })
  }

  const deleteWishlist = (id: string) => {
    axios.post(GRAPHQL_API, {
      query: DELETEWISHLIST_QUERY(id as string),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res)
      retrieveWishlists(wishlistType === "my lists" ? USERWISHLISTS_QUERY : (wishlistType === "followed lists") ? FOLLOWEDWISHLISTS_QUERY : PUBLICWISHLISTS_QUERY);
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error deleting wishlist")
    }).finally(() => {
    })
  }

  const followWishlist = (id: string) => {
    console.log(followeds)

    axios.post(GRAPHQL_API, {
      query: FOLLOWWISHLIST_QUERY(id as string),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res)
      retrieveFollowedIds()
      retrieveWishlists(wishlistType === "my lists" ? USERWISHLISTS_QUERY : (wishlistType === "followed lists") ? FOLLOWEDWISHLISTS_QUERY : PUBLICWISHLISTS_QUERY);
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error deleting wishlist")
    })
  }

  const duplicateWishlistItems = (sourceId: string, destinationId: string) => {
    axios.post(GRAPHQL_API, {
      query: DUPLICATEWISHLISTITEMS_QUERY(sourceId as string, destinationId as string),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveWishlists(wishlistType === "my lists" ? USERWISHLISTS_QUERY : (wishlistType === "followed lists") ? FOLLOWEDWISHLISTS_QUERY : PUBLICWISHLISTS_QUERY);
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error duplicating wishlist items")
    })
  }

  const duplicateWishlist = (title: string, wprivate: string, id: string) => {
    axios.post(GRAPHQL_API, {
      query: CREATEWISHLIST_QUERY(title as string, wprivate as string),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      duplicateWishlistItems(id, res.data.data.createWishlist.id)
      retrieveWishlists(wishlistType === "my lists" ? USERWISHLISTS_QUERY : (wishlistType === "followed lists") ? FOLLOWEDWISHLISTS_QUERY : PUBLICWISHLISTS_QUERY);
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error duplicating wishlist")
    })
}

  function totalValue(items: WishlistItem[]): number{
    var total = 0.00;

    items.forEach(function(item){
      total+=item.product.price
    });

    return total
  }

  function onSaleCount(items: WishlistItem[]): number{
    var sum = 0;

    items.forEach(function(item){
      if(item.product.discount > 0){
        sum++;
      }
    });

    return sum;
  }

  React.useEffect(() => {
    retrieveFollowedIds()
    retrieveWishlists(wishlistType === "my lists" ? USERWISHLISTS_QUERY : (wishlistType === "followed lists") ? FOLLOWEDWISHLISTS_QUERY : PUBLICWISHLISTS_QUERY);
  }, [wishlistType])

  return (
    <>
      <Head>
        <title>Oldegg - Profile</title>
        <meta
          name="description"
          content="Oldegg profile page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <main className={`${styles['main']} ${styles['has-dflex-center']}`}>
      <select name="select-content" className={`${styles['select-content']}`} onChange={handleContentChange}>
             <option value="my profile" selected>My Profile</option>
             <option value="message center">Message Center</option>
             <option value="wishlists">Wishlists</option>
             <option value="OldEgg Credits">OldEgg Credits</option>
      </select>
        <section>
          <div className={styles['lx-container-70']}>
            <div className={styles['lx-row']}>
              <h1 className={styles['title']}>{content}</h1>
            </div>
            <div className={`${styles['lx-row']} ${styles['align-stretch']}`}>

              {content == 'my profile' &&
              <div className={`${styles['lx-column']} ${styles['column-user-pic']}`}>
                <div className={`${styles['profile-pic']} ${styles['bs-md']}`}>
                  <h1 className={`${styles['pic-label']}`}>Display Picture</h1>
                  <div className={`${styles['pic']} ${styles['bs-md']}`}>
                    <img src="https://res.cloudinary.com/dcy3tftwo/image/upload/v1676907609/images/Profile_avatar_placeholder_large_jphbqz.png" alt="" width="4024" height="6048" loading="lazy"/>
                    <a id="change-avatar" className={`${styles['lx-btn']}`}><FaCamera/>&nbsp;&nbsp;Profile pictures are coming soon</a>
                  </div>
                  <div className={`${styles['pic-info']}`}>
                    <p><i className="fas fa-exclamation-triangle"></i>&nbsp;&nbsp;This picture will appear on your profile, posts, reviews, and other user interactions.</p>
                  </div>
                </div>
              </div>}

              {content == 'my profile' &&
              <div className={`${styles['lx-column']}`}>
                <form action='get'>
                <div className={`${styles['fieldset']}`}>
                    <label htmlFor="email">Registered Email</label>
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaEnvelope/></span>
                      <input type="email" readOnly id="email" placeholder="Email Address" onChange={handleEmailChange} value={inputEmail} autoComplete="username"/>
                    </div>
                    <div id="email-helper" className={`${styles['helper']}`}>Your email address. (You cannot change this)</div>
                  </div>

                  <div className={`${styles['fieldset']}`}>
                    <label htmlFor="user-name">Display Name</label>
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaUser/></span>
                      <input type="text" id="user-name" placeholder="Display Name" onChange={handleNameChange} value={inputName} autoComplete="username" required/>
                    </div>
                    <div id="user-name-helper" className={`${styles['helper']}`}>
                      <p>Your profile name.</p>
                    </div>
                  </div>

                  <div className={`${styles['fieldset']}`}>
                    <label htmlFor="phone-num">Mobile Phone</label>
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaMobile/></span>
                      <input type="tel" id="phone-num" placeholder="Mobile Phone" onChange={handlePhoneChange} value={inputPhone} required/>
                    </div>
                    <div id="phone-num-helper" className={`${styles['helper']}`}>Your mobile phone number.</div>
                  </div>

                  <div className={`${styles['fieldset']}`}>
                    <label htmlFor="pass">{changePw ? "Change Password" : "Password"}</label>
                    {!changePw &&
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaKey/></span>
                      <input type="password" readOnly id="pass" placeholder="Password" value={inputPassword} autoComplete="current-password"/>
                    </div>
                    }

                    {changePw &&
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaKey/></span>
                      <input type="password" id="pass-old" placeholder="Your Current Password" onChange={handleOldPassChange} value={inputOldPass} autoComplete="current-password"/>
                    </div>
                    }
                    {changePw &&
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaKey/></span>
                      <input type="password" id="pass-new" placeholder="Your New Password" onChange={handleNewPassChange} value={inputNewPass} autoComplete="new-password"/>
                    </div>
                    }
                    {changePw &&
                    <div className={`${styles['input-wrapper']}`}>
                      <span className={`${styles['icon']}`}><FaKey/></span>
                      <input type="password" id="pass-new-confirm" placeholder="Confirm New Password" onChange={handleNewPassConfirmChange} value={inputNewPassConfirm} autoComplete="new-password-confirm"/>
                    </div>
                    }

                    <div id="pass-helper" className={`${styles['helper']}`}>{!changePw? "Your password, keep it secret." : "Make sure to use a strong one."}</div>
                    &nbsp;
                    <a className={`${styles['changepw-link']}`} onClick={toggleChangePw}>{!changePw ? "Change it here" : "Cancel"}</a>
                  </div>

                  <div className={`${styles['actions']}`}>
                    <a id="cancel" className={`${styles['lx-btn']} ${styles['cancel']}`} onClick={deleteAccount}><FaBan/>&nbsp;&nbsp;Delete Account</a>
                    <a id="clear" className={`${styles['lx-btn']} ${styles['clear']}`} onClick={clearAllFields}><FaBroom/>&nbsp;&nbsp;Clear All</a>
                    <a id="save" className={`${styles['lx-btn']} ${styles['save']}`} onClick={handleSave}><FaSave/>&nbsp;&nbsp;Save Changes</a>
                  </div>
                  </form>
              </div>
              }

              {
                content == 'message center' &&
                <div className={`${styles['lx-column']} ${styles['column-chat']}`}>
                  <select name="select-content-message" className={`${styles['select-content-message']}`} onChange={handleMessageTypeChange}>
                      <option value="customer service" selected>Customer Service</option>
                      <option value="seller messages">Seller Messages</option>
                      <option value="notifications">Notifications</option>
                  </select>
                  <div className={`${styles['chat-box']} ${styles['bs-md']}`}>
                    <h1 className={`${styles['chat-title']}`}>{messageType}</h1>
                    <br/>
                    <div className={`${styles['cs-chat']}`}>
                      {csMessages.map(c => c.type == ChatMessageType.INCOMING ?
                      <div className={`${styles['chat-set']} ${styles['cs-received']}`}>
                      <div className={`${styles['receiver-name']}`}>OldEgg Customer Service</div>
                      <div className={`${styles['received-message']}`}>{c.text}</div>
                    </div> :
                    <div className={`${styles['chat-set']} ${styles['cs-sent']}`}>
                    <div className={`${styles['sender-name']}`}>You</div>
                    <div className={`${styles['sent-message']}`}>{c.text}</div>
                  </div>)}
                    </div>
                    <div className={`${styles['input-box']}`}>
                      <textarea
                        className={`${styles['send-msg-input']}`}
                        value={newMessage}
                        onChange={handleNewMessageChange}
                        placeholder="Send your message.."
                        onResize={e => {}}
                      />
                      <button onClick={handleSendMessage} className={`${styles['send-msg-btn']}`}>
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              }

              {
                content == 'OldEgg Credits' &&
                <div className={`${styles['lx-column']} ${styles['column-creds']}`}>
                  <h2>Your account</h2>
                  <br/>
                  <hr/>
                  <br/>
                  <h3>Current balance</h3>
                  <h1>USD {balance.toFixed(2)}</h1>
                  <br/>
                  <hr/>
                  <div className={`${styles['actions']}`}>
                    <a id="save" className={`${styles['lx-btn']} ${styles['save']}`} onClick={e => setShowVoucherModal(true)}><FaMoneyBill/>&nbsp;&nbsp;Top Up</a>
                  </div>
                  <TopUpVoucherModal retrieveBalance={getUser} show={showVoucherModal} setShow={setShowVoucherModal}/>
                </div>
              }

              {
                content == 'wishlists' &&
                <div className={`${styles['lx-column']} ${styles['column-creds']}`}>
                  <br/>
                  <select name="select-content" className={`${styles['select-content']}`} onChange={handleWishlistTypeChange}>
                        <option value="my lists" selected>My Lists</option>
                        <option value="followed lists">Followed Lists</option>
                        <option value="public lists">Public Lists</option>
                  </select>
                  <br/>
                  <h2 className={styles['title']}>{wishlistType}</h2>
                  <br/>
                  <hr/>
                  <br/>
                  <div className={`${styles['grid-container']}`}>
                    {
                     wishlists.map(w =>
                        <div key={w.id} className={`${styles['grid-item']} ${listStyles['grid-item']}`}>
                          <input type={'hidden'} key={followeds.toString()}/>
                          <p>{w.title}</p>
                          <hr/>
                          {wishlistType !== 'my lists' && <h5>by {w.user.name}</h5>}
                          <br/>
                          <h3>{w.items.length} items</h3>
                          <h2>${totalValue(w.items).toFixed(2)}</h2>
                          <br/>
                          <hr/>
                          <h4>{onSaleCount(w.items)} item(s) in this list is on sale!</h4>

                          {wishlistType == 'my lists' &&
                          <center className={`${listStyles['display-on-hover']}`}>
                            <div className={`${styles['actions']}`}>
                              <a id="save" className={`${styles['lx-btn']} ${styles['save']}`} onClick={e => {handleUpdateWishlist(w)}}><FaEdit/>&nbsp;&nbsp;Edit</a>
                              &nbsp;
                              <a id="delete" className={`${styles['lx-btn']} ${styles['review']}`} onClick={ev => {deleteWishlist(w.id)}}><FaTrash/>&nbsp;&nbsp;Delete</a>
                              &nbsp;
                              <a id="view" className={`${styles['lx-btn']} ${styles['review']}`} onClick={e => Router.push("/wishlist/" + w.id)}><FaEye/>&nbsp;&nbsp;View</a>
                            </div>
                          </center>
                          }

                          {wishlistType !== 'my lists' &&
                          <center className={`${listStyles['display-on-hover']}`}>
                          <div className={`${styles['actions']}`}>
                            {followedIds.includes(w.id) ?
                              <a id="unfollow" className={`${styles['lx-btn']} ${styles['review']}`} onClick={ev => {followWishlist(w.id)}}><FaTimesCircle/>&nbsp;&nbsp;Unfollow</a>
                            :
                              <a id="follow" className={`${styles['lx-btn']} ${styles['save']}`} onClick={e => {followWishlist(w.id)}}><FaPlusCircle/>&nbsp;&nbsp;Follow</a>
                            }
                            &nbsp;
                            <a id="duplicate" className={`${styles['lx-btn']} ${styles['review']}`} onClick={e => {duplicateWishlist(w.title, w.type, w.id)}}><FaCopy/>&nbsp;&nbsp;Duplicate</a>
                            &nbsp;
                            <a id="view" className={`${styles['lx-btn']} ${styles['review']}`} onClick={e => Router.push("/wishlist/" + w.id)}><FaEye/>&nbsp;&nbsp;View</a>
                          </div>
                         </center>
                        }
                        </div>
                      )
                    }

                    {/* Last Element to Add New Item */}
                    {wishlistType === "my lists" &&
                      <div className={`${styles['grid-item-empty']}`} onClick={() => setShowCreateWModal(true)}>
                        <FaPlusCircle className={`${styles['large-icon']}`}/>
                        <p>Add a new list</p>
                      </div>
                    }

                    {wishlistType === "followed lists" && wishlists.length == 0 &&
                      <center>
                        <FaTimesCircle className={`${styles['large-icon']}`}/>
                        <p>You haven't followed any list yet, follow some first</p>
                      </center>
                    }

                    {wishlistType === "public lists" && wishlists.length == 0 &&
                      <center>
                        <FaTimesCircle className={`${styles['large-icon']}`}/>
                        <p>There is no public list available at the moment</p>
                      </center>
                    }

                  </div>
                  <UpdateWishlistModal key={updatedWishlist.id} id={updatedWishlist.id} oldisprivate={updatedWishlist.type == "PRIVATE"} oldtitle={updatedWishlist.title} show={showUpdateWModal} setShow={setShowUpdateWModal} retrieveWishlists={() => {retrieveWishlists(wishlistType === "my lists" ? USERWISHLISTS_QUERY : (wishlistType === "followed lists") ? FOLLOWEDWISHLISTS_QUERY : PUBLICWISHLISTS_QUERY)}} />
                  <NewWishlistModal show={showCreateWModal} setShow={setShowCreateWModal} retrieveWishlists={() => {retrieveWishlists(wishlistType === "my lists" ? USERWISHLISTS_QUERY : (wishlistType === "followed lists") ? FOLLOWEDWISHLISTS_QUERY : PUBLICWISHLISTS_QUERY)}} />
                </div>
              }

            </div>
          </div>
        </section>
      </main>
      <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Please make sure all the updated fields are valid!</div>
      <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Sucessfully updated profile!</div>
      <Footer/>
    </>
  );
}
