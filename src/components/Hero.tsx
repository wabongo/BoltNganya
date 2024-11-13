import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import VoteButton from './VoteButton';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroRef.current.style.opacity = `${1 - scrolled / 700}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    const nominationsSection = document.getElementById('nominations');
    nominationsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div ref={heroRef} className="absolute inset-0">
        <img
          src="/Hero.png" // Update this path to match your public directory structure
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-zinc-900"></div>
      </div>
      
      <div className="relative px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
            NGANYA GROOVE
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 animate-slide-up">
          Celebrating the vibrant spirit of matatu culture through art, music, and innovation
        </p>
        <div className="animate-scale">
          <VoteButton />
        </div>
        <button
          onClick={scrollToContent}
          className="animate-bounce absolute bottom-12 left-1/2 -translate-x-1/2 text-yellow-400 hover:text-yellow-300 transition-colors"
          aria-label="Scroll to content"
        >
          <ChevronDown className="w-10 h-10" />
        </button>
      </div>
    </section>
  );
}