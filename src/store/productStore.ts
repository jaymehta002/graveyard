import {create} from 'zustand';
import {Product} from '@/types/product';
import { db } from '@/config/firebase';
import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
import { use } from 'react';

type ProductStore = {
    products: Product[]
    fetchProducts: () => void
}

let dataFetched = false
export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    fetchProducts: async () => {
        if(dataFetched) return

        try {
            const productsCollection = collection(db, 'products')
            const productsSnapshot = await getDocs(productsCollection)
            const products: Product[] = []
            productsSnapshot.forEach((doc) => {
                products.push(doc.data() as Product)
            })
            set({products})
            dataFetched = true
        } catch (error) {
            console.error('Error fetching products: ', error)
        }
    },
}));

useProductStore.getState().fetchProducts();

export default useProductStore;