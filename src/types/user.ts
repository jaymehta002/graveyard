export type User = {
    uid: string
    name: string
    phone: string
    email: string
    profilePic: string
    address: Address
    orders: string[]
}

export type Address = {
    street: string
    city: string
    state: string
    country: string
    zip: string
}

export default User