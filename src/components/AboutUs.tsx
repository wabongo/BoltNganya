import { Users, Target, History } from 'lucide-react';
import SocialLinks from './SocialLinks';

const teamMembers = [
  {
    name: "Anita Ndete",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    bio: "Passionate about preserving and celebrating Kenya's vibrant matatu culture."
  },
  {
    name: "David Wabongo",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "Critically acclaimed creative."
  }
];

export default function AboutUs() {
  return (
    <section id="about" className="py-20 px-4 bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">About Nganya Groove</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Celebrating and elevating Kenya's vibrant matatu culture through recognition, innovation, and community engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Target,
              title: "Our Mission",
              description: "To preserve and promote the unique artistry and cultural significance of Kenya's matatu industry."
            },
            {
              icon: History,
              title: "Our Story",
              description: "Founded in 2023, we've grown from a small community initiative to a nationwide celebration of matatu excellence."
            },
            {
              icon: Users,
              title: "Community",
              description: "Building a vibrant network of artists, operators, and enthusiasts who share our passion for matatu culture."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-zinc-800/50 rounded-xl backdrop-blur-lg transform transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center space-x-6 p-6 bg-zinc-800/50 rounded-xl backdrop-blur-lg"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-yellow-400 mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Connect With Us</h3>
          <div className="flex justify-center">
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}