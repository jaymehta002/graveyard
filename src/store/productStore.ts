import { create } from 'zustand';
import { Product } from '@/types/product';
import { db } from '@/config/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, FirestoreError } from 'firebase/firestore';

type ProductStore = {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'pid'>) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    editProduct: (updatedProduct: Product) => Promise<void>;
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
}));

// Initial fetch
useProductStore.getState().fetchProducts();

export default useProductStore;