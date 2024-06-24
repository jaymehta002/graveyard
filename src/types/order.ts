export type Order = {
    oid: string
    uid: string
    products: {
        pid: string
        name: string
        price: number
        quantity: number
        size: string
    }[]
    total: number
    status: string
    date: string
    shippingStatus: string
    address: {
        street: string
        city: string
        state: string
        country: string
        zip: string 
    }
    payment?: {
        method: string
        transaction: string
    }
    delivery?: {
        method: string
        tracking: string
        date: string
    }
}