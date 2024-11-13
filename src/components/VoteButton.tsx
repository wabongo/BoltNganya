import { Vote } from 'lucide-react';

export default function VoteButton() {
  return (
    <a
      href="#nominations"
      className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-black bg-yellow-400 rounded-full overflow-hidden transition-all duration-300 hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/20"
    >
      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
      <Vote className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
      <span>Vote Now</span>
    </a>
  );
}