import {create} from 'zustand';
import {Order} from '@/types/order';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

type OrderStore = {
    orders: Order[];
    isLoading: boolean;
    fetchOrders: () => Promise<void>;
    addOrder: (order: Omit<Order, 'oid'>) => Promise<void>;
    deleteOrder: (orderId: string) => Promise<void>;
    editOrder: (updatedOrder: Order) => Promise<void>;
};

export const useOrderStore = create<OrderStore>((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,
    fetchOrders: async () => {
        set({isLoading: true});
        try {
            const ordersCollection = collection(db, 'orders');
            const ordersSnapshot = await getDocs(ordersCollection);
            const orders: Order[] = ordersSnapshot.docs.map(doc => ({
                ...doc.data(),
                oid: doc.id
            } as Order));
            set({orders, isLoading: false});

        } catch (error) {
            console.error('Error fetching orders: ', error);
        }
    },
    addOrder: async (order: Omit<Order, 'oid'>) => {
        set({isLoading: true});
        try {
            // Add order to Firestore
        } catch (error) {
            console.error('Error adding order: ', error);
        }
    },
    deleteOrder: async (orderId: string) => {
        set({isLoading: true});
        try {
            // Delete order from Firestore
        } catch (error) {
            console.error('Error deleting order: ', error);
        }
    },
    editOrder: async (updatedOrder: Order) => {
        set({isLoading: true});
        try {
            // Update order in Firestore
        } catch (error) {
            console.error('Error updating order: ', error);
        }
    },
}));