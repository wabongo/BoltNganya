import { useEffect } from 'react';
import { Award } from 'lucide-react';
import { useStore } from '../store/useStore';
import NominationCard from './NominationCard';

export default function NominationsSection() {
  const { categories, nominees, fetchCategories, fetchNominees, loading, error } = useStore();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCategories(), fetchNominees()]);
    };
    loadData();
  }, []);

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
        <div className="flex items-center space-x-4 mb-12">
          <Award className="w-10 h-10 text-yellow-400" />
          <h2 className="text-4xl font-bold text-white">Nominations</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {categories.map((category) => {
            const categoryNominees = nominees.filter(n => n.categoryId === category.id);
            return (
              <div key={category.id} className="animate-on-scroll opacity-0">
                <NominationCard
                  category={category}
                  nominees={categoryNominees}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}