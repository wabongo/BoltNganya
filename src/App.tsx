import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollToTop from './components/ScrollToTop';
import NominationsSection from './components/NominationsSection';
import WinnersSection from './components/WinnersSection';
import EventsSection from './components/EventsSection';
import GalleryGrid from './components/GalleryGrid';
import AboutUs from './components/AboutUs';
import { testConnection } from './lib/firebase';
import { useStore } from './store/useStore';

const galleryItems = [
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500",
    title: "Classic Matatu Design"
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500",
    title: "Urban Street Art"
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500",
    title: "Night Lights"
  }
];

export default function App() {
  const { setUserId, fetchCategories, fetchNominees, fetchEvents } = useStore();

  useEffect(() => {
    const initializeApp = async () => {
      await testConnection();
      const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(userId);
      
      // Fetch all data after initialization
      await Promise.all([
        fetchCategories(),
        fetchNominees(),
        fetchEvents()
      ]);
    };

    initializeApp();
  }, []);

  return (
    <div className="bg-zinc-900 min-h-screen">
      <Navbar />
      <ScrollToTop />
      <Hero />
      <NominationsSection />
      <WinnersSection />
      <EventsSection />
      <section id="gallery" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-12">
            <h2 className="text-4xl font-bold text-white">Gallery</h2>
          </div>
          <div className="animate-on-scroll opacity-0">
            <GalleryGrid items={galleryItems} />
          </div>
        </div>
      </section>
      <AboutUs />
    </div>
  );
}