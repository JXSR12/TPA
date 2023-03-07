import styles from '@/styles/Modal.module.css';
import textStyles from '@/styles/Login.module.css';
import utilStyles from '@/styles/Utils.module.css';
import React from 'react';
import { FaDivide, FaTrash } from 'react-icons/fa';
import { Address } from '@/interfaces/address';
import axios from 'axios';
import { ADDTOWISHLIST_QUERY, CREATEWISHLISTCOMMENT_QUERY, CREATEWISHLIST_QUERY, DELETEADDRESS_QUERY, DELETEWISHLIST_QUERY, GRAPHQL_API, NEWADDRESS_QUERY, REDEEMVOUCHER_QUERY, UPDATEWISHLIST_QUERY } from '@/utils/constants';
import { useSessionStorage } from 'usehooks-ts';
import { CreditVoucher } from '@/interfaces/voucher';
import { Wishlist } from '@/interfaces/wishlist';
import { Product } from '@/interfaces/product';

export default function Modal(props: {show: boolean, setShow: any, content: any}){
  const {show, setShow, content} = props;

  return(
    <div id="modal-def" className={`${(show ? styles['modal-show'] : styles['modal'])}`}>
      <div className={`${styles['modal-content']}`}>
        <span className={`${styles['close']}`} onClick={e => {setShow(false)}}>&times;</span>
          {content}
      </div>
    </div>
  )
}

export function NewAddressModal(props: {show: boolean, setShow: any, addresses: Address[], retrieveAddresses: any}){
  const {show, setShow, addresses, retrieveAddresses} = props;

  const [name, setName] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const [ primary, setPrimary ] = React.useState<boolean>(false);
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const createNewAddress = () => {
    axios.post(GRAPHQL_API, {
      query: NEWADDRESS_QUERY(name as string, content as string, primary as boolean),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveAddresses()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
      setName("")
      setContent("")
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error creating new address")
    }).finally(() => {
    })
}

  const deleteAddress = (id: string) => {
    axios.post(GRAPHQL_API, {
      query: DELETEADDRESS_QUERY(id as string),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res)
      retrieveAddresses()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error deleting address")
    }).finally(() => {
    })
  }

  const handlePrimaryChange = (event: React.ChangeEvent<{ value: any }>) => {
    setPrimary(!primary);
  }

  const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
    setName(event.target.value);
  }
  const handleContentChange = (event: React.ChangeEvent<{ value: string }>) => {
    setContent(event.target.value);
  }

  const handleNewAddressCreate = () => {
    if(name.length > 0 && content.length > 0){
      createNewAddress()
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  return(
    <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <h2>
          &nbsp;My Saved Addresses
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <div className={`${styles['address-list']}`}>
          {addresses.map(e =>
            <div className={`${styles['address-box']}`}>
              <h3>
                {e.name} {e.primary ? "(Default)" : ""}
              </h3>
              <hr className={`${styles['modal-div-dotted']} `}/>
              <p>
                {e.content}
              </p>
              <br/>
              <FaTrash className={`${styles['address-box-delete']}`} onClick={ev => deleteAddress(e.id)}/>
            </div>)}
        </div>
        <br/>
        <br/>
        <h2>
          &nbsp;Add a New Address
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="text"
            placeholder="New Address Name"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={name}
            onChange={handleNameChange}
          />
          <textarea
            placeholder="New Address Details"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={content}
            onChange={handleContentChange}
          />
          <div className={textStyles['container3']}>
            <input type="checkbox" checked={primary} className={`${textStyles['switch-checkbox-modal']} `} id="switch" onChange={handlePrimaryChange}/>
            <label htmlFor="switch" className={`${textStyles['switch-label-modal']} `}>a</label>
            <p className={`${textStyles['text09']} `}>Make this my default shipping address</p>
          </div>
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleNewAddressCreate}
          >
            <span>
              <span>ADD TO SAVED ADDRESS LIST</span>
              <br></br>
            </span>
          </button>
          <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Address name and content must be filled!</div>
          <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully made changes to saved addresses!</div>
      </div>
    }/>
  )
}

