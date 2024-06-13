export type Product = {
    pid: string
    name: string
    price: number
    description: string
    category: string
    stock: number
    image: string[]
    color: string[]
    rating: {
        average: number
        count: number
    }
    reviews?: {
        name: string
        review: string
        rating: number
    }[];
    tags: string[]
}