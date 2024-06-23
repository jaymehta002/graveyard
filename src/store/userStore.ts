import { create } from 'zustand';
import { User, Orders } from '@/types/user';
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc, FirestoreError, arrayUnion } from 'firebase/firestore';
import { db } from '@/config/firebase';

type UserStore = {
  users: User[];
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  fetchUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addOrderToUser: (userId: string, order: any) => Promise<void>; // Ensure this uses Orders type
};

let dataFetched = false;

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  isAdmin: false,
  fetchUsers: async () => {
    if (dataFetched) return;
  
    set({ isLoading: true, error: null });
    try {
      const userRef = collection(db, 'users');
      const userSnapshot = await getDocs(userRef);
      const users: User[] = userSnapshot.docs.map((doc) => {
        const userData = doc.data();
        return {
          uid: doc.id, // Ensure uid is assigned correctly
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
        } as User;
      });
  
      const adminRef = collection(db, 'admin');
      const adminSnapshot = await getDocs(adminRef);
      const admins = adminSnapshot.docs.map((doc) => doc.id);
      const isAdmin = admins.includes(users[0]?.uid); // Check if first user is admin
  
      set({ users, isLoading: false, isAdmin });
      dataFetched = true;
    } catch (error) {
      console.error('Error fetching users: ', error);
      set({ error: (error as FirestoreError).message, isLoading: false });
    }
  },
  
  deleteUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(doc(db, 'users', userId));
      set((state) => ({
        users: state.users.filter((user) => user.uid !== userId),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting user: ', error);
      set({ error: (error as FirestoreError).message, isLoading: false });
    }
  },
  addOrderToUser: async (userId: string, order: any) => { // Ensure this uses Orders type
    set({ isLoading: true, error: null });
    try {
      const userDoc = doc(db, 'users', userId);
  
      // Use arrayUnion to add the new order to the orders array
      await updateDoc(userDoc, {
        orders: arrayUnion(order)
      });
  
      // Update local state
      set(state => ({
        users: state.users.map(user => 
          user.uid === userId 
            ? { ...user, orders: [...(user.orders || []), order] } 
            : user
        ),
        isLoading: false
      }));
  
      // console.log('Order added successfully to user');
    } catch (error) {
      console.error('Error adding order to user: ', error);
      set({ error: (error as FirestoreError).message, isLoading: false });
    }
  }
}));

// Ensure fetchUsers is called initially to load data
useUserStore.getState().fetchUsers();

export default useUserStore;
