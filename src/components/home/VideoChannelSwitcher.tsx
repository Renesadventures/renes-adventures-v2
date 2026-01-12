'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface Channel {
  id: string;
  title: string;
  category: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  description: string;
}

const channels: Channel[] = [
  {
    id: 'all',
    title: 'All Tours',
    category: 'all',
    description: 'Experience the best of Belize',
  },
  {
    id: 'fishing',
    title: 'Deep Sea Fishing',
    category: 'fishing',
    description: 'Catch the big ones in Caribbean waters',
  },
  {
    id: 'snorkeling',
    title: 'Snorkeling Adventures',
    category: 'snorkeling',
    description: 'Explore the Hol Chan Marine Reserve',
  },
  {
    id: 'sunset',
    title: 'Sunset Cruises',
    category: 'sunset',
    description: 'Unwind with breathtaking sunsets',
  },
  {
    id: 'blue-hole',
    title: 'Blue Hole',
    category: 'blue-hole',
    description: 'Dive into the world-famous Blue Hole',
  },
  {
    id: 'secret-beach',
    title: 'Secret Beach',
    category: 'secret-beach',
    description: 'Discover hidden gems along the coast',
  },
];

interface VideoChannelSwitcherProps {
  selectedChannel: Channel;
  onChannelChange: (channel: Channel) => void;
}

export default function VideoChannelSwitcher({
  selectedChannel,
  onChannelChange,
}: VideoChannelSwitcherProps) {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent pb-8 pt-16">
      <div className="mx-auto w-full max-w-screen-2xl px-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {channels.map((channel) => {
            const isSelected = selectedChannel.id === channel.id;
            const isHovered = hoveredChannel === channel.id;

            return (
              <motion.div
                key={channel.id}
                className="flex-shrink-0 cursor-pointer"
                onMouseEnter={() => setHoveredChannel(channel.id)}
                onMouseLeave={() => setHoveredChannel(null)}
                onClick={() => onChannelChange(channel)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={`relative w-32 h-20 rounded-lg overflow-hidden transition-all ${
                    isSelected
                      ? 'ring-2 ring-belize-turquoise shadow-lg'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {channel.thumbnailUrl ? (
                    <Image
                      src={channel.thumbnailUrl}
                      alt={channel.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-belize-turquoise to-ocean-blue flex items-center justify-center">
                      <span className="text-white text-xs font-semibold text-center px-2">
                        {channel.title}
                      </span>
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute inset-0 bg-belize-turquoise/20" />
                  )}
                </div>

                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white p-3 rounded-lg min-w-[200px] z-50"
                  >
                    <h4 className="font-bold text-sm mb-1">{channel.title}</h4>
                    <p className="text-xs text-gray-300">{channel.description}</p>
                    <p className="text-xs text-belize-turquoise mt-2">Click to watch preview</p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

