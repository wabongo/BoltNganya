import { Youtube, Instagram, Twitter } from 'lucide-react';

const socialLinks = [
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@nganyagroove',
    color: 'hover:text-red-500'
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/nganyagroove',
    color: 'hover:text-pink-500'
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/nganyagroove',
    color: 'hover:text-blue-400'
  }
  // {
  //   name: 'TikTok',
  //   icon: TikTok,
  //   url: 'https://tiktok.com/@nganyagroove',
  //   color: 'hover:text-white'
  // }
];

export default function SocialLinks() {
  return (
    <div className="flex space-x-4">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`transform hover:scale-110 transition-all duration-300 ${social.color}`}
          aria-label={`Follow us on ${social.name}`}
        >
          <social.icon className="w-6 h-6" />
        </a>
      ))}
    </div>
  );
}