import { create } from 'zustand';
import { User } from '@/types/user';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';

type UserStore = {
  users: User[];
  fetchUsers: () => void;
  deleteUser: (userId: string) => void;
};

let dataFetched = false;

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  fetchUsers: async () => {
    if (dataFetched) return;

    try {
      const userRef = collection(db, 'users');
      const userSnapshot = await getDocs(userRef);
      const users: User[] = userSnapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      } as User));
      set({ users });
      dataFetched = true;
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  },
  deleteUser: async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      set((state) => ({
        users: state.users.filter((user) => user.uid !== userId),
      }));
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  },
}));

// Ensure fetchUsers is called initially to load data
useUserStore.getState().fetchUsers();

export default useUserStore;
