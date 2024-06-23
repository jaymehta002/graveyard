import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDD29TGriNB1uKlFMUvCcj3gJK32PQKrbM",
  authDomain: "ecommerce-10416.firebaseapp.com",
  projectId: "ecommerce-10416",
  storageBucket: "ecommerce-10416.appspot.com",
  messagingSenderId: "433284542278",
  appId: "1:433284542278:web:00dd7ba8540d5247b4bf47",
  measurementId: "G-6BS6V9WYYJ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };
