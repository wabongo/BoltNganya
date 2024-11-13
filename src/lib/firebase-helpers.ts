import { collection, addDoc, updateDoc, doc, deleteDoc, query, where, getDocs, increment, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Category, Nominee, Event, Vote } from '../types';

// Category helpers
export const addCategory = async (category: Omit<Category, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...category,
      isVotingOpen: true,
      winnerNomineeId: null
    });
    return { id: docRef.id, ...category };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, data: Partial<Category>) => {
  try {
    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, data);
    return { id, ...data };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const closeVoting = async (categoryId: string) => {
  try {
    // Close voting for the category
    await updateCategory(categoryId, { isVotingOpen: false });
    
    // Get all nominees for this category
    const nomineesQuery = query(
      collection(db, 'nominees'),
      where('categoryId', '==', categoryId)
    );
    const nomineesSnapshot = await getDocs(nomineesQuery);
    
    // Find nominee with most votes
    let maxVotes = 0;
    let winnerId = '';
    
    nomineesSnapshot.forEach((doc) => {
      const nominee = doc.data();
      if (nominee.votes > maxVotes) {
        maxVotes = nominee.votes;
        winnerId = doc.id;
      }
    });
    
    // Update category with winner
    if (winnerId) {
      await updateCategory(categoryId, { winnerNomineeId: winnerId });
      await updateNominee(winnerId, { isWinner: true });
    }
    
    return winnerId;
  } catch (error) {
    console.error('Error closing voting:', error);
    throw error;
  }
};

// Nominee helpers
export const addNominee = async (nominee: Omit<Nominee, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'nominees'), {
      ...nominee,
      votes: 0,
      isWinner: false
    });
    return { id: docRef.id, ...nominee };
  } catch (error) {
    console.error('Error adding nominee:', error);
    throw error;
  }
};

export const updateNominee = async (id: string, data: Partial<Nominee>) => {
  try {
    const nomineeRef = doc(db, 'nominees', id);
    await updateDoc(nomineeRef, data);
    return { id, ...data };
  } catch (error) {
    console.error('Error updating nominee:', error);
    throw error;
  }
};

// Voting helpers
export const submitVote = async (nomineeId: string, categoryId: string, userId: string) => {
  try {
    // Check if category is still open for voting
    const categoryRef = doc(db, 'categories', categoryId);
    const categoryDoc = await getDocs(query(collection(db, 'categories'), where('id', '==', categoryId)));
    const category = categoryDoc.docs[0].data();
    
    if (!category.isVotingOpen) {
      throw new Error('Voting is closed for this category');
    }
    
    // Check if user has already voted in this category
    const existingVoteQuery = query(
      collection(db, 'votes'),
      where('categoryId', '==', categoryId),
      where('userId', '==', userId)
    );
    const existingVoteDoc = await getDocs(existingVoteQuery);
    
    if (!existingVoteDoc.empty) {
      throw new Error('You have already voted in this category');
    }
    
    // Create vote record
    await addDoc(collection(db, 'votes'), {
      nomineeId,
      categoryId,
      userId,
      timestamp: serverTimestamp()
    });
    
    // Increment nominee votes
    const nomineeRef = doc(db, 'nominees', nomineeId);
    await updateDoc(nomineeRef, {
      votes: increment(1)
    });
    
    return true;
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
};

// Event helpers
export const addEvent = async (event: Omit<Event, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), event);
    return { id: docRef.id, ...event };
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

export const updateEvent = async (id: string, data: Partial<Event>) => {
  try {
    const eventRef = doc(db, 'events', id);
    await updateDoc(eventRef, data);
    return { id, ...data };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};