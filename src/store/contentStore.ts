import { db } from '@/config/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { create } from 'zustand';

export interface ContentItem {
  featured: string[];
  star: string;
}

interface ContentStore extends ContentItem {
  fetchContent: () => Promise<void>;
  updateContent: (content: Partial<ContentItem>) => Promise<void>;
  pushToFeatured: (imageUrl: string) => Promise<void>;
  updateStar: (starUrl: string) => Promise<void>;
  loading: boolean;
  deleteFeatured: (imageUrl: string) => Promise<void>;
}

const useContentStore = create<ContentStore>((set, get) => ({
  featured: [],
  star: '',
  loading: false,
  fetchContent: async () => {
    set({ loading: true });
    try {
      const contentCollection = collection(db, 'content');
      const data = await getDocs(contentCollection);
      const content = data.docs.map(doc => doc.data() as ContentItem);
      // console.log('Content fetched: ', content[0].featured);
      if (content.length > 0) {
        set({ featured: content[0].featured, star: content[0].star });
      }
    } catch (error) {
      console.error('Error fetching content: ', error);
    } finally {
      set({ loading: false});
    }
  },
  updateContent: async (newContent) => {
    set({ loading: true });
    try {
      const contentCollection = collection(db, 'content');
      const data = await getDocs(contentCollection);
      if (!data.empty) {
        const docRef = doc(db, 'content', data.docs[0].id);
        await updateDoc(docRef, newContent);
        set((state) => ({
          featured: newContent.featured ?? state.featured,
          star: newContent.star ?? state.star,
        }));
      } else {
        console.error('No documents found in the "content" collection.');
      }
    } catch (error) {
      console.error('Error updating content: ', error);
    } finally {
      set({ loading: false });
    }
  },
  pushToFeatured: async (imageUrl) => {
    set({ loading: true });
    try {
      const contentCollection = collection(db, 'content');
      const data = await getDocs(contentCollection);
      if (!data.empty) {
        const docRef = doc(db, 'content', data.docs[0].id);
        const currentFeatured = get().featured;
        const updatedFeatured = [...currentFeatured, imageUrl];
        await updateDoc(docRef, { featured: updatedFeatured });
        set({ featured: updatedFeatured });
      } else {
        console.error('No documents found in the "content" collection.');
      }
    } catch (error) {
      console.error('Error pushing to featured: ', error);
    } finally {
      set({ loading: false });
    }
  },
  updateStar: async (starUrl) => {
    set({ loading: true });
    try {
      const contentCollection = collection(db, 'content');
      const data = await getDocs(contentCollection);
      if (!data.empty) {
        const docRef = doc(db, 'content', data.docs[0].id);
        await updateDoc(docRef, { star: starUrl });
        set({ star: starUrl });
      } else {
        console.error('No documents found in the "content" collection.');
      }
    } catch (error) {
      console.error('Error updating star: ', error);
    } finally {
      set({ loading: false });
    }
  },
  deleteFeatured: async (imageUrl) => {
    set({ loading: true });
    try {
      const contentCollection = collection(db, 'content');
      const data = await getDocs(contentCollection);
      if (!data.empty) {
        const docRef = doc(db, 'content', data.docs[0].id);
        const currentFeatured = get().featured;
        const updatedFeatured = currentFeatured.filter((url) => url !== imageUrl);
        await updateDoc(docRef, { featured: updatedFeatured });
        set({ featured: updatedFeatured });
      } else {
        console.error('No documents found in the "content" collection.');
      }
    } catch (error) {
      console.error('Error deleting featured: ', error);
    } finally {
      set({ loading: false });
    }
  
  }
}));

useContentStore.getState().fetchContent();


export default useContentStore;