export function TopUpVoucherModal(props: {show: boolean, setShow: any, retrieveBalance: any}){
  const {show, setShow, retrieveBalance} = props;

  const [ code, setCode] = React.useState<string>("");
  const [ voucher, setVoucher ] = React.useState<CreditVoucher>({id: "0", value: 0, valid: false})
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const redeemVoucher = () => {
    if(code.length > 0){
      axios.post(GRAPHQL_API, {
        query: REDEEMVOUCHER_QUERY(code),
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        setVoucher(res.data.data.redeemVoucher);
        if(res.data.data.redeemVoucher && res.data.data.redeemVoucher.id){
          setCode("")
          setShowSuccess(true)
          setTimeout(() => {
            setShowSuccess(false)
          }, 2000)
          setShow(false)
          retrieveBalance()
        }else{
          setShowError(true)
          setTimeout(() => {setShowError(false)}, 2000)
        }
      }).catch(err => {
        setShowError(true)
        setTimeout(() => {setShowError(false)}, 2000)
        console.log("Error redeeming voucher")
      }).finally(() => {
      })
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  const handleCodeChange = (event: React.ChangeEvent<{ value: string }>) => {
    setCode(event.target.value);
  }

  return(
    <div>
      <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <h2>
          &nbsp;Redeem OldEgg Credits Voucher
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="text"
            placeholder="Input voucher code"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={code}
            onChange={handleCodeChange}
          />
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={redeemVoucher}
          >
            <span>
              <span>REDEEM CREDITS VOUCHER</span>
              <br></br>
            </span>
          </button>
      </div>
    }/>
      <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Voucher code must be filled and valid, and must not be a used code!</div>
      <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully redeemed voucher '{voucher && voucher.id}' worth of ${voucher && voucher.value}!</div>
    </div>
  )
}

export function NewWishlistModal(props: {show: boolean, setShow: any, retrieveWishlists: any}){
  const {show, setShow, retrieveWishlists} = props;

  const [title, setTitle] = React.useState<string>("");
  const [ wprivate, setWprivate ] = React.useState<boolean>(false);
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const createNewWishlist = () => {
    axios.post(GRAPHQL_API, {
      query: CREATEWISHLIST_QUERY(title as string, wprivate ? "PRIVATE" : "PUBLIC"),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveWishlists()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
      setTitle("")
      setWprivate(false)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error creating new wishlist")
    }).finally(() => {
    })
}

  const handlePrivateChange = (event: React.ChangeEvent<{ value: any }>) => {
    setWprivate(!wprivate);
  }

  const handleTitleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setTitle(event.target.value);
  }

  const handleNewWishlistCreate = () => {
    if(title.length > 0){
      createNewWishlist()
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  return(
    <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <br/>
        <h2>
          &nbsp;Create a New List
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="text"
            placeholder="New Wishlist Title"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={title}
            onChange={handleTitleChange}
          />
          <div className={textStyles['container3']}>
            <input type="checkbox" checked={wprivate} className={`${textStyles['switch-checkbox-modal']} `} id="switch2" onChange={handlePrivateChange}/>
            <label htmlFor="switch2" className={`${textStyles['switch-label-modal']} `}>a</label>
            <p className={`${textStyles['text09']} `}>Make this wishlist private</p>
          </div>
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleNewWishlistCreate}
          >
            <span>
              <span>CREATE LIST</span>
              <br></br>
            </span>
          </button>
          <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Title must be filled!</div>
          <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully made changes your wishlists!</div>
      </div>
    }/>
  )
}

