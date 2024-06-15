export type Product = {
    pid: string
    name: string
    price: number
    description: string
    category: string
    stock: number
    image: string[]
    sizes: string[]
    rating: {
        average: number
        count: number
    }
    reviews?: {
        uid: string
        name: string
        review: string
        rating: number
        image?: string[]
    }[];
    tags: string[]
}