import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  title: string;
  date: string;
  venue: string;
  description: string;
  image: string;
}

export default function EventCard({ title, date, venue, description, image }: EventCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-xl transform transition-all duration-500 hover:-translate-y-2">
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300"></div>
      </div>
      
      <div className="relative p-8 h-full min-h-[400px] flex flex-col justify-end">
        <div className="transform transition-all duration-500 group-hover:translate-y-0">
          <div className="flex items-center space-x-2 text-yellow-400 mb-3">
            <Calendar className="w-5 h-5" />
            <p className="font-semibold">{date}</p>
          </div>
          
          <h3 className="text-white text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors duration-300">
            {title}
          </h3>
          
          <div className="flex items-center space-x-2 text-gray-300 mb-4">
            <MapPin className="w-5 h-5" />
            <p>{venue}</p>
          </div>
          
          <p className="text-gray-400 transform transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}