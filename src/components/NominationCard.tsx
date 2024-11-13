import { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy, ThumbsUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Category, Nominee } from '../types';

interface NominationCardProps {
  category: Category;
  nominees: Nominee[];
}

export default function NominationCard({ category, nominees }: NominationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { voteForNominee, loading } = useStore();

  const handleVote = async (nomineeId: string) => {
    try {
      await voteForNominee(nomineeId, category.id);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="group bg-zinc-800/50 backdrop-blur-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-400/10">
      <div 
        className="p-6 cursor-pointer border-b border-yellow-400/20"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-yellow-400/10">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
              {category.name}
            </h3>
          </div>
          <div className="transform transition-transform duration-300">
            {isExpanded ? (
              <ChevronUp className="text-yellow-400 w-6 h-6" />
            ) : (
              <ChevronDown className="text-yellow-400 w-6 h-6" />
            )}
          </div>
        </div>
        <p className="mt-2 text-gray-400 text-sm">{category.description}</p>
      </div>
      
      <div 
        className={`transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="p-6 space-y-6">
          {nominees.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No nominees available for this category.</p>
          ) : (
            nominees.map((nominee) => (
              <div 
                key={nominee.id} 
                className="flex space-x-4 transform transition-all duration-300 hover:translate-x-2"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <img 
                    src={nominee.image} 
                    alt={nominee.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-2">{nominee.name}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">{nominee.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 text-sm">
                      {nominee.votes} votes
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(nominee.id);
                      }}
                      disabled={loading || !category.isVotingOpen}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-black rounded-full text-sm font-medium hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{category.isVotingOpen ? 'Vote' : 'Voting Closed'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}