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

// Organize nominees by category explicitly
const sampleNominees: Record<string, Omit<Nominee, 'id' | 'categoryId'>[]> = {
  "Best Exterior Design": [
    {
      name: "Thunder Express",
      description: "Known for its striking lightning-themed design and chrome accents",
      image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
      votes: 0,
      isWinner: false
    },
    {
      name: "Urban Beast",
      description: "Features a bold graffiti-style artwork and custom body kit",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
      votes: 0,
      isWinner: false
    }
  ],
  "Best Sound System": [
    {
      name: "Bass King",
      description: "Features a custom 10,000W sound system with perfect acoustics",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
      votes: 0,
      isWinner: false
    },
    {
      name: "Sound Storm",
      description: "Premium JBL setup with synchronized LED visualization",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
      votes: 0,
      isWinner: false
    }
  ],
  "Best Interior Design": [
    {
      name: "Royal Cruiser",
      description: "Luxurious leather interior with LED ambient lighting",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
      votes: 0,
      isWinner: false
    },
    {
      name: "VIP Lounge",
      description: "Custom upholstery with entertainment screens and mood lighting",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
      votes: 0,
      isWinner: false
    }
  ]
};

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
    const categoryMap = new Map<string, string>();

    // Add categories first and store their references
    for (const category of sampleCategories) {
      const categoryRef = doc(collection(db, 'categories'));
      categoryMap.set(category.name, categoryRef.id);
      batch.set(categoryRef, category);
    }

    // Add nominees with their corresponding category IDs
    for (const [categoryName, nominees] of Object.entries(sampleNominees)) {
      const categoryId = categoryMap.get(categoryName);
      if (!categoryId) continue;

      nominees.forEach((nominee) => {
        const nomineeRef = doc(collection(db, 'nominees'));
        batch.set(nomineeRef, {
          ...nominee,
          categoryId
        });
      });
    }

    // Add events
    sampleEvents.forEach((event) => {
      const eventRef = doc(collection(db, 'events'));
      batch.set(eventRef, event);
    });

    await batch.commit();
    console.log('✅ Database initialized with sample data');
    console.log('Category IDs:', Object.fromEntries(categoryMap));
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};