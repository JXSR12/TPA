import styles from '@/styles/Modal.module.css';
import textStyles from '@/styles/Login.module.css';
import utilStyles from '@/styles/Utils.module.css';
import actionStyles from '@/styles/Profile.module.scss';
import emailjs from '@emailjs/browser';
import React from 'react';
import { FaDivide, FaTrash } from 'react-icons/fa';
import { Address } from '@/interfaces/address';
import axios from 'axios';
import { ADDTOWISHLIST_QUERY, BRANDS_QUERY, CATEGORIES_QUERY, CREATEBANNER_QUERY, CREATEPRODUCTIMAGES_QUERY, CREATEPRODUCT_QUERY, CREATESHOPADMIN_QUERY, CREATEVOUCHER_QUERY, CREATEWISHLISTCOMMENT_QUERY, CREATEWISHLIST_QUERY, DELETEADDRESS_QUERY, DELETEWISHLIST_QUERY, GETUSER_QUERY, GRAPHQL_API, NEWADDRESS_QUERY, NOSHOPUSERS_QUERY, REDEEMVOUCHER_QUERY, UPDATEPRODUCT_QUERY, UPDATEREVIEW_QUERY, UPDATESHOP_QUERY, UPDATEWISHLIST_QUERY } from '@/utils/constants';
import { useSessionStorage } from 'usehooks-ts';
import { CreditVoucher } from '@/interfaces/voucher';
import { Wishlist } from '@/interfaces/wishlist';
import { Category, Product, ProductBrand, ProductImage } from '@/interfaces/product';
import { Shop } from '@/interfaces/shop';
import { ProductReview } from '@/interfaces/review';
import { User } from '@/interfaces/user';

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

  React.useEffect(() => {
    setTitle(oldtitle);
    setWprivate(oldisprivate);
  }, [])

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

export function UpdateShopModal(props: {show: boolean, setShow: any, shop: Shop, retrieveShop: any}){
  const {show, setShow, shop, retrieveShop} = props;

  const [name, setName] = React.useState<string>(shop.name);
  const [pic, setPic] = React.useState<string>(shop.profilePic);
  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const updateShop = () => {
    axios.post(GRAPHQL_API, {
      query: UPDATESHOP_QUERY(name, pic, shop.address, shop.banner, shop.description),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveShop()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error updating shop")
    }).finally(() => {
    })
  }
  const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
    setName(event.target.value);
  }

  const handlePicChange = (event: React.ChangeEvent<{ value: string }>) => {
    setPic(event.target.value);
  }

  const handleShopUpdate = () => {
    if(name.length > 0 && pic.length > 0){
      updateShop()
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  React.useEffect(() => {
    setName(shop.name);
    setPic(shop.profilePic);
  }, [])

  return(
    <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <br/>
        <h2>
          &nbsp;Update Shop Information
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="text"
            placeholder="Shop Name"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={name}
            onChange={handleNameChange}
          />
          <input
            type="text"
            placeholder="Shop Profile Picture URL"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={pic}
            onChange={handlePicChange}
          />
          <center>
            <img height={124} width={125} src={pic} title={"New picture"} alt={"Profile picture"}/>
          </center>
          <br/>
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleShopUpdate}
          >
            <span>
              <span>SAVE CHANGES</span>
              <br></br>
            </span>
          </button>
          <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Name and profile picture must be filled!</div>
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

export function UpdateProductModal(props: {show: boolean, setShow: any, product: Product, retrieveProducts: any}){
  const {show, setShow, product, retrieveProducts} = props;

  const [name, setName] = React.useState<string>(product.name);
  const [desc, setDesc] = React.useState<string>(product.description);
  const [price, setPrice] = React.useState<number>(product.price);
  const [stock, setStock] = React.useState<number>(product.stock);
  const [catId, setCatId] = React.useState<string>(product.category?.id);
  const [images, setImages] = React.useState<ProductImage[]>(product.images);

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [categories, setCategories] = React.useState<Category[]>([]);

  const updateProduct = () => {
    axios.post(GRAPHQL_API, {
      query: UPDATEPRODUCT_QUERY(product.id, name, desc, price, product.discount, stock, catId, product.brandId),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveProducts()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error updating shop")
    })
  }

  const retrieveCategories = () => {
    axios.post(GRAPHQL_API, {
      query: CATEGORIES_QUERY,
    }
    ).then(res => {
      setCategories(res.data.data.categories)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error retrieving categories")
    })
  }

  React.useEffect(() => {
    setName(product.name)
    setDesc(product.description)
    setPrice(product.price)
    setStock(product.stock)
    setCatId(product.category?.id)
    setImages(product.images)
  }, [product])

  const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
    setName(event.target.value);
  }

  const handleDescChange = (event: React.ChangeEvent<{ value: string }>) => {
    setDesc(event.target.value);
  }

  const handlePriceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPrice(event.target.value as number);
  }

  const handleStockChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStock(event.target.value as number);
  }

  const handleCatIdChange = (event: React.ChangeEvent<{ value: string }>) => {
    setCatId(event.target.value);
  }

  const handleProductUpdate = () => {
    if(name.length > 0 && desc.length > 0 && price > 0 && stock >= 0 && catId.length > 0){
      updateProduct()
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  React.useEffect(() => {
    retrieveCategories()
  }, [])

  return(
    <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <br/>
        <h2>
          &nbsp;Update Product Information
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="text"
            placeholder="Product Name"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={name}
            onChange={handleNameChange}
          />
          <textarea
            placeholder="Product Description"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            onChange={handleDescChange}
            value={desc}
          ></textarea>
          <input
            type="number"
            placeholder="Product Price ($)"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={price}
            onChange={handlePriceChange}
          />
          <input
            type="number"
            placeholder="Product Stock"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={stock}
            onChange={handleStockChange}
          />
          <select name="select-content" className={`${actionStyles['select-content']} ${styles['w-20']}`} onChange={handleCatIdChange} value={catId}>
            {categories.map(c => <option value={c.id} selected>{c.name}</option>)}
          </select>
          <br/>
          <h4>Product Images</h4>
          <center>
            {images?.map(e => <span><img height={124} width={125} src={e.image} title={"image"} alt={"product image"}/>&nbsp;</span>)}
          </center>
          <br/>
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleProductUpdate}
          >
            <span>
              <span>SAVE CHANGES</span>
              <br></br>
            </span>
          </button>
          <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Name and profile picture must be filled!</div>
          <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully made changes your wishlists!</div>
      </div>
    }/>
  )
}

export function CreateProductModal(props: {show: boolean, setShow: any, retrieveProducts: any}){
  const {show, setShow, retrieveProducts} = props;

  const [name, setName] = React.useState<string>("");
  const [desc, setDesc] = React.useState<string>("");
  const [price, setPrice] = React.useState<number>(1);
  const [stock, setStock] = React.useState<number>(0);
  const [discount, setDiscount] = React.useState<number>(0);
  const [catId, setCatId] = React.useState<string>("NULL");
  const [brandId, setBrandId] = React.useState<string>("NULL");
  const [newImage, setNewImage] = React.useState<string>("");
  const [images, setImages] = React.useState<string[]>([]);

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [brands, setBrands] = React.useState<ProductBrand[]>([]);

  const createProduct = () => {
    axios.post(GRAPHQL_API, {
      query: CREATEPRODUCT_QUERY(name, desc, price, discount, stock, catId, brandId),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data.data.createProductAuto)
      createImages(res.data.data.createProductAuto.id)
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error creating product")
    })
  }

  const createImages = (productID: string) => {
    axios.post(GRAPHQL_API, {
      query: CREATEPRODUCTIMAGES_QUERY(productID, images),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveProducts()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
      setShow(false)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error creating product images")
    })
  }

  const retrieveCategories = () => {
    axios.post(GRAPHQL_API, {
      query: CATEGORIES_QUERY,
    }
    ).then(res => {
      setCategories(res.data.data.categories)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error retrieving categories")
    })
  }

  const retrieveBrands = () => {
    axios.post(GRAPHQL_API, {
      query: BRANDS_QUERY,
    }
    ).then(res => {
      setBrands(res.data.data.brands)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error retrieving brands")
    })
  }

  const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
    setName(event.target.value);
  }

  const handleDescChange = (event: React.ChangeEvent<{ value: string }>) => {
    setDesc(event.target.value);
  }

  const handlePriceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPrice(event.target.value as number);
  }

  const handleStockChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStock(event.target.value as number);
  }

  const handleDiscChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDiscount(event.target.value as number);
  }

  const handleNewImageChange = (event: React.ChangeEvent<{ value: string }>) => {
    setNewImage(event.target.value);
  }

  const handleCatIdChange = (event: React.ChangeEvent<{ value: string }>) => {
    setCatId(event.target.value);
  }

  const handleBrandIdChange = (event: React.ChangeEvent<{ value: string }>) => {
    setBrandId(event.target.value);
  }

  const handleAddNewImage = () => {
    if(newImage.length > 0){
      setImages(images.concat(newImage))
      setNewImage("")
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  const handleProductCreate = () => {
    if(name.length > 0 && desc.length > 0 && price > 0 && stock >= 0 && catId.length > 0 && brandId.length > 0 && discount >= 0 && images.length > 0){
      createProduct()
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  React.useEffect(() => {
    retrieveCategories()
    retrieveBrands()
  }, [])

  return(
    <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <br/>
        <h2>
          &nbsp;Create New Product
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="text"
            placeholder="Product Name"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={name}
            onChange={handleNameChange}
          />
          <textarea
            placeholder="Product Description"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            onChange={handleDescChange}
            value={desc}
          ></textarea>
          <input
            type="number"
            placeholder="Product Price ($)"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={price}
            onChange={handlePriceChange}
          />
          <input
            type="number"
            placeholder="Product Stock"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={stock}
            onChange={handleStockChange}
          />
          <input
            type="number"
            placeholder="Product Discount (%)"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={discount}
            min={0}
            max={99}
            onChange={handleDiscChange}
          />
          <select name="select-content" className={`${actionStyles['select-content']} ${styles['w-20']}`} onChange={handleCatIdChange} value={catId}>
            <option value="NULL" selected>Select a category</option>
            {categories.map(c => <option value={c.id} selected>{c.name}</option>)}
          </select>
          <br/>
          <select name="select-content-2" className={`${actionStyles['select-content']} ${styles['w-20']}`} onChange={handleBrandIdChange} value={brandId}>
            <option value="NULL" selected>Select a brand</option>
            {brands.map(c => <option value={c.id} selected>{c.name}</option>)}
          </select>
          <br/>

          <h4>Product Images</h4>
          <center>
            {images?.map(e => <span><img height={124} width={125} src={e} title={"image"} alt={"product image"}/>&nbsp;</span>)}
          </center>
          <input
            type="text"
            placeholder="Input new product image URL here"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={newImage}
            onChange={handleNewImageChange}
          />
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleAddNewImage}
          >
            Add Image
          </button>
          <hr/>
          <br/>
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleProductCreate}
          >
            <span>
              <span>CREATE PRODUCT</span>
              <br></br>
            </span>
          </button>
          <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>All product details must be filled and must have at least one image!</div>
          <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully created new product!</div>
      </div>
    }/>
  )
}

export function ReviewDetailModal(props: {show: boolean, setShow: any, review: ProductReview, retrieveReviews: any}){
  const {show, setShow, review, retrieveReviews} = props;

  const [ rating, setRating] = React.useState<number>(review.rating);
  const [ description, setDescription] = React.useState<string>(review.description);
  const [ onTime, setOnTime ] = React.useState<boolean>(review.onTimeDelivery);
  const [ accuracy, setAccuracy ] = React.useState<boolean>(review.productAccuracy);
  const [ satisfaction, setSatisfaction ] = React.useState<boolean>(review.serviceSatisfaction);

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [ user, setUser ] = React.useState<User>({} as User);

  const updateReview = () => {
    axios.post(GRAPHQL_API, {
      query: UPDATEREVIEW_QUERY(review.id, rating, description, onTime, accuracy, satisfaction),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      retrieveReviews()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error updating review")
    }).finally(() => {
    })
  }

  const handleOnTimeChange = (event: React.ChangeEvent<{ value: any }>) => {
    setOnTime(!onTime);
  }

  const handleAccuChange = (event: React.ChangeEvent<{ value: any }>) => {
    setAccuracy(!onTime);
  }

  const handleSatisChange = (event: React.ChangeEvent<{ value: any }>) => {
    setSatisfaction(!onTime);
  }

  const handleDescChange = (event: React.ChangeEvent<{ value: string }>) => {
    setDescription(event.target.value);
  }

  const handleRatingChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRating(event.target.value as number);
  }

  const handleReviewUpdate = () => {
    if(description.length > 0){
      updateReview()
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
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
      setUser(res.data.data.getUser)
    }).catch(err => {
      console.log(err)
    })
  }

  React.useEffect(() => {
    setRating(review.rating);
    setDescription(review.description);
    setOnTime(review.onTimeDelivery);
    setAccuracy(review.productAccuracy);
    setSatisfaction(review.serviceSatisfaction);
  }, [review])

  return(
    <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <br/>
        <h2>
          &nbsp;Review Details
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="number"
            min={1}
            max={5}
            step={0.5}
            readOnly={user?.id !== review?.user?.id}
            placeholder="Rate the order"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={rating}
            onChange={handleRatingChange}
          />
        <textarea
            placeholder="Write your comment"
            required
            readOnly={user?.id !== review?.user?.id}
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={description}
            onChange={handleDescChange}
          />
          <div className={textStyles['container3']}>
            <input type="checkbox" checked={onTime} disabled={user?.id !== review?.user?.id} className={`${textStyles['switch-checkbox-modal']} `} id="switch3" onChange={handleOnTimeChange}/>
            <label htmlFor="switch3" className={`${textStyles['switch-label-modal']} `}>a</label>
            <p className={`${textStyles['text09']} `}>Product delivery is on-time</p>
          </div>
          <div className={textStyles['container3']}>
            <input type="checkbox" checked={accuracy} disabled={user?.id !== review?.user?.id} className={`${textStyles['switch-checkbox-modal']} `} id="switch4" onChange={handleAccuChange}/>
            <label htmlFor="switch4" className={`${textStyles['switch-label-modal']} `}>a</label>
            <p className={`${textStyles['text09']} `}>Product is accurate</p>
          </div>
          <div className={textStyles['container3']}>
            <input type="checkbox" checked={satisfaction} disabled={user?.id !== review?.user?.id} className={`${textStyles['switch-checkbox-modal']} `} id="switch5" onChange={handleSatisChange}/>
            <label htmlFor="switch5" className={`${textStyles['switch-label-modal']} `}>a</label>
            <p className={`${textStyles['text09']} `}>I am satisfied with the service</p>
          </div>
          {user?.id === review?.user?.id &&
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleReviewUpdate}
          >
            <span>
              <span>SAVE CHANGES</span>
              <br></br>
            </span>
          </button>
          }
          <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Comment and rating must be filled!</div>
          <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully made changes your review!</div>
      </div>
    }/>
  )
}

export function CreateNewVoucherModal(props: {show: boolean, setShow: any, retrieveVouchers: any}){
  const {show, setShow, retrieveVouchers} = props;

  const [ code, setCode] = React.useState<string>("");
  const [ value, setValue] = React.useState<number>(0);

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const createVoucher = () => {
    if(code.length > 0 && value > 0){
      axios.post(GRAPHQL_API, {
        query: CREATEVOUCHER_QUERY(code, value),
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        if(res.data.data.createVoucher && res.data.data.createVoucher.id){
          setCode("")
          setValue(0)
          setShowSuccess(true)
          setTimeout(() => {
            setShowSuccess(false)
          }, 2000)
          setShow(false)
          retrieveVouchers()
        }else{
          setShowError(true)
          setTimeout(() => {setShowError(false)}, 2000)
        }
      }).catch(err => {
        setShowError(true)
        setTimeout(() => {setShowError(false)}, 2000)
        console.log("Error creating voucher")
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

  const handleValueChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as number);
  }

  return(
    <div>
      <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <h2>
          &nbsp;Create New OldEgg Credits Voucher
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="text"
            placeholder="Input new voucher code"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={code}
            onChange={handleCodeChange}
          />
          <input
            type="number"
            placeholder="Input new voucher value ($)"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={value}
            onChange={handleValueChange}
          />
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={createVoucher}
          >
            <span>
              <span>CREATE NEW VOUCHER</span>
              <br></br>
            </span>
          </button>
      </div>
    }/>
      <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Voucher code must be filled and value must be more than 0!</div>
      <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully created a new voucher with code "{code}"!</div>
    </div>
  )
}

export function CreateNewPromotionModal(props: {show: boolean, setShow: any, retrievePromotions: any}){
  const {show, setShow, retrievePromotions} = props;

  const [ title, setTitle] = React.useState<string>("");
  const [ link, setLink] = React.useState<string>("");
  const [ image, setImage] = React.useState<string>("");

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const createPromotion = () => {
    if(title.length > 0 && link.length > 0 && image.length > 0){
      axios.post(GRAPHQL_API, {
        query: CREATEBANNER_QUERY(title, link, image),
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        if(res.data.data.createPromotionBanner){
          setTitle("")
          setLink("")
          setImage("")
          setShowSuccess(true)
          setTimeout(() => {
            setShowSuccess(false)
          }, 2000)
          setShow(false)
          retrievePromotions()
        }else{
          setShowError(true)
          setTimeout(() => {setShowError(false)}, 2000)
        }
      }).catch(err => {
        setShowError(true)
        setTimeout(() => {setShowError(false)}, 2000)
        console.log("Error creating banner")
      }).finally(() => {
      })
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  const handleTitleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setTitle(event.target.value);
  }

  const handleLinkChange = (event: React.ChangeEvent<{ value: string }>) => {
    setLink(event.target.value);
  }

  const handleImageChange = (event: React.ChangeEvent<{ value: string }>) => {
    setImage(event.target.value);
  }

  return(
    <div>
      <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <h2>
          &nbsp;Create New Promotional Banner
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="text"
            placeholder="Input promotion title"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={title}
            onChange={handleTitleChange}
          />
          <input
            type="text"
            placeholder="Input promotion link"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={link}
            onChange={handleLinkChange}
          />
          <input
            type="text"
            placeholder="Input promotion banner URL"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={image}
            onChange={handleImageChange}
          />
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={createPromotion}
          >
            <span>
              <span>CREATE NEW PROMOTION BANNER</span>
              <br></br>
            </span>
          </button>
      </div>
    }/>
      <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Promotion title, link, and image must be filled!</div>
      <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully created a new promotion!</div>
    </div>
  )
}

export function CreateShopModal(props: {show: boolean, setShow: any, retrieveShops: any}){
  const {show, setShow, retrieveShops} = props;

  const [name, setName] = React.useState<string>("");
  const [desc, setDesc] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [userId, setUserId] = React.useState<string>("NULL");

  const [ jwtToken, setJwtToken ] = useSessionStorage('jwtToken', 'NULL');
  const [ showError, setShowError ] = React.useState<boolean>(false);
  const [ showSuccess, setShowSuccess ] = React.useState<boolean>(false);

  const [users, setUsers] = React.useState<User[]>([]);

  const registerShop = () => {
    axios.post(GRAPHQL_API, {
      query: CREATESHOPADMIN_QUERY(name, desc, address, userId),
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data.data.createShopAdmin)
      sendEmail(res.data.data.createShopAdmin.id, users.filter((u) => {return u.id == userId})[0])
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error creating shop")
    })
  }

  const sendEmail = (shopId: string, user: User) => {
    var templateParams = {
      destination_email: user.email,
      shop_id: shopId,
      user_name: user.name,
    };
    console.log("Sending email to " + templateParams.destination_email);
    console.log("Shop ID: " + templateParams.shop_id);
    console.log("User Name: " + templateParams.user_name);
    emailjs.send('jn_oldegg_mailing', 'template_newshop_ojn', templateParams, "eNnoQIH00U2byF10T").then(res => {
      retrieveShops()
      retrieveUsers()
      setShowSuccess(true)
      setTimeout(() => {setShowSuccess(false)}, 2000)
      setName("")
      setDesc("")
      setAddress("")
      setUserId("NULL")
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error while sending email notification")
    }).finally(() => {
    })
}

  const retrieveUsers = () => {
    axios.post(GRAPHQL_API, {
      query: NOSHOPUSERS_QUERY,
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(res.data)
      setUsers(res.data.data.noShopUsers)
    }).catch(err => {
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
      console.log("Error retrieving users")
    })
  }

  const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
    setName(event.target.value);
  }

  const handleDescChange = (event: React.ChangeEvent<{ value: string }>) => {
    setDesc(event.target.value);
  }

  const handleAddressChange = (event: React.ChangeEvent<{ value: string }>) => {
    setAddress(event.target.value);
  }

  const handleUserIdChange = (event: React.ChangeEvent<{ value: string }>) => {
    setUserId(event.target.value);
  }

  const handleProductCreate = () => {
    if(name.length > 0 && desc.length > 0 && userId !== "NULL" && address.length > 0){
      registerShop()
    }else{
      setShowError(true)
      setTimeout(() => {setShowError(false)}, 2000)
    }
  }

  React.useEffect(() => {
    retrieveShops()
    retrieveUsers()
  }, [])

  return(
    <Modal show={show} setShow={setShow} content={
      <div>
        <br/>
        <br/>
        <h2>
          &nbsp;Register New Shop
        </h2>
        <hr className={`${styles['modal-div']} `}/>
        <br/>
        <input
            type="text"
            placeholder="Shop Name"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            value={name}
            onChange={handleNameChange}
          />
          <textarea
            placeholder="Shop Description"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            onChange={handleDescChange}
            value={desc}
          ></textarea>
          <textarea
            placeholder="Shop Address"
            required
            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
            onChange={handleAddressChange}
            value={address}
          ></textarea>
          <select name="select-content" className={`${actionStyles['select-content']} ${styles['w-20']}`} onChange={handleUserIdChange} value={userId}>
            <option value="NULL" selected>Select associated user</option>
            {users?.map(c => <option value={c.id} selected>{c.name}</option>)}
          </select>
          <br/>
          <hr/>
          <br/>
          <button
            className={` ${textStyles['button-modal']} ${textStyles['btntrans']} `}
            onClick={handleProductCreate}
          >
            <span>
              <span>REGISTER NEW SHOP</span>
              <br></br>
            </span>
          </button>
          <div id={utilStyles['error-snackbar']} className={showError ? utilStyles['show'] : ''}>Shop name, address, description, and associated user cannot be empty!</div>
          <div id={utilStyles['success-snackbar']} className={showSuccess ? utilStyles['show'] : ''}>Successfully registered new shop!</div>
      </div>
    }/>
  )
}
