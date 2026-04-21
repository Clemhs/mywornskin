import Link from 'next/link';

const creators = [
  {
    id: 'emma-laurent',
    name: 'Emma Laurent',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Passionnée de lingerie fine et de vêtements portés avec amour.',
    items: 24,
    followers: '12.4k',
  },
  {
    id: 'sophie-moreau',
    name: 'Sophie Moreau',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Je partage mes tenues quotidiennes et pièces intimes.',
    items: 18,
    followers: '8.9k',
  },
  {
    id: 'lisa-vert',
    name: 'Lisa Vert',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Amatrice de chaussettes, collants et vêtements du quotidien.',
    items: 31,
    followers: '15.2k',
  },
];

export default function Creators() {
  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Découvrir les créateurs</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Explore les profils et découvre leurs vêtements portés en exclusivité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <Link 
              key={creator.id}
              href={`/creators/${creator.id}`}
              className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-rose-500/50 transition-all hover:-translate-y-1"
            >
              <div className="aspect-square relative">
                <img 
                  src={creator.avatar} 
                  alt={creator.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <h3 className="text-2xl font-semibold">{creator.name}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-zinc-400 text-sm line-clamp-2 mb-6">{creator.bio}</p>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-rose-400 font-medium">{creator.items}</span> pièces
                  </div>
                  <div>
                    <span className="text-rose-400 font-medium">{creator.followers}</span> fans
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
