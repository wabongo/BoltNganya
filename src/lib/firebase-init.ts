import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, writeBatch, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data for initial setup
const sampleCategories = [
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

const sampleNominees = [
  {
    categoryId: "1", // Will be updated after categories are created
    name: "Thunder Express",
    description: "Known for its striking lightning-themed design and chrome accents",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
    votes: 0,
    isWinner: false
  },
  {
    categoryId: "2", // Will be updated after categories are created
    name: "Bass King",
    description: "Features a custom 10,000W sound system with perfect acoustics",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
    votes: 0,
    isWinner: false
  },
  {
    categoryId: "3", // Will be updated after categories are created
    name: "Royal Cruiser",
    description: "Luxurious leather interior with LED ambient lighting",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    votes: 0,
    isWinner: false
  }
];

const sampleEvents = [
  {
    title: "Nganya Groove Awards 2024",
    date: "2024-06-15",
    venue: "Uhuru Gardens, Nairobi",
    description: "The biggest celebration of matatu culture featuring live performances and awards",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"
  }
];

// Initialize database with sample data
export const initializeDatabase = async () => {
  try {
    const batch = writeBatch(db);
    const categoryRefs: { [key: string]: string } = {};

    // Add categories
    for (const category of sampleCategories) {
      const categoryRef = doc(collection(db, 'categories'));
      categoryRefs[category.name] = categoryRef.id;
      batch.set(categoryRef, category);
    }

    // Add nominees with correct category IDs
    for (let i = 0; i < sampleNominees.length; i++) {
      const nominee = sampleNominees[i];
      const categoryName = sampleCategories[i].name;
      const nomineeRef = doc(collection(db, 'nominees'));
      batch.set(nomineeRef, {
        ...nominee,
        categoryId: categoryRefs[categoryName]
      });
    }

    // Add events
    for (const event of sampleEvents) {
      const eventRef = doc(collection(db, 'events'));
      batch.set(eventRef, event);
    }

    await batch.commit();
    console.log('✅ Database initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};