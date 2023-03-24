import gql from 'graphql-tag'

export const GRAPHQL_API = "http://localhost:8080/query"

export const REGISTER_QUERY =
`mutation($name: String!, $email: String!, $phone: String!, $password: String!, $banned: Boolean!, $role: UserRole!, $mailing: Boolean!) {
  auth{
    register(input: {name: $name, email: $email, phone: $phone, password: $password, banned: $banned, role: $role, mailing: $mailing})
  }
}`

export const LOGIN_QUERY =
`mutation($email: String!, $password: String!) {
  auth{
    login(email: $email, password: $password)
  }
}`

export const PROTECTED_QUERY =
`query{
  protected
}`

export const USERS_QUERY =
`
query{
  users{
    id,
    name,
    email,
    phone,
    password,
    banned,
    role,
    mailing,
    creditBalance,
  }
}
`

export const ALLPRODUCTS_QUERY = (limit: number, offset: number) =>
`
query{
  products(limit: ${limit}, offset: ${offset}){
    id,
    name,
    images{
      image
      id
    }
    description,
    price,
    discount,
    stock,
    brand{
      id,
      name,
      logo
    },
    category{
      id,
      name
    },
    reviews{
      id,
      user{
        id
      },
      rating,
      description,
      isAnonymous
    }
  }
}
`

export const RECOMMENDEDPRODUCTS_QUERY = (limit: number, offset: number) =>
`
query{
  recommendedProducts(limit: ${limit}, offset: ${offset}){
    id,
    name,
    images{
      image
      id
    }
    description,
    price,
    discount,
    stock,
    brand{
      id,
      name,
      logo
    },
    category{
      id,
      name
    },
    reviews{
      id,
      user{
        id
      },
      rating,
      description,
      isAnonymous
    }
  }
}
`

export const SEARCHPRODUCTS_QUERY = (limit: number, offset: number, query: string) =>
`
query{
  products(limit: ${limit}, offset: ${offset}, input: {keyword: "${query}"}){
    id,
    name,
    images{
      image
      id
    }
    description,
    price,
    discount,
    stock,
    brand{
      id,
      name,
      logo
    },
    category{
      id,
      name
    },
    reviews{
      id,
      user{
        id
      },
      rating,
      description,
      isAnonymous
    }
  }
}
`

export const SIMILARPRODUCTS_QUERY = (categoryId: string, exceptId: string) =>
`
query{
  products(input:{categoryID: "${categoryId}", exceptID: "${exceptId}"}){
    id,
    name,
    images{
      image
    },
    price,
    discount,
    category{
      id,
      name
    },
  }
}
`

export const ADDTOCART_QUERY = (id: string, quantity: number, notes: string) =>
`
mutation{
  createCart(productID: "${id}", quantity: ${quantity}, notes: "${notes}"){
    user{
      id
    }
    quantity
  }
}
`

export const UPDATECART_QUERY = (id: string, quantity: number, notes: string) =>
`
mutation{
  updateCart(productID: "${id}", quantity: ${quantity}, notes: "${notes}"){
    user{
      id
    }
    quantity
  }
}
`

export const REMOVECART_QUERY = (id: string) =>
`
mutation{
  deleteCart(productID: "${id}")
}
`

export const CARTPRODUCTS_QUERY =
`
query{
  carts{
    user{
      id,
      name
    },
    product{
      id,
      name,
      images{
        image
      },
      price,
      discount
    }
    quantity
  }
}
`

export const SINGLEPRODUCT_QUERY = (id: string) =>
`
query{
  product(id: "${id}"){
    id,
    category{
      id
    },
    name,
    images{
      image
      id
    }
    description,
    price,
    discount,
    stock,
    shop{
      id,
      name,
      profilePic,
      banner,
      address,
      description,
      user{
        id,
        name,
        banned
      }
    },
    brand{
      id,
      name,
      logo
    },
    category{
      id,
      name
    },
    reviews{
      id,
      user{
        id
      },
      rating,
      description,
      isAnonymous
    },
    validTo
  }
}
`

export const GETUSER_QUERY =
`
query{
  getUser{
    name,
    id,
    email,
    phone,
    banned,
    role,
    mailing,
    creditBalance
  }
}
`
export const UPDATEPROFILE_QUERY = (name: string, phone: string) =>
`
mutation{
  updateUser(input: {name: "${name}", phone: "${phone}"}){
    name,
    id,
    email,
    phone,
    banned,
    role,
    mailing
  }
}
`

export const UPDATEPASSWORD_QUERY = (oldpass: string, newpass: string) =>
`
mutation{
  updateUserPassword(oldpassword: "${oldpass}", newpassword: "${newpass}"){
    name,
    id,
    email,
    phone,
    banned,
    role,
    mailing
  }
}
`
export const ALLSHIPMENTS_QUERY =
`
query{
  shipmentTypes {
    id,
    name,
    fee
  }
}
`
export const ALLADDRESS_QUERY =
`
query{
  addresses{
    id,
    name,
    content,
    primary
  }
}
`

export const ALLPAYMENTMETHODS_QUERY =
`
query{
  paymentMethods {
    id,
    name
  }
}
`

export const NEWADDRESS_QUERY = (name: string, content: string, primary: boolean) =>
`
mutation{
  createAddress(name: "${name}", content: "${content}", primary: ${primary}){
    id,
    name
  }
}
`

export const DELETEADDRESS_QUERY = (id: string) =>
`
mutation{
  deleteAddress(id: "${id}")
}
`

export const CARTCHECKOUT_QUERY = (shipmentTypeID: string, addressID: string, paymentMethodID: string, distance: number) =>
`
mutation{
  checkoutCart(shipmentTypeID: "${shipmentTypeID}", addressID: "${addressID}", paymentMethodID: "${paymentMethodID}", distance: ${distance}){
    id,
    date,
    user{
      name
    },
    status,
    shipment{
      name,
      fee
    },
    paymentMethod{
      name
    },
    address{
      content
    },
    transactionDetails{
      product{
        name
      },
      quantity
    }
  }
}
`

export const REDEEMVOUCHER_QUERY = (id: string) =>
`
mutation{
  redeemVoucher(id: "${id}"){
    id,
    value,
    valid,
  }
}
`

export const SHOPTRANSHEADERS_QUERY =
`
query{
  shopOrders{
    id,
    date,
    user{
      id,
      name,
      email,
      phone,
      password,
      banned,
      role,
      mailing,
      creditBalance
    },
    shipment{
      id,
      name,
      fee
    },
    paymentMethod{
      id,
      name
    },
    status,
    transactionDetails{
      product{
        id,
        name,
        images{
          image
        },
        description,
        price,
        discount,
        stock,
        metadata,
        createdAt,
        validTo,
        group{
          id
        },
        brand{
          id,
          name,
          logo
        },
        category{
          id,
          name
        },
        reviews{
          id,
          rating,
          description
        }
      },
      quantity,
      notes
    }
  }
}
`

export const USERTRANSHEADERS_QUERY =
`
query{
  userOrders{
    id,
    date,
    user{
      id,
      name,
      email,
      phone,
      password,
      banned,
      role,
      mailing,
      creditBalance
    },
    shipment{
      id,
      name,
      fee
    },
    paymentMethod{
      id,
      name
    },
    status,
    transactionDetails{
      product{
        id,
        name,
        images{
          image
        },
        description,
        price,
        discount,
        stock,
        metadata,
        createdAt,
        validTo,
        group{
          id
        },
        brand{
          id,
          name,
          logo
        },
        category{
          id,
          name
        },
        reviews{
          id,
          rating,
          description
        }
      },
      quantity,
      notes
    }
  }
}
`

export const USERWISHLISTS_QUERY =
`
query{
  wishlists{
    id,
    title,
    type,
    user{
      id,
      name
    },
    items{
      product{
        id,
        name,
        price,
        discount,
        images{
          image
        }
      }
    }
  }
}
`

export const PUBLICWISHLISTS_QUERY =
`
query{
  publicWishlists{
    id,
    title,
    type,
    user{
      id,
      name
    },
    items{
      product{
        id,
        name,
        price,
        discount,
        images{
          image
        }
      }
    }
  }
}
`

export const FOLLOWEDWISHLISTS_QUERY =
`
query{
  followedWishlists{
    id,
    title,
    type,
    user{
      id,
      name
    },
    items{
      product{
        id,
        name,
        price,
        discount,
        images{
          image
        }
      }
    }
  }
}
`

export const FOLLOWEDWISHLISTSID_QUERY =
`
query{
  followedWishlists{
    id
  }
}
`

export const SINGLEWISHLIST_QUERY = (id: string) =>
`
query{
  wishlist(id: "${id}"){
    id,
    title,
    type,
    user{
      id,
      name
    },
    items{
      product{
        id,
        name,
        price,
        discount,
        images{
          image
        }
      }
    }
  }
}
`

export const WISHLISTFOLLOWERS_QUERY = (id: string) =>
`
query{
  wishlistFollowers(wishlistId: "${id}"){
    id,
    name,
  }
}
`

export const WISHLISTCOMMENTS_QUERY = (id: string) =>
`
query{
  wishlistComments(wishlistId: "${id}"){
    id,
    content,
    date,
    user{
      id,
      name
    }
  }
}
`

export const CREATEWISHLISTCOMMENT_QUERY = (id: string, content: string) =>
`
mutation{
  createWishlistComment(wishlistId: "${id}",
    content: "${content}"
  ){
    id,
    date,
    content
  }
}
`

export const CREATEWISHLIST_QUERY = (title: string, type: string) =>
`
mutation{
  createWishlist(title: "${title}", type: ${type}){
    id,
    title,
    type
  }
}
`

export const DUPLICATEWISHLISTITEMS_QUERY = (sourceId: string, destId: string) =>
`
mutation{
  duplicateWishlistItems(sourceId: "${sourceId}", destinationId: "${destId}"){
    id,
    title,
    type
  }
}
`

export const UPDATEWISHLIST_QUERY = (id: string, title: string, type: string) =>
`
mutation{
  updateWishlist(id: "${id}", title: "${title}", type: ${type}){
    id,
    title,
    type
  }
}
`

export const DELETEWISHLIST_QUERY = (id: string) =>
`
mutation{
  deleteWishlist(id: "${id}")
}
`

export const FOLLOWWISHLIST_QUERY = (id: string) =>
`
mutation{
  followWishlist(wishlistId: "${id}"){
    id
  }
}
`

export const ADDTOWISHLIST_QUERY = (wishlistId: string, productId: string) =>
`
mutation{
  createWishlistItem(wishlistId: "${wishlistId}", productId: "${productId}"){
    wishlist{
      id
    }
  }
}
`

export const DELETEFROMWISHLIST_QUERY = (wishlistId: string, productId: string) =>
`
mutation{
  deleteWishlistItem(wishlistId: "${wishlistId}", productId: "${productId}")
}
`

export const ALLBRANDS_QUERY =
`
query{
  brands(topSold: true){
    id,
    name,
    logo
  }
}
`

export const ALLSHOPS_QUERY =
`
query{
  shops{
    id,
    name,
    address,
    description,
    banner,
    profilePic,
    user{
      id,
      name,
      banned,
      role,
      email
    },
    transactionValue
  }
}
`

export const SINGLESHOP_QUERY = (id: string) =>
`
query{
  shop(id: "${id}"){
    id,
    name,
    address,
    description,
    banner,
    profilePic,
    user{
      id,
      name,
      banned
    },
    products{
      id,
      name,
      images{
        image
      },
      description,
      price,
      discount,
      stock,
      brand{
        id,
        name,
        logo
      },
      category{
        id,
        name
      },
      reviews{
        id,
        user{
          id
        },
        rating,
        description,
        isAnonymous
      }
    }
  }
}
`

export const ADDSEARCH_QUERY = (query: string) =>
`
mutation{
  createSearchQuery(query: "${query}"){
    query,
    count
  }
}
`

export const SAVEUSERSEARCH_QUERY = (query: string) =>
`
mutation{
  saveUserSearch(query: "${query}"){
    search{
      id,
      query
    },
    createdAt
  }
}
`

export const GETUSERSEARCHES_QUERY = (limit: number) =>
`
query{
  userSearches(limit: ${limit}){
    createdAt,
    search{
      id,
      query,
      count
    }
  }
}
`

export const GETPOPULARSEARCHES_QUERY = (limit: number) =>
`
query{
  popularSearches(limit: ${limit}){
    id,
    query,
    count
  }
}
`

export const SHOPRECOMMENDED_QUERY = (shopId: string, limit: number, offset: number, topSold: boolean) =>
`
query{
  products(shopID: "${shopId}", limit: ${limit}, offset: ${offset}, topSold: ${topSold}){
    id,
    name,
    images{
      image
    },
    description,
    price,
    discount,
    stock,
    brand{
      id,
      name,
      logo
    },
    category{
      id,
      name
    },
    reviews{
      id,
      user{
        id
      },
      rating,
      description,
      isAnonymous
    }
  }
}
`

export const UPDATESHOP_QUERY = (name: string, profile: string, address: string, banner: string, description: string) =>
`
mutation{
  updateShop(input: {
    name: "${name}",
    address: "${address}",
    description: "${description}",
    profilePic: "${profile}",
    banner: "${banner}"
  }){
    id
  }
}
`

export const UPDATEPRODUCT_QUERY = (productId: string, name: string, desc: string, price: number, disc: number, stock: number, catId: string, brandId: string) =>
`
mutation{
  updateProduct(productID: "${productId}", input:{
    name: "${name}",
    description: "${desc}",
    price: ${price},
    discount: ${disc},
    stock: ${stock},
    metadata: "",
    categoryID: "${catId}",
    brandID: "${brandId}"
  }){
    id
  }
}
`


export const CREATEPRODUCT_QUERY = (name: string, desc: string, price: number, disc: number, stock: number, catId: string, brandId: string) =>
`
mutation{
  createProductAuto(input:{
    name: "${name}",
    description: "${desc}",
    price: ${price},
    discount: ${disc},
    stock: ${stock},
    metadata: "",
    categoryID: "${catId}",
    brandID: "${brandId}"
  }){
    id
  }
}
`

export const CATEGORIES_QUERY =
`
query{
  categories{
    id,
    name,
  }
}
`

export const BRANDS_QUERY =
`
query{
  brands(topSold:false){
    id,
    name,
    logo
  }
}
`

export const DELETEPRODUCT_QUERY = (id: string) =>
`
mutation{
  deleteProduct(productID: "${id}"){
    id
  }
}
`

export const CREATEPRODUCTIMAGES_QUERY = (productId: string, images: string[]) =>
`
mutation{
  createProductImages(images: ${JSON.stringify(images)}, productID: "${productId}")
}
`

export const CANCELORDER_QUERY = (id: string) =>
`
mutation{
  cancelTransaction(transactionID: "${id}"){
    id
  }
}
`

export const COMPLETEORDER_QUERY = (id: string) =>
`
mutation{
  completeTransaction(transactionID: "${id}"){
    id
  }
}
`

export const USERREVIEWS_QUERY =
`
query{
  userReviews{
    id,
    user{
      id,
      name,
      email,
      role,
      phone,
      banned
    },
    product{
      name,
      images{
        image
      },
      description,
      price,
      discount,
      stock,
      shop{
        id,
        name
      }
    },
    rating,
    description,
    isAnonymous,
    onTimeDelivery,
    productAccuracy,
    serviceSatisfaction
    createdAt,
  }
}
`

export const SHOPREVIEWS_QUERY = (id: string) =>
`
query{
  shopReviews(id: "${id}"){
    id,
    user{
      id,
      name,
      email,
      role,
      phone,
      banned
    },
    product{
      name,
      images{
        image
      },
      description,
      price,
      discount,
      stock,
      shop{
        id,
        name
      }
    },
    rating,
    description,
    isAnonymous,
    onTimeDelivery,
    productAccuracy,
    serviceSatisfaction
    createdAt,
  }
}
`

export const UPDATEREVIEW_QUERY = (id: string, rating: number, desc: string, onTime: boolean, accuracy: boolean, satisfaction: boolean) =>
`
mutation{
  updateReview(
    ID: "${id}",
    rating: ${rating},
    description: "${desc}",
    onTimeDelivery: ${onTime},
    productAccuracy: ${accuracy},
    serviceSatisfaction: ${satisfaction},
  ){
    id
  }
}
`

export const DELETEREVIEW_QUERY = (id: string) =>
`
mutation{
  deleteReview(ID: "${id}")
}
`

export const SHOPAVGRATING_QUERY = (id: string) =>
`
query{
  averageRating(id: "${id}")
}
`

export const SHOPITEMSSOLD_QUERY = (id: string) =>
`
query{
  itemsSold(id: "${id}")
}
`

export const BANUSER_QUERY = (id: string) =>
`
mutation{
  banUser(id: "${id}"){
    id,
    name,
    banned
  }
}
`

export const CREATEVOUCHER_QUERY = (id: string, value: number) =>
`
mutation{
  createVoucher(id: "${id}", value: ${value}){
    id,
    value,
    valid
	}
}
`

export const DELETEVOUCHER_QUERY = (id: string) =>
`
mutation{
  deleteVoucher(id: "${id}")
}
`

export const CREATEBANNER_QUERY = (title: string, link: string, image: string) =>
`
mutation{
  createPromotionBanner(
    title: "${title}",
    link: "${link}"
    image: "${image}"
  ){
    id,
    title,
    link,
    image
  }
}
`

export const DELETEBANNER_QUERY = (id: string) =>
`
mutation{
  deletePromotionBanner(id: "${id}")
}
`

export const VOUCHERS_QUERY =
`
query{
  vouchers{
    id,
    value,
    valid
  }
}
`

export const BANNERS_QUERY =
`
query{
  promotionBanners{
    id,
    title,
    link,
    image
  }
}
`

export const SUBSCRIBEDEMAILS_QUERY =
`
query{
  currentSubscribedEmails
}
`

export const CREATESHOPADMIN_QUERY = (name: string, desc: string, address: string, userId: string) =>
`
mutation{
  createShopAdmin(input: {
    name: "${name}",
    address: "${address}",
    description: "${desc}",
    profilePic: "https://mediaservice.retailmenot.com/ws/mediagroup/GFHCYHTWGZHMVLETA5XJ7YFYJE?width=400&height=400",
    banner: "https://mms.businesswire.com/media/20190611005196/en/725241/22/NE_Logomark_Vert.jpg",
    password: "DEFAULT_OLDEGG_SPW",
  },
    userID: "${userId}"
  ){
    id,
    name,
    address,
    description,
    profilePic,
    banner,
    user{
      id,
      name,
      banned
    }
  }
}
`

export const NOSHOPUSERS_QUERY =
`
query{
  noShopUsers{
    id,
    name,
    email,
    phone,
    banned,
    role,
    mailing,
    creditBalance
  }
}
`

export const SUPPORTCHATREVIEWS_QUERY =
`
query{
  supportChatReviews{
    id,
    createdAt,
    rating,
    description,
    user{
      id,
      name,
      email,
      banned,
      phone,
      role,
      mailing,
      creditBalance
    }
  }
}
`

export const ONGOINGSUPPORTCHAT_QUERY =
`
query{
  supportChat{
    id,
    createdAt,
    customer{
      id,
      name
    },
    isResolved,
    topicTags,
    messages{
      id,
      isStaffMessage,
      createdAt,
      text,
      fileURL,
      imageURL,
    }
  }
}
`

export const SELLERCHATS_QUERY =
`
query{
  sellerChats{
    id,
    createdAt,
    seller{
      id,
      name
    },
    customer{
      id,
      name
    },
    messages{
      id,
      isSellerMessage,
      createdAt,
      text,
      fileURL,
      imageURL
    }
  }
}
`

export const CUSTOMERCHATS_QUERY =
`
query{
  customerChats{
    id,
    createdAt,
    seller{
      id,
      name
    },
    customer{
      id,
      name
    },
    messages{
      id,
      isSellerMessage,
      createdAt,
      text,
      fileURL,
      imageURL
    }
  }
}
`

export const ALLSUPPORTCHATS_QUERY =
`
query{
  supportChats{
    id,
    createdAt,
    customer{
      id,
      name
    },
    isResolved,
    topicTags,
    messages{
      id,
      isStaffMessage,
      createdAt,
      text,
      fileURL,
      imageURL,
    }
  }
}
`

export const USERNOTIFICATIONS_QUERY =
`
query{
  userNotifications{
    id,
    createdAt,
    fromName,
    user{
      id,
      name
    },
    text,
    isRead
  }
}
`

export const SENDSUPPORTMESSAGE_QUERY = (isStaff: boolean, chatId: string, text: string, fileURL: string, imageURL: string) =>
`
mutation{
  sendSupportMessage(
    isStaffMessage: ${isStaff},
    chatId: "${chatId}",
    text: "${text}",
    fileURL: "${fileURL}",
    imageURL: "${imageURL}",
  ){
    id,
    createdAt,
    fileURL,
    imageURL
  }
}
`

export const SENDUSERMESSAGE_QUERY = (isSeller: boolean, chatId: string, text: string, fileURL: string, imageURL: string) =>
`
mutation{
  sendUserMessage(
    isSellerMessage: ${isSeller},
    chatId: "${chatId}",
    text: "${text}",
    fileURL: "${fileURL}",
    imageURL: "${imageURL}"
  ){
    id,
    createdAt,
    fileURL,
    imageURL
  }
}
`

export const MARKRESOLVED_QUERY =  (chatId: string) =>
`
mutation{
  markResolved(chatId: "${chatId}"){
    id,
    isResolved
  }
}
`

export const TAGTOPICS_QUERY =  (chatId: string, topic: string) =>
`
mutation{
  addSupportChatTopic(chatId: "${chatId}", topic: "${topic}"){
    id,
    topicTags
  }
}
`

export const GETLASTTRANSID_QUERY = (userId: string, shopId: string) =>
`
query{
  getLastTransId(userId: "${userId}", shopId: "${shopId}")
}
`

export const CREATECSREVIEW_QUERY = (rating: number, desc: string) =>
`
mutation{
  createSupportChatReview(rating: ${rating}, description: "${desc}"){
    id,
    createdAt,
    rating,
    description
  }
}
`

export const CREATENEWCSCHAT_QUERY = (customerId: string) =>
`
mutation{
  createSupportChat(customerId: "${customerId}"){
    id,
    createdAt
  }
}
`
