import {create} from 'zustand';
import {db} from '@/config/firebase'
import {collection, addDoc, getDocs} from 'firebase/firestore'
import { use } from 'react';

interface Contact {
    contactForms: {name: string, email: string, phone: string, message: string}[],
    fetchContactForms: () => void,
}

let dataFetched = false;

const useContactFormStore = create<Contact>((set) => ({
    contactForms: [],
    fetchContactForms: async () => {
        if(dataFetched) return;
        const contactForms: {name: string, email: string, phone: string, message: string}[] = [];
        const querySnapshot = await getDocs(collection(db, 'contactForm'));
        querySnapshot.forEach((doc) => {
            contactForms.push(doc.data() as {name: string, email: string, phone: string, message: string});
        });
        set({contactForms});
        dataFetched = true;
    }
}))

useContactFormStore.getState().fetchContactForms();

export default useContactFormStore;