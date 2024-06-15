// src/services/productService.ts

import { db } from '@/config/firebase';
import { Product } from '@/types/product';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  Timestamp, 
  getDoc,
  increment,
  runTransaction
} from 'firebase/firestore';

interface ReviewData {
  name: string;
  review: string;
  rating: number;
  image?: string;
}

export const addReview = async (productId: string, reviewData: ReviewData) => {
  try {
    const productRef = doc(db, 'products', productId);

    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists()) {
        throw new Error('Product not found');
      }

      const productData = productDoc.data() as Product;
      const newReview = {
        ...reviewData,
        createdAt: Timestamp.now(),
      };

      const newRatingCount = productData.rating.count + 1;
      const newRatingAverage = 
        ((productData.rating.average * productData.rating.count) + reviewData.rating) / newRatingCount;

      transaction.update(productRef, {
        reviews: arrayUnion(newReview),
        'rating.count': newRatingCount,
        'rating.average': newRatingAverage
      });
    });

    return reviewData;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const getProduct = async (productId: string) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return productSnap.data() as Product;
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};