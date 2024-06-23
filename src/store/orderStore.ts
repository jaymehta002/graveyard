import { create } from 'zustand';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Order } from '@/types/order';

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
  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const orders: Order[] = ordersSnapshot.docs.map(doc => ({
        ...doc.data(),
        oid: doc.id
      } as Order));
      set({ orders, isLoading: false });
    } catch (error) {
      console.error('Error fetching orders: ', error);
      set({ isLoading: false });
    }
  },
  addOrder: async (order: Omit<Order, 'oid'>) => {
    set({ isLoading: true });
    try {
      await addDoc(collection(db, 'orders'), order);
      get().fetchOrders();
    } catch (error) {
      console.error('Error adding order: ', error);
      set({ isLoading: false });
    }
  },
  deleteOrder: async (orderId: string) => {
    set({ isLoading: true });
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      get().fetchOrders();
    } catch (error) {
      console.error('Error deleting order: ', error);
      set({ isLoading: false });
    }
  },
  editOrder: async (updatedOrder: Order) => {
    set({ isLoading: true });
    try {
      await updateDoc(doc(db, 'orders', updatedOrder.oid), updatedOrder);
      get().fetchOrders();
    } catch (error) {
      console.error('Error updating order: ', error);
      set({ isLoading: false });
    }
  },
}));

useOrderStore.getState().fetchOrders();

export default useOrderStore;