export function UpdateWishlistModal(props: {show: boolean, setShow: any, id: string, oldtitle: string, oldisprivate: boolean, retrieveWishlists: any}){
  const {show, setShow, id, oldtitle, oldisprivate, retrieveWishlists} = props;

  const [title, setTitle] = React.useState<string>(oldtitle);
  const [ wprivate, setWprivate ] = React.useState<boolean>(oldisprivate);
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const updateWishlist = (id: string) => {
    axios.post(GRAPHQL_API, {
      query: UPDATEWISHLIST_QUERY(id as string, title as string, wprivate ? "PRIVATE" : "PUBLIC"),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveWishlists()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error updating wishlist")
    }).finally(() => {
    })
  }

  const handlePrivateChange = (event: React.ChangeEvent<{ value: any }>) => {
    setWprivate(!wprivate);
  }

  const handleTitleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setTitle(event.target.value);
  }

  const handleWishlistUpdate = () => {
    if(title.length > 0){
      updateWishlist(id)
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  return(
    <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <br/>
        <h2>
          &nbsp;Update List Information
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="text"
            placeholder="Wishlist Title"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={title}
            onChange={handleTitleChange}
          />
          <div className={textStyles['container3']}>
            <input type="checkbox" checked={wprivate} className={`${textStyles['switch-checkbox-modal']} `} id="switch3" onChange={handlePrivateChange}/>
            <label htmlFor="switch3" className={`${textStyles['switch-label-modal']} `}>a</label>
            <p className={`${textStyles['text09']} `}>Make this wishlist private</p>
          </div>
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleWishlistUpdate}
          >
            <span>
              <span>SAVE CHANGES</span>
              <br></br>
            </span>
          </button>
          <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Title must be filled!</div>
          <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully made changes your wishlists!</div>
      </div>
    }/>
  )
}

export function AddToWishlistModal(props: {show: boolean, setShow: any, product: Product, wishlists: Wishlist[]}){
  const {show, setShow, wishlists, product} = props;

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);
  const [ checkeds, setCheckeds ] = React.useState<number[]>([]);

  const addToWishlist = (wishlistId: string) => {
    axios.post(GRAPHQL_API, {
      query: ADDTOWISHLIST_QUERY(wishlistId, product.id),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      setShowSuccess(true)
      setShow(false)
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error creating new wishlist")
    }).finally(() => {
    })
}

  const handleAddToWishlists = () => {
    if(checkeds.length > 0){
      checkeds.forEach(function(e){
        addToWishlist(wishlists[e].id)
      })
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  const handleCheckChange = (wishlist: Wishlist) => {
    var idx = wishlists.indexOf(wishlist);
    if(checkeds.includes(idx)){
      checkeds.splice(checkeds.indexOf(idx), 1);
    }else{
      setCheckeds(checkeds.concat(idx))
    }
  }

  return(
    <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <br/>
        <h2>
          &nbsp;Choose the lists to add to
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
          <div className={`${styles['checkbox-container']}`}>
          {wishlists.map(e =>
            <div className={`${styles['checkbox-wishlist-div']}`}>
            <input className={`${styles['checkbox-wishlist']}`} id={e.id} key={e.id} type={'checkbox'} onChange={ev => handleCheckChange(e)} name={e.id} value={e.id}/>{e.title}
            </div>
            )}
          </div>
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleAddToWishlists}
          >
            <span>
              <span>ADD TO WISHLISTS</span>
              <br></br>
            </span>
          </button>
          <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Must choose at least one wishlist!</div>
          <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully added the product your wishlists!</div>
      </div>
    }/>
  )
}

export function NewCommentModal(props: {show: boolean, setShow: any, wishlistId: string, retrieveComments: any}){
  const {show, setShow, wishlistId, retrieveComments} = props;

  const [content, setContent] = React.useState<string>("");
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const createNewComment = () => {
    axios.post(GRAPHQL_API, {
      query: CREATEWISHLISTCOMMENT_QUERY(wishlistId, content as string),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
      setContent("")
      setShow(false)
      retrieveComments()
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error creating new comment")
    })
  }

  const handleContentChange = (event: React.ChangeEvent<{ value: string }>) => {
    setContent(event.target.value);
  }

  const handleNewCommentCreate = () => {
    if(content.length > 0){
      createNewComment()
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  return(
    <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <br/>
        <h2>
          &nbsp;Add a Comment
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <textarea
            placeholder="Write your comment"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={content}
            onChange={handleContentChange}
          />

          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleNewCommentCreate}
          >
            <span>
              <span>ADD COMMENT</span>
              <br></br>
            </span>
          </button>
          <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Comment cannot be empty!</div>
          <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully added comment!</div>
      </div>
    }/>
  )
}
