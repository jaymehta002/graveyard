export type User = {
    uid: string
    name: string
    phone: string
    email: string
    profilePic: string
    address: Address
    orders: Orders[]
}

export type Orders = {
    order: {
        id: string
        productID: string[]
        amount: number
        status: string
        date: string 
    }
}

export type Address = {
    street: string
    city: string
    state: string
    country: string
    zip: string
}

export default User