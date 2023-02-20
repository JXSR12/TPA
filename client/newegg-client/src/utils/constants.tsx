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
    stock
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
    stock
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
    stock
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
    mailing
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
