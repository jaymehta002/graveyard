import { create } from 'zustand';
import { Product } from '@/types/product';
import { db } from '@/config/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, FirestoreError, getDoc } from 'firebase/firestore';

type ProductStore = {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'pid'>) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    editProduct: (updatedProduct: Product) => Promise<void>;
    // addReview: (productId: string, review: Omit<Product['reviews'][0], 'uid'>) => Promise<void>;
    addReview: (productId: string, review: { uid: string; name: string; review: string; rating: number; image?: string[]}) => Promise<void>;
};

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    isLoading: false,
    error: null,
    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const productsCollection = collection(db, 'products');
            const productsSnapshot = await getDocs(productsCollection);
            const products: Product[] = productsSnapshot.docs.map(doc => ({ 
                ...doc.data(), 
                pid: doc.id 
            } as Product));
            set({ products, isLoading: false });
        } catch (error) {
            console.error('Error fetching products: ', error);
            set({ error: (error as FirestoreError).message, isLoading: false });
        }
    },
    addProduct: async (product: Omit<Product, 'pid'>) => {
        set({ isLoading: true, error: null });
        try {
            const docRef = await addDoc(collection(db, 'products'), product);
            const newProduct = { ...product, pid: docRef.id } as Product;
            set(state => ({ 
                products: [...state.products, newProduct],
                isLoading: false 
            }));
        } catch (error) {
            console.error('Error adding product: ', error);
            set({ error: (error as FirestoreError).message, isLoading: false });
        }
    },
    deleteProduct: async (productId: string) => {
        set({ isLoading: true, error: null });
        try {
            // Optimistic update
            set(state => ({
                products: state.products.filter((product) => product.pid !== productId),
            }));
            await deleteDoc(doc(db, 'products', productId));
            set({ isLoading: false });
        } catch (error) {
            console.error('Error deleting product: ', error);
            set({ error: (error as FirestoreError).message, isLoading: false });
            // Revert optimistic update
            get().fetchProducts();
        }
    },
    editProduct: async (updatedProduct: Product) => {
        set({ isLoading: true, error: null });
        try {
            // Optimistic update
            set(state => ({
                products: state.products.map(p => 
                    p.pid === updatedProduct.pid ? updatedProduct : p
                ),
            }));
            const productRef = doc(db, 'products', updatedProduct.pid);
            await updateDoc(productRef, {...updatedProduct});
            set({ isLoading: false });
        } catch (error) {
            console.error('Error updating product: ', error);
            set({ error: (error as FirestoreError).message, isLoading: false });
            // Revert optimistic update
            get().fetchProducts();
        }
    },
    addReview: async (productId: string, review: { uid: string; name: string; review: string; rating: number; image?: string[] }) => {
        set({ isLoading: true, error: null });
        try {
            const productRef = doc(db, 'products', productId);
            const productSnapshot = await getDoc(productRef);
            
            if (productSnapshot.exists()) {
                const product = productSnapshot.data() as Product;
                const updatedReviews = [...(product.reviews || []), review];

                const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = totalRating / updatedReviews.length;

                const newRating = {
                    average: averageRating,
                    count: updatedReviews.length
                };
                
                // Update the product in Firestore
                await updateDoc(productRef, { rating: newRating ,reviews: updatedReviews });
                
                // Update the local state
                set(state => ({
                    products: state.products.map(p => 
                        p.pid === productId 
                            ? { ...p, reviews: updatedReviews }
                            : p
                    ),
                    isLoading: false
                }));
            } else {
                throw new Error('Product not found');
            }
        } catch (error) {
            console.error('Error adding review: ', error);
            set({ error: (error as FirestoreError).message, isLoading: false });
        }
    },
}));

// Initial fetch
useProductStore.getState().fetchProducts();

export default useProductStore;