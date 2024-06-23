import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import User from '@/types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || userData.name,
              profilePic: firebaseUser.photoURL || userData.profilePic,
              phone: firebaseUser.phoneNumber || userData.phone,
              address: userData.address,
              orders: userData.orders
            });
          } else {
            const defaultUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              profilePic: firebaseUser.photoURL || '',
              phone: firebaseUser.phoneNumber || '',
              address: {
                street: '',
                city: '',
                state: '',
                country: '',
                zip: ''
              },
              orders: []
            };
            setUser(defaultUser);
            const adminRef = collection(db, "admin");
            const adminSnapshot = await getDocs(adminRef);
            const data = adminSnapshot.docs.map(doc => doc.data());
            const isAdmin = data.some(admin => admin.email === defaultUser.email);
            setIsAdmin(isAdmin);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut: signOutUser
  };
}

export default useAuth;
