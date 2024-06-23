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
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import User from '@/types/user';
import Cookies from 'js-cookie';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAndSetUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      let userData: User;
      if (userDoc.exists()) {
        userData = userDoc.data() as User;
      } else {
        userData = {
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
        // Create a new user document if it doesn't exist
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      }

      const adminRef = collection(db, "admin");
      const adminSnapshot = await getDocs(adminRef);
      const userIsAdmin = adminSnapshot.docs.some(doc => doc.data().email === userData.email);

      // Store user data and admin status in cookies
      Cookies.set('userData', JSON.stringify(userData), { expires: 7 });
      Cookies.set('isAdmin', JSON.stringify(userIsAdmin), { expires: 7 });

      setUser(userData);
      setIsAdmin(userIsAdmin);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        await fetchAndSetUserData(firebaseUser);
      } else {
        setUser(null);
        setIsAdmin(false);
        Cookies.remove('userData');
        Cookies.remove('isAdmin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await fetchAndSetUserData(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await fetchAndSetUserData(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      Cookies.remove('userData');
      Cookies.remove('isAdmin');
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