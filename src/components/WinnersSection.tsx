import { useEffect } from 'react';
import { Trophy, Crown } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function WinnersSection() {
  const { categories, nominees, fetchCategories, fetchNominees } = useStore();

  useEffect(() => {
    fetchCategories();
    fetchNominees();
  }, []);

  const getWinnerDetails = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const winner = nominees.find(n => n.id === category?.winnerNomineeId);
    return { category, winner };
  };

  const closedCategories = categories.filter(category => !category.isVotingOpen);

  if (closedCategories.length === 0) {
    return (
      <section id="winners" className="py-20 px-4 bg-zinc-800/50">
        <div className="max-w-7xl mx-auto text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">Winners</h2>
          <p className="text-gray-400">Voting is still ongoing. Winners will be announced once voting closes.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="winners" className="py-20 px-4 bg-zinc-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-12">
          <Trophy className="w-10 h-10 text-yellow-400" />
          <h2 className="text-4xl font-bold text-white">Winners</h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {closedCategories.map((category) => {
            const { winner } = getWinnerDetails(category.id);
            
            if (!winner) return null;

            return (
              <div
                key={category.id}
                className="relative overflow-hidden rounded-xl bg-zinc-900 p-6 shadow-xl"
              >
                <div className="absolute top-4 right-4">
                  <Crown className="w-8 h-8 text-yellow-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {category.name}
                </h3>
                
                <div className="flex items-center space-x-6">
                  <div className="relative w-32 h-32">
                    <img
                      src={winner.image}
                      alt={winner.name}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-yellow-400 mb-2">
                      {winner.name}
                    </h4>
                    <p className="text-gray-400 mb-3">
                      {winner.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400">{winner.votes} votes</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}