import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import type { Category, Nominee, Event } from '../types';

const sampleCategories: Omit<Category, 'id'>[] = [
  {
    name: "Best Exterior Design",
    description: "Recognizing the most creative and innovative matatu exterior designs",
    order: 1,
    isVotingOpen: true
  },
  {
    name: "Best Sound System",
    description: "Celebrating the most impressive audio setups in the industry",
    order: 2,
    isVotingOpen: true
  },
  {
    name: "Best Interior Design",
    description: "Honoring exceptional interior modifications and aesthetics",
    order: 3,
    isVotingOpen: true
  }
];

const sampleNominees: Omit<Nominee, 'id'>[] = [
  {
    categoryId: "", // Will be updated during initialization
    name: "Thunder Express",
    description: "Known for its striking lightning-themed design and chrome accents",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
    votes: 0,
    isWinner: false
  },
  {
    categoryId: "", // Will be updated during initialization
    name: "Bass King",
    description: "Features a custom 10,000W sound system with perfect acoustics",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
    votes: 0,
    isWinner: false
  },
  {
    categoryId: "", // Will be updated during initialization
    name: "Royal Cruiser",
    description: "Luxurious leather interior with LED ambient lighting",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    votes: 0,
    isWinner: false
  }
];

const sampleEvents: Omit<Event, 'id'>[] = [
  {
    title: "Nganya Groove Awards 2024",
    date: "2024-06-15",
    venue: "Uhuru Gardens, Nairobi",
    description: "The biggest celebration of matatu culture featuring live performances and awards",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"
  }
];

export const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');
    const batch = writeBatch(db);
    const categoryRefs: string[] = [];

    // Add categories first
    for (const category of sampleCategories) {
      const categoryRef = doc(collection(db, 'categories'));
      categoryRefs.push(categoryRef.id);
      batch.set(categoryRef, category);
    }

    // Add nominees with corresponding category IDs
    sampleNominees.forEach((nominee, index) => {
      const nomineeRef = doc(collection(db, 'nominees'));
      batch.set(nomineeRef, {
        ...nominee,
        categoryId: categoryRefs[index % categoryRefs.length] // Distribute nominees across categories
      });
    });

    // Add events
    sampleEvents.forEach((event) => {
      const eventRef = doc(collection(db, 'events'));
      batch.set(eventRef, event);
    });

    await batch.commit();
    console.log('✅ Database initialized with sample data');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};