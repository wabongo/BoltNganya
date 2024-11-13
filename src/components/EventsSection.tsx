import { useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import EventCard from './EventCard';

export default function EventsSection() {
  const { events, fetchEvents, loading, error } = useStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        {error}
      </div>
    );
  }

  return (
    <section id="events" className="py-20 px-4 bg-zinc-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-12">
          <Calendar className="w-10 h-10 text-yellow-400" />
          <h2 className="text-4xl font-bold text-white">Upcoming Events</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {events.map((event) => (
            <div key={event.id} className="animate-on-scroll opacity-0">
              <EventCard {...event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}