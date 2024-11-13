import { useEffect } from 'react';
import { Award } from 'lucide-react';
import { useStore } from '../store/useStore';
import NominationCard from './NominationCard';
import { Nominee } from '../types';

export default function NominationsSection() {
  const { categories, nominees, fetchCategories, fetchNominees, loading, error } = useStore();

  useEffect(() => {
    const loadData = async () => {
      console.log('Fetching data...');
      await Promise.all([fetchCategories(), fetchNominees()]);
      console.log('Data fetched');
    };
    loadData();
  }, [fetchCategories, fetchNominees]);
  
  console.log('Current categories:', categories);
  console.log('Current nominees:', nominees);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-400 py-8">
            <p>Error: {error}</p>
            <button 
              onClick={() => { fetchCategories(); fetchNominees(); }}
              className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-400 py-8">
            No categories available at the moment.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="nominations" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2">
          {categories.map((category) => {
            console.log(`Filtering nominees for category: ${category.name} (ID: ${category.id})`);
            const categoryNominees = nominees.filter(nominee => {
              console.log(`Nominee ID: ${nominee.id}, Category ID: ${nominee.categoryId}`);
              return nominee.categoryId === category.id;
            });
            console.log(`Nominees Count for ${category.name}: ${categoryNominees.length}`);
            return (
              <NominationCard
                key={category.id}
                category={category}
                nominees={categoryNominees}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}