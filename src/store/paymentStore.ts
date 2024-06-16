// usePaymentStore.ts
import { create } from 'zustand';
import { db } from '@/config/firebase'; // Adjust the path to your Firebase initialization
import { collection, addDoc } from 'firebase/firestore';

interface PaymentItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size: string;
}

interface PaymentDetails {
  items: PaymentItem[];
  totalItems: number;
  totalPrice: number;
}

interface PaymentStoreState {
  paymentDetails: PaymentDetails | null;
  setPaymentDetails: (details: PaymentDetails) => void;
  savePaymentDetails: (details: PaymentDetails) => Promise<string>; // Returns the document ID
}

const usePaymentStore = create<PaymentStoreState>((set) => ({
  paymentDetails: null,
  setPaymentDetails: (details) =>
    set(() => ({
      paymentDetails: details,
    })),
  savePaymentDetails: async (details) => {
    try {
      const paymentRef = await addDoc(collection(db, 'payments'), details);
      console.log('Payment details saved with ID: ', paymentRef.id);
      return paymentRef.id; // Optionally return the ID of the newly created payment document
    } catch (error) {
      console.error('Error saving payment details: ', error);
      throw new Error('Failed to save payment details');
    }
  },
}));

export default usePaymentStore;
