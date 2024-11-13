import { create } from 'zustand';
import { collection, getDocs, doc, updateDoc, increment, query, where, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Category, Nominee, Event } from '../types';

interface Store {
  categories: Category[];
  nominees: Nominee[];
  events: Event[];
  loading: boolean;
  error: string | null;
  userId: string;
  fetchCategories: () => Promise<void>;
  fetchNominees: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  voteForNominee: (nomineeId: string, categoryId: string) => Promise<void>;
  setUserId: (id: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  categories: [],
  nominees: [],
  events: [],
  loading: false,
  error: null,
  userId: '',

  setUserId: (id: string) => set({ userId: id }),

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const snapshot = await getDocs(collection(db, 'categories'));
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      
      set({ categories: categories.sort((a, b) => a.order - b.order) });
      console.log('Categories fetched:', categories.length);
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: 'Failed to fetch categories' });
    } finally {
      set({ loading: false });
    }
  },

  fetchNominees: async () => {
    try {
      set({ loading: true, error: null });
      const snapshot = await getDocs(collection(db, 'nominees'));
      const nominees = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Nominee[];
      set({ nominees });
      console.log('Nominees fetched:', nominees.length);
    } catch (error) {
      console.error('Error fetching nominees:', error);
      set({ error: 'Failed to fetch nominees' });
    } finally {
      set({ loading: false });
    }
  },

  fetchEvents: async () => {
    try {
      set({ loading: true, error: null });
      const snapshot = await getDocs(collection(db, 'events'));
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      set({ events });
      console.log('Events fetched:', events.length);
    } catch (error) {
      console.error('Error fetching events:', error);
      set({ error: 'Failed to fetch events' });
    } finally {
      set({ loading: false });
    }
  },

  voteForNominee: async (nomineeId: string, categoryId: string) => {
    const { userId } = get();
    if (!userId) {
      set({ error: 'Please sign in to vote' });
      return;
    }

    try {
      set({ loading: true, error: null });
      
      // Check if user has already voted
      const votesRef = collection(db, 'votes');
      const voteQuery = query(
        votesRef,
        where('userId', '==', userId),
        where('categoryId', '==', categoryId)
      );
      const existingVotes = await getDocs(voteQuery);
      
      if (!existingVotes.empty) {
        throw new Error('You have already voted in this category');
      }

      // Update nominee votes
      const nomineeRef = doc(db, 'nominees', nomineeId);
      await updateDoc(nomineeRef, {
        votes: increment(1)
      });

      // Record the vote
      await addDoc(votesRef, {
        userId,
        nomineeId,
        categoryId,
        timestamp: new Date()
      });

      // Update local state
      set(state => ({
        nominees: state.nominees.map(nominee =>
          nominee.id === nomineeId
            ? { ...nominee, votes: nominee.votes + 1 }
            : nominee
        )
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to submit vote' });
    } finally {
      set({ loading: false });
    }
  }
}));