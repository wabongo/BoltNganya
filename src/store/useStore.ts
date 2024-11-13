import { create } from 'zustand';
import { collection, getDocs, doc, updateDoc, increment, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { addCategory, addNominee, addEvent, submitVote, closeVoting } from '../lib/firebase-helpers';
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
  addNewCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  addNewNominee: (nominee: Omit<Nominee, 'id'>) => Promise<void>;
  addNewEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  voteForNominee: (nomineeId: string, categoryId: string) => Promise<void>;
  closeVotingForCategory: (categoryId: string) => Promise<void>;
  setUserId: (id: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  categories: [],
  nominees: [],
  events: [],
  loading: false,
  error: null,
  userId: '', // Simple user tracking for voting

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      set({ error: 'Failed to fetch events' });
    } finally {
      set({ loading: false });
    }
  },

  addNewCategory: async (category: Omit<Category, 'id'>) => {
    try {
      set({ loading: true, error: null });
      const newCategory = await addCategory(category);
      set(state => ({
        categories: [...state.categories, newCategory]
      }));
    } catch (error) {
      set({ error: 'Failed to add category' });
    } finally {
      set({ loading: false });
    }
  },

  addNewNominee: async (nominee: Omit<Nominee, 'id'>) => {
    try {
      set({ loading: true, error: null });
      const newNominee = await addNominee(nominee);
      set(state => ({
        nominees: [...state.nominees, newNominee]
      }));
    } catch (error) {
      set({ error: 'Failed to add nominee' });
    } finally {
      set({ loading: false });
    }
  },

  addNewEvent: async (event: Omit<Event, 'id'>) => {
    try {
      set({ loading: true, error: null });
      const newEvent = await addEvent(event);
      set(state => ({
        events: [...state.events, newEvent]
      }));
    } catch (error) {
      set({ error: 'Failed to add event' });
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
      await submitVote(nomineeId, categoryId, userId);
      
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
  },

  closeVotingForCategory: async (categoryId: string) => {
    try {
      set({ loading: true, error: null });
      const winnerId = await closeVoting(categoryId);
      
      // Update local state
      set(state => ({
        categories: state.categories.map(category =>
          category.id === categoryId
            ? { ...category, isVotingOpen: false, winnerNomineeId: winnerId }
            : category
        ),
        nominees: state.nominees.map(nominee =>
          nominee.id === winnerId
            ? { ...nominee, isWinner: true }
            : nominee
        )
      }));
    } catch (error) {
      set({ error: 'Failed to close voting' });
    } finally {
      set({ loading: false });
    }
  }
}));