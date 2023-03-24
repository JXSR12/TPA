import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Profile.module.scss'
import listStyles from '@/styles/Modal.module.css';
import utilStyles from '@/styles/Utils.module.css';
import textStyles from '@/styles/Login.module.css';
import Link from 'next/link';
import axios from 'axios';
import { ALLSHOPS_QUERY, ALLSUPPORTCHATS_QUERY, BANNERS_QUERY, CREATECSREVIEW_QUERY, CREATENEWCSCHAT_QUERY, CREATEWISHLIST_QUERY, CUSTOMERCHATS_QUERY, DELETEWISHLIST_QUERY, DUPLICATEWISHLISTITEMS_QUERY, FOLLOWEDWISHLISTSID_QUERY, FOLLOWEDWISHLISTS_QUERY, FOLLOWWISHLIST_QUERY, GETLASTTRANSID_QUERY, GETUSER_QUERY, GRAPHQL_API, MARKRESOLVED_QUERY, ONGOINGSUPPORTCHAT_QUERY, PROTECTED_QUERY, PUBLICWISHLISTS_QUERY, SELLERCHATS_QUERY, SENDSUPPORTMESSAGE_QUERY, SENDUSERMESSAGE_QUERY, SUBSCRIBEDEMAILS_QUERY, SUPPORTCHATREVIEWS_QUERY, TAGTOPICS_QUERY, UPDATEPASSWORD_QUERY, UPDATEPROFILE_QUERY, USERNOTIFICATIONS_QUERY, USERS_QUERY, USERWISHLISTS_QUERY, VOUCHERS_QUERY } from '@/utils/constants';
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
import AllUsers from '@/components/allusers';
import AllBanners from '@/components/allbanners';
import AllVouchers from '@/components/allvouchers';
import { PromotionBanner } from '@/interfaces/promotion';
import { CreditVoucher } from '@/interfaces/voucher';
import AllShops from '@/components/allshops';
import { Shop } from '@/interfaces/shop';
import SendNewsletter from '@/components/sendnewsletter';
import AdminCharts from '@/components/admincharts';
import { SupportChatReview } from '@/interfaces/review';
import AllCSReviews from '@/components/csreviews';
import { SupportChat, SupportMessage, UserChat, UserMessage } from '@/interfaces/chat';


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
  const [ role, setRole] = React.useState<string>("");
  const [ userId, setUserId] = React.useState<string>("");

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
      setRole(res.data.data.getUser.role)
      setUserId(res.data.data.getUser.id)
      setMessageType(res.data.data.getUser.role == "ADMIN" ? "all support chats" : "customer service")
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

  React.useEffect(() => {
    retrieveUsers()
    retrieveBanners()
    retrieveVouchers()
    retrieveShops()
    retrieveEmails()
    retrieveCSReviews()
  }, [])

  const [ users, setUsers ] = React.useState<User[]>([])
  const [ banners, setBanners ] = React.useState<PromotionBanner[]>([])
  const [ vouchers, setVouchers ] = React.useState<CreditVoucher[]>([])
  const [ shops, setShops ] = React.useState<Shop[]>([])
  const [ emails, setEmails ] = React.useState<string[]>([])
  const [ CSReviews, setCSReviews ] = React.useState<SupportChatReview[]>([])

  const retrieveUsers = () => {
    axios.post(GRAPHQL_API, {
      query: USERS_QUERY
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setUsers(res.data.data.users)
    }).catch(err => {
      console.log("Error retrieving users")
    })
  }

  const retrieveBanners = () => {
    axios.post(GRAPHQL_API, {
      query: BANNERS_QUERY
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setBanners(res.data.data.promotionBanners)
    }).catch(err => {
      console.log("Error retrieving promotion banners")
    })
  }


  const retrieveVouchers = () => {
    axios.post(GRAPHQL_API, {
      query: VOUCHERS_QUERY
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setVouchers(res.data.data.vouchers)
    }).catch(err => {
      console.log("Error retrieving vouchers")
    })
  }

  const retrieveShops = () => {
    axios.post(GRAPHQL_API, {
      query: ALLSHOPS_QUERY
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setShops(res.data.data.shops)
    }).catch(err => {
      console.log("Error retrieving shops")
    })
  }

  const retrieveEmails = () => {
    axios.post(GRAPHQL_API, {
      query: SUBSCRIBEDEMAILS_QUERY
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setEmails(res.data.data.currentSubscribedEmails)
    }).catch(err => {
      console.log("Error retrieving emails")
    })
  }

  const retrieveCSReviews = () => {
    axios.post(GRAPHQL_API, {
      query: SUPPORTCHATREVIEWS_QUERY
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setCSReviews(res.data.data.supportChatReviews)
    }).catch(err => {
      console.log("Error retrieving CS reviews")
    })
  }

  const [ ongoingSupportChat, setOngoingSupportChat ] = React.useState<SupportChat>({} as SupportChat);
  const [ supportChats, setSupportChats] = React.useState<SupportChat[]>([]);
  const [ sellerChats, setSellerChats] = React.useState<UserChat[]>([]);
  const [ customerChats, setCustomerChats] = React.useState<UserChat[]>([]);

  const [ FsellerChats, setFSellerChats] = React.useState<UserChat[]>([]);
  const [ FcustomerChats, setFCustomerChats] = React.useState<UserChat[]>([]);

  const [ selectedSellerChat, setSelectedSellerChat ] = React.useState<UserChat>(sellerChats[0] ? sellerChats[0] : {} as UserChat);
  const [ selectedCustomerChat, setSelectedCustomerChat ] = React.useState<UserChat>(customerChats[0] ? customerChats[0] : {} as UserChat);
  const [ selectedSupportChat, setSelectedSupportChat ] = React.useState<SupportChat>(supportChats[0] ? supportChats[0] : {} as SupportChat);

  const [ attachment, setAttachment ] = React.useState<string>("");
  const [ attachmentType, setAttachmentType ] = React.useState<string>("none");

  const [ messageType, setMessageType ] = React.useState<string>("");
  // const { messages, sendMessage } = useChat(roomId);
  const [newMessage, setNewMessage] = React.useState<string>("");

  const [ displayInputField, setDisplayInputField ] = React.useState<boolean>(true);

  const [ chatTopic, setChatTopic ] = React.useState<string>("");

  const [ csMessages, setCsMessages ] = React.useState<ChatMessage[]>([]);

  const handleSelectSupportChat = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedSupportChat(supportChats.filter((e) => {return e.id == event.target.value})[0]);
    if(messageType == "all support chats" && supportChats.filter((e) => {return e.id == event.target.value})[0] && !supportChats.filter((e) => {return e.id == event.target.value})[0].isResolved){
      setDisplayInputField(true)
      setChatTopic(supportChats.filter((e) => {return e.id == event.target.value})[0].topicTags)
    }else if (messageType == "all support chats"){
      setDisplayInputField(false)
      setChatTopic("")
    }
  }

  const refreshSelectedSupportChat = () => {
    if(messageType == "all support chats" && selectedSupportChat.isResolved){
      setDisplayInputField(false)
      setChatTopic("")
    }
  }

  const handleSelectSellerChat = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedSellerChat(sellerChats.filter((e) => {return e.id == event.target.value})[0]);
    setDisplayInputField(true)
  }

  const handleSelectCustomerChat = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedCustomerChat(customerChats.filter((e) => {return e.id == event.target.value})[0]);
    setDisplayInputField(true)
  }

  const handleMessageTypeChange = (event: React.ChangeEvent<{ value: string }>) => {
    setMessageType(event.target.value);
  }

  const handleAttachmentTypeChange = (event: React.ChangeEvent<{ value: string }>) => {
    setAttachmentType(event.target.value);
  }

  const handleAttachmentChange = (event: React.ChangeEvent<{ value: string }>) => {
    setAttachment(event.target.value);
  }

  const handleNewMessageChange = (event: React.ChangeEvent<{ value: string }>) => {
    setNewMessage(event.target.value);
  };

  const handleChatTopicChange = (event: React.ChangeEvent<{ value: string }>) => {
    setChatTopic(event.target.value);
  };

  const handleSendMessage = () => {
    if(newMessage.length > 0){
      if(messageType == "customer service"){
        sendSupportMessageAsUser(newMessage, attachmentType == "file" ? attachment : "", attachmentType == "image" ? attachment : "")
        retrieveOngoingSupportChat()
      }
      if(messageType == "all support chats"){
        sendSupportMessageAsStaff(newMessage, attachmentType == "file" ? attachment : "", attachmentType == "image" ? attachment : "")
        retrieveAllSupportChats()
      }
      if(messageType == "seller messages"){
        sendUserMessageAsCustomer(newMessage, attachmentType == "file" ? attachment : "", attachmentType == "image" ? attachment : "")
        retrieveAllSellerChats()
      }
      if(messageType == "customer messages"){
        sendUserMessageAsSeller(newMessage, attachmentType == "file" ? attachment : "", attachmentType == "image" ? attachment : "")
        retrieveAllCustomerChats()
      }
      setNewMessage("");
      setAttachment("");
    }
  };

  const handleTagTopic = () => {
    if(chatTopic.length > 0){
      if(messageType == "all support chats"){
        tagSupportChatTopic(chatTopic);
      }
    }
  };

  const sendSupportMessageAsUser = (message: string, fileURL: string, imageURL: string) => {
    axios.post(GRAPHQL_API, {
      query: SENDSUPPORTMESSAGE_QUERY(false, ongoingSupportChat.id, message, fileURL, imageURL)
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
    }).catch(err => {
      console.log("Error while sending support message")
    })
  }

  const sendSupportMessageAsStaff = (message: string, fileURL: string, imageURL: string) => {
    axios.post(GRAPHQL_API, {
      query: SENDSUPPORTMESSAGE_QUERY(true, selectedSupportChat.id, message, fileURL, imageURL)
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
    }).catch(err => {
      console.log("Error while sending support message")
    })
  }

  const sendUserMessageAsCustomer = (message: string, fileURL: string, imageURL: string) => {
    axios.post(GRAPHQL_API, {
      query: SENDUSERMESSAGE_QUERY(false, selectedSellerChat.id, message, fileURL, imageURL)
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
    }).catch(err => {
      console.log("Error while sending user message")
    })
  }

  const sendUserMessageAsSeller = (message: string, fileURL: string, imageURL: string) => {
    axios.post(GRAPHQL_API, {
      query: SENDUSERMESSAGE_QUERY(true, selectedCustomerChat.id, message, fileURL, imageURL)
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
    }).catch(err => {
      console.log("Error while sending user (seller) message")
    })
  }

  const tagSupportChatTopic = (topic: string) => {
    axios.post(GRAPHQL_API, {
      query: TAGTOPICS_QUERY(selectedSupportChat.id, topic)
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      retrieveAllSupportChats()
    }).catch(err => {
      console.log("Error while tagging chat with topic")
    })
  }

  const markSupportChatResolved = () => {
    axios.post(GRAPHQL_API, {
      query: MARKRESOLVED_QUERY(selectedSupportChat.id)
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      retrieveAllSupportChats()
    }).catch(err => {
      console.log("Error while marking chat as resolved")
    })
  }

  const retrieveOngoingSupportChat = () => {
    axios.post(GRAPHQL_API, {
      query: ONGOINGSUPPORTCHAT_QUERY
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setOngoingSupportChat(res.data.data.supportChat)
      if(messageType == "customer service" && res.data.data.supportChat && !res.data.data.supportChat.isResolved){
        setDisplayInputField(true)
      }else if (messageType == "customer service"){
        setDisplayInputField(false)
      }
    }).catch(err => {
      console.log("Error retrieving current support chat")
    })
  }

  const retrieveAllSupportChats = () => {
    axios.post(GRAPHQL_API, {
      query: ALLSUPPORTCHATS_QUERY
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setSupportChats(res.data.data.supportChats)
      if(!selectedSupportChat){
        setSelectedSupportChat(res.data.data.supportChats.length > 0 ? res.data.data.supportChats[0] : {} as SupportChat)
        setChatTopic(res.data.data.supportChats.length > 0 ? res.data.data.supportChats[0].topicTags : "")
      }
    }).catch(err => {
      console.log("Error retrieving all support chats")
    })
  }

  React.useEffect(() => {
    if(selectedSupportChat && !selectedSupportChat.isResolved){
      setDisplayInputField(true)
    }
    refreshSelectedSupportChat()
  }, [selectedSupportChat])

  React.useEffect(() => {
    if(selectedSellerChat  && selectedSellerChat.customer  && selectedSellerChat.seller){
      setDisplayInputField(true)
      getLastTransId(selectedSellerChat.customer.id, selectedSellerChat.seller.id)
    }
  }, [selectedSellerChat])

  React.useEffect(() => {
    if(selectedCustomerChat && selectedCustomerChat.customer && selectedCustomerChat.seller){
      setDisplayInputField(true)
      getLastTransId(selectedCustomerChat.customer.id, selectedCustomerChat.seller.id)
    }
  }, [selectedCustomerChat])

  const retrieveAllSellerChats = () => {
    axios.post(GRAPHQL_API, {
      query: SELLERCHATS_QUERY
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setSellerChats(res.data.data.sellerChats)
      if(!selectedSellerChat){
        setSelectedSellerChat(res.data.data.sellerChats.length > 0 ? res.data.data.sellerChats[0] : {} as UserChat)
      }
      if(sellerChats.length > 0){
        setDisplayInputField(true)
      }
    }).catch(err => {
      console.log("Error retrieving all seller chats")
    })
  }

  const retrieveAllCustomerChats = () => {
    axios.post(GRAPHQL_API, {
      query: CUSTOMERCHATS_QUERY
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setCustomerChats(res.data.data.customerChats)
      if(!selectedCustomerChat){
        setSelectedCustomerChat(res.data.data.customerChats.length > 0 ? res.data.data.customerChats[0] : {} as UserChat)
      }
      if(customerChats.length > 0){
        setDisplayInputField(true)
      }
    }).catch(err => {
      console.log("Error retrieving all customer chats")
    })
  }

  const retrieveAllNotifications = () => {
    axios.post(GRAPHQL_API, {
      query: USERNOTIFICATIONS_QUERY
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setCustomerChats(res.data.data.userNotifications)
    }).catch(err => {
      console.log("Error retrieving all notifications")
    })
  }

  const [ curTransId, setCurTransId ] = React.useState<string>("ORDER ID NOT FOUND")

  const getLastTransId = (userId: string, shopId: string) => {
    axios.post(GRAPHQL_API, {
      query: GETLASTTRANSID_QUERY(userId, shopId)
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      setCurTransId(res.data.data.getLastTransId)
    }).catch(err => {
      console.log("Error retrieving order id")
    })
  }


  React.useEffect(() => {
    if(messageType == "customer service"){
      retrieveOngoingSupportChat()
    }else if(messageType == "all support chats"){
      retrieveAllSupportChats()
    }else if(messageType == "seller messages"){
      retrieveAllSellerChats()
      setDisplayInputField(true)
    }else if(messageType == "customer messages"){
      retrieveAllCustomerChats()
      setDisplayInputField(true)
    }else if(messageType == "notifications"){
      retrieveAllNotifications()
      setDisplayInputField(false)
    }

  }, [messageType])



  function revArr(e: any[]) : any[]{
    var a = e?.slice().reverse();
    return a;
  }

  const [ sellerChatsFilter, setSellerChatsFilter ] = React.useState<string>("all time");
  const [ customerChatsFilter, setCustomerChatsFilter ] = React.useState<string>("all time");

  const handleSellerChatsFilterChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSellerChatsFilter(event.target.value);
  }

  const handleCustomerChatsFilterChange = (event: React.ChangeEvent<{ value: string }>) => {
    setCustomerChatsFilter(event.target.value);
  }

  //Administration
  const [ adminType, setAdminType ] = React.useState<string>("users");

  const handleAdminTypeChange = (event: React.ChangeEvent<{ value: string }>) => {
    setAdminType(event.target.value);
  }

  React.useEffect(() => {

    if(sellerChatsFilter == "today"){
      setFSellerChats(sellerChats.filter((e) => {
        const today = new Date();
        const createdAtDate = new Date(e.createdAt);

        return (
          createdAtDate.getDate() === today.getDate() &&
          createdAtDate.getMonth() === today.getMonth() &&
          createdAtDate.getFullYear() === today.getFullYear()
        );
      }));
    }else if(sellerChatsFilter == "this month"){
      setFSellerChats(sellerChats.filter((e) => {
        const today = new Date();
        const createdAtDate = new Date(e.createdAt);

        return (
          createdAtDate.getMonth() === today.getMonth() &&
          createdAtDate.getFullYear() === today.getFullYear()
        );
      }))
    }else{
      setFSellerChats(sellerChats)
    }
  }, [sellerChatsFilter, sellerChats])

  React.useEffect(() => {
    if(customerChatsFilter == "today"){
      setFCustomerChats(customerChats.filter((e) => {
        const today = new Date();
        const createdAtDate = new Date(e.createdAt);

        return (
          createdAtDate.getDate() === today.getDate() &&
          createdAtDate.getMonth() === today.getMonth() &&
          createdAtDate.getFullYear() === today.getFullYear()
        );
      }));
    }else if(customerChatsFilter == "this month"){
      setFCustomerChats(customerChats.filter((e) => {
        const today = new Date();
        const createdAtDate = new Date(e.createdAt);

        return (
          createdAtDate.getMonth() === today.getMonth() &&
          createdAtDate.getFullYear() === today.getFullYear()
        );
      }))
    }else{
      setFCustomerChats(customerChats)
    }
  }, [customerChatsFilter, customerChats])

  const [ csReviewRating, setCsReviewRating ] = React.useState<number | undefined>();
  const [ csReviewDescription, setCsReviewDescription ] = React.useState<string>("");

  const handleCsReviewRatingChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCsReviewRating(event.target.value as number);
  };

  const handleCsReviewDescriptionChange = (event: React.ChangeEvent<{ value: string }>) => {
    setCsReviewDescription(event.target.value);
  };

  const sendCsReview = () => {
    if(csReviewRating && csReviewRating > 0 && csReviewRating <= 5 && csReviewDescription.length > 0){
      axios.post(GRAPHQL_API, {
        query: CREATECSREVIEW_QUERY(csReviewRating as number, csReviewDescription)
      },
      {
        headers: {
          Authorization: "Bearer " + jwtToken
        }
      }
      ).then(res => {
        console.log(jwtToken)
        console.log(res.data)
        setCsReviewDescription("")
        setCsReviewRating(undefined)
        createNewCSChat()
      }).catch(err => {
        console.log("Error while sending CS review")
      })
    }
  }

  const createNewCSChat = () => {
    axios.post(GRAPHQL_API, {
      query: CREATENEWCSCHAT_QUERY(userId)
    },
    {
      headers: {
        Authorization: "Bearer " + jwtToken
      }
    }
    ).then(res => {
      console.log(jwtToken)
      console.log(res.data)
      retrieveOngoingSupportChat()
    }).catch(err => {
      console.log("Error while creating new CS Chat")
    })
  }

  return (
    <>
      <Head>
        <title>Oldegg - Dashboard</title>
        <meta
          name="description"
          content="Oldegg dashboard page"
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
             {role == "ADMIN" &&
              <option value="Site Administration">Management Dashboard</option>
             }
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
                <div className={`${styles['lx-column']} ${styles['column-creds']}`}>
                  <select name="select-content" className={`${styles['select-content']}`} defaultValue={role == "ADMIN" ? "all support chats" : "customer service"} onChange={handleMessageTypeChange}>
                      {role != "ADMIN" && <option value="customer service">Customer Service</option>}
                      {role != "ADMIN" && <option value="seller messages">Seller Messages</option>}
                      {role != "ADMIN" && <option value="customer messages">Customer Messages (as Shop)</option>}
                      {role != "ADMIN" && <option value="notifications">Notifications</option>}
                      {role == "ADMIN" && <option value="all support chats">Ongoing Support Chats</option>}
                  </select>
                  <br/>
                  {messageType == "seller messages" &&
                  <select name="select-content" className={`${styles['select-content']}`} defaultValue={sellerChatsFilter} onChange={handleSellerChatsFilterChange}>
                          <option value="all time">All Time</option>
                          <option value="today">Today</option>
                          <option value="this month">This Month</option>
                  </select>
                  }

                  {messageType == "customer messages" &&
                  <select name="select-content" className={`${styles['select-content']}`} defaultValue={customerChatsFilter} onChange={handleCustomerChatsFilterChange}>
                          <option value="all time">All Time</option>
                          <option value="today">Today</option>
                          <option value="this month">This Month</option>
                  </select>
                  }

                  {messageType == "all support chats" &&
                  <select name="select-content" className={`${styles['select-content']}`} defaultValue={selectedSupportChat.id} onChange={handleSelectSupportChat}>
                     {supportChats.map(e => <option value={e.id}>{e.customer.name}</option>)}
                  </select>
                  }
                  {messageType == "seller messages" &&
                  <select name="select-content" className={`${styles['select-content']}`} defaultValue={selectedSellerChat.id} onChange={handleSelectSellerChat}>
                     {FsellerChats.map(e => <option value={e.id}>{e.seller.name}</option>)}
                  </select>
                  }
                  {messageType == "customer messages" &&
                  <select name="select-content" className={`${styles['select-content']}`} defaultValue={selectedCustomerChat.id} onChange={handleSelectCustomerChat}>
                     {FcustomerChats.map(e => <option value={e.id}>{e.customer.name}</option>)}
                  </select>
                  }

                  {messageType == "seller messages" && <p>Order ID: {curTransId}</p>}
                  {messageType == "customer messages" && <p>Order ID: {curTransId}</p>}
                  <br/>
                  <center>
                  <div className={`${styles['chat-box']} ${styles['bs-md']}`}>
                    <h1 className={`${styles['chat-title']}`}>{messageType}</h1>
                    <br/>
                    {messageType == "customer service" && ongoingSupportChat && !ongoingSupportChat?.isResolved &&
                    <div id="elemchat-cs" className={`${styles['cs-chat']}`}>
                      {revArr(ongoingSupportChat?.messages)?.map(c => c.isStaffMessage ?
                      <div className={`${styles['chat-set']} ${styles['cs-received']}`}>
                        <div>{new Date(c.createdAt).toLocaleString()}</div>
                        <div className={`${styles['receiver-name']}`}>OldEgg Customer Service</div>
                        <div className={`${styles['received-message']}`}>{c.text}</div>
                        <div className={`${styles['attachments']}`}>{c.imageURL.length > 0 ? <img src={c.imageURL}/> : c.fileURL.length > 0 ? <a target="_blank" href={c.fileURL} rel="noopener noreferrer"><button>Download File</button></a> : ""}</div>
                      </div> :
                      <div className={`${styles['chat-set']} ${styles['cs-sent']}`}>
                        <div>{new Date(c.createdAt).toLocaleString()}</div>
                          <div className={`${styles['sender-name']}`}>You</div>
                          <div className={`${styles['sent-message']}`}>{c.text}</div>
                          <div className={`${styles['attachments']}`}>{c.imageURL.length > 0 ? <img src={c.imageURL}/> : c.fileURL.length > 0 ? <a target="_blank" href={c.fileURL} rel="noopener noreferrer"><button>Download File</button></a> : ""}</div>
                        </div>)}
                    </div>
                    }

                    {messageType == "all support chats" && selectedSupportChat && !selectedSupportChat?.isResolved &&
                      <div id="elemchat-cs" className={`${styles['cs-chat']}`}>
                        {revArr(selectedSupportChat?.messages)?.map((c : SupportMessage) => c.isStaffMessage ?
                        <div className={`${styles['chat-set']} ${styles['cs-sent']}`}>
                          <div>{new Date(c.createdAt).toLocaleString()}</div>
                          <div className={`${styles['sender-name']}`}>You</div>
                          <div className={`${styles['sent-message']}`}>{c.text}</div>
                          <div className={`${styles['attachments']}`}>{c.imageURL.length > 0 ? <img src={c.imageURL}/> : c.fileURL.length > 0 ? <a target="_blank" href={c.fileURL} rel="noopener noreferrer"><button>Download File</button></a> : ""}</div>
                        </div> :
                        <div className={`${styles['chat-set']} ${styles['cs-received']}`}>
                          <div>{new Date(c.createdAt).toLocaleString()}</div>
                            <div className={`${styles['receiver-name']}`}>{selectedSupportChat.customer.name}</div>
                            <div className={`${styles['received-message']}`}>{c.text}</div>
                            <div className={`${styles['attachments']}`}>{c.imageURL.length > 0 ? <img src={c.imageURL}/> : c.fileURL.length > 0 ? <a target="_blank" href={c.fileURL} rel="noopener noreferrer"><button>Download File</button></a> : ""}</div>
                          </div>)}
                      </div>
                    }

                    {messageType == "seller messages" && selectedSellerChat &&
                      <div id="elemchat-cs" className={`${styles['cs-chat']}`}>
                        {revArr(selectedSellerChat?.messages)?.map((c : UserMessage) => !c.isSellerMessage ?
                        <div className={`${styles['chat-set']} ${styles['cs-sent']}`}>
                          <div>{new Date(c.createdAt).toLocaleString()}</div>
                          <div className={`${styles['sender-name']}`}>You</div>
                          <div className={`${styles['sent-message']}`}>{c.text}</div>
                          <div className={`${styles['attachments']}`}>{c.imageURL.length > 0 ? <img src={c.imageURL}/> : c.fileURL.length > 0 ? <a target="_blank" href={c.fileURL} rel="noopener noreferrer"><button>Download File</button></a> : ""}</div>
                        </div> :
                        <div className={`${styles['chat-set']} ${styles['cs-received']}`}>
                          <div>{new Date(c.createdAt).toLocaleString()}</div>
                            <div className={`${styles['receiver-name']}`}>{selectedSellerChat.seller.name}</div>
                            <div className={`${styles['received-message']}`}>{c.text}</div>
                            <div className={`${styles['attachments']}`}>{c.imageURL.length > 0 ? <img src={c.imageURL}/> : c.fileURL.length > 0 ? <a target="_blank" href={c.fileURL} rel="noopener noreferrer"><button>Download File</button></a> : ""}</div>
                          </div>)}
                      </div>
                    }

                    {messageType == "customer messages" && selectedCustomerChat &&
                      <div id="elemchat-cs" className={`${styles['cs-chat']}`}>
                        {revArr(selectedCustomerChat?.messages)?.map((c : UserMessage) => c.isSellerMessage ?
                        <div className={`${styles['chat-set']} ${styles['cs-sent']}`}>
                          <div>{new Date(c.createdAt).toLocaleString()}</div>
                          <div className={`${styles['sender-name']}`}>You</div>
                          <div className={`${styles['sent-message']}`}>{c.text}</div>
                          <div className={`${styles['attachments']}`}>{c.imageURL.length > 0 ? <img src={c.imageURL}/> : c.fileURL.length > 0 ? <a target="_blank" href={c.fileURL} rel="noopener noreferrer"><button>Download File</button></a> : ""}</div>
                        </div> :
                        <div className={`${styles['chat-set']} ${styles['cs-received']}`}>
                          <div>{new Date(c.createdAt).toLocaleString()}</div>
                            <div className={`${styles['receiver-name']}`}>{selectedCustomerChat.seller.name}</div>
                            <div className={`${styles['received-message']}`}>{c.text}</div>
                            <div className={`${styles['attachments']}`}>{c.imageURL.length > 0 ? <img src={c.imageURL}/> : c.fileURL.length > 0 ? <a target="_blank" href={c.fileURL} rel="noopener noreferrer"><button>Download File</button></a> : ""}</div>
                          </div>)}
                      </div>
                    }

                    {messageType == "customer service" && (!ongoingSupportChat || ongoingSupportChat?.isResolved) &&
                    <center>
                      <div>
                        <h2>{ongoingSupportChat?.isResolved ? "Your last customer support chat has been resolved." : "You do not have any ongoing customer support chat."}</h2>
                        <br/>
                        <br/>
                        <hr/>
                        <br/>
                        {ongoingSupportChat?.isResolved ?
                        <>
                          <input
                            type="number"
                            placeholder="Rate this support chat out of 5"
                            required
                            className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
                            value={csReviewRating}
                            min={1}
                            max={5}
                            onChange={handleCsReviewRatingChange}
                          />
                          <textarea
                            className={`${styles['send-msg-input']} ${textStyles['textinput-modal']} ${textStyles['input']} `}
                            value={csReviewDescription}
                            onChange={handleCsReviewDescriptionChange}
                            placeholder="Describe your experience with support.."
                            onResize={e => {}}
                          />
                          <button onClick={sendCsReview} className={`${textStyles['button-modal']} ${textStyles['btntrans']}`}>
                            Submit Review and Reset Chat
                          </button>
                        </>
                        :
                        <button onClick={createNewCSChat} className={`${textStyles['button-modal']} ${textStyles['btntrans']}`}>
                          Start a New Chat
                        </button>
                        }
                        <br/>
                      </div>
                      <br/>
                      <br/>
                    </center>
                    }

                    {messageType == "all support chats" && (!selectedSupportChat || selectedSupportChat?.isResolved) &&
                    <center>
                      <div>
                        <h2>{selectedSupportChat?.isResolved ? "This user last chat has already been resolved." : "Error occured while retrieving chat with this user."}</h2>
                        <br/>
                        <br/>
                        <hr/>
                        <br/>
                        {/* {selectedSupportChat?.isResolved &&
                        <>
                        <button onClick={e => {}} className={`${textStyles['button-modal']} ${textStyles['btntrans']}`}>
                          Delete Last Chat
                        </button>
                        <br/>
                        <button onClick={e => {}} className={`${textStyles['button-modal']} ${textStyles['btntrans']}`}>
                          Reopen Chat
                        </button>
                        </>
                        } */}
                        <br/>
                      </div>
                      <br/>
                      <br/>
                    </center>
                    }

                    {displayInputField &&
                    <div className={`${styles['input-box']}`}>
                      <textarea
                        className={`${styles['send-msg-input']} ${textStyles['textinput-modal']} ${textStyles['input']} `}
                        value={newMessage}
                        onChange={handleNewMessageChange}
                        placeholder="Send your message.."
                        onResize={e => {}}
                      />
                      <select name="select-content" className={`${styles['select-content']}`} defaultValue={attachmentType} onChange={handleAttachmentTypeChange}>
                          <option value="none">No attachment</option>
                          <option value="image">Attach an image</option>
                          <option value="file">Attach other file</option>
                      </select>
                      {attachmentType != "none" &&
                      <input
                        type="text"
                        placeholder={attachmentType == "image" ? "Input Image URL" : "Input File URL"}
                        required
                        className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
                        value={attachment}
                        onChange={handleAttachmentChange}
                      />
                    }
                    {messageType == "all support chats" &&
                    <>
                    <br/>
                    <hr/>
                    <br/>
                    <input
                        type="text"
                        placeholder={"Set Chat Topic"}
                        required
                        className={` ${textStyles['textinput-modal']} ${textStyles['input']} `}
                        value={chatTopic}
                        onChange={handleChatTopicChange}
                      />
                      <button onClick={handleTagTopic} className={`${textStyles['button-modal']} ${textStyles['btntrans']}`}>
                        Save Topic
                      </button>
                      <br/><br/>
                      <button onClick={markSupportChatResolved} className={`${textStyles['button-modal']} ${textStyles['btntrans']}`}>
                        Mark as Resolved
                      </button>
                      <br/>
                      <hr/>
                      <br/><br/>
                      </>
                    }
                      <button onClick={handleSendMessage} className={`${textStyles['button-modal']} ${textStyles['btntrans']}`}>
                        Send
                      </button>
                    </div>
                  }
                  </div>
                  </center>
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

              {
                content == "Site Administration" &&
                <div className={`${styles['lx-column']} ${styles['column-creds']}`}>
                  <br/>
                  <select name="select-content" className={`${styles['select-content']}`} onChange={handleAdminTypeChange}>
                        <option value="users" selected>Manage Users</option>
                        <option value="promos">Manage Promotions</option>
                        <option value="shops">Manage Shops</option>
                        <option value="vouchers">Manage Vouchers</option>
                        <option value="reviews">Customer Service Reviews</option>
                        <option value="newsletter">Send Newsletter</option>
                        <option value="overview">Business Overview</option>
                  </select>
                  <br/>
                  {adminType == "users" && <AllUsers header={"All OldEgg Users"} users={users} editMode={true} retrieveUsers={retrieveUsers}/>}
                  {adminType == "promos" && <AllBanners header={"Ongoing Promotional Banners"} banners={banners} editMode={true} retrieveBanners={retrieveBanners}/>}
                  {adminType == "vouchers" && <AllVouchers header={"All Registered Vouchers"} vouchers={vouchers} editMode={true} retrieveVouchers={retrieveVouchers}/>}
                  {adminType == "shops" && <AllShops header={"All Registered Shops"} shops={shops} editMode={true} retrieveShops={retrieveShops}/>}
                  {adminType == "newsletter" && <SendNewsletter emails={emails} retrieveEmails={retrieveEmails}/>}
                  {adminType == "overview" && <AdminCharts users={users} shops={shops}/>}
                  {adminType == "reviews" && <AllCSReviews reviews={CSReviews} />}

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
