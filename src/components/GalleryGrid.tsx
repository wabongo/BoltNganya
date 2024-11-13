import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface GalleryItem {
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  title: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedItem(item)}
            className="relative cursor-pointer group overflow-hidden rounded-lg shadow-lg transform transition-all duration-500 hover:-translate-y-2"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
              <ZoomIn className="w-8 h-8 text-yellow-400 mb-3" />
              <p className="text-white text-lg font-semibold px-4 text-center">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors duration-300"
            aria-label="Close gallery"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="max-w-4xl w-full animate-scale">
            {selectedItem.type === 'video' ? (
              <video
                src={selectedItem.url}
                controls
                className="w-full rounded-lg shadow-2xl"
                autoPlay
              />
            ) : (
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="w-full rounded-lg shadow-2xl"
              />
            )}
            <p className="text-white text-center mt-4 text-lg font-medium">
              {selectedItem.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}