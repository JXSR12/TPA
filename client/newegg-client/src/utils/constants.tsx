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
`query{
  users {
    id
    name
    phone
    email
    password
    banned
    role
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
    }
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
    address{
      id,
      name,
      content,
      primary
    },
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
  brands(topSold: false){
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
      name
    },
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
      name
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
