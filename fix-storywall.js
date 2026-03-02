const fs = require('fs');
const base = 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev';

const videos = {
  1: 'deep-sea-fishing.mp4',
  2: 'star-fish.mp4',
  3: 'beach-bbq.mp4',
  4: 'deep-sea-fishing.mp4',
  5: 'grilling-hot-dogs-beach-bbq.mp4',
  6: 'sunset-proposal.mp4',
  7: 'blue-hole-two.mp4',
  8: 'deep-sea-fishing-two.mp4',
  9: 'speargun-one.mp4'
};

let s = fs.readFileSync('src/components/home/StoryWall.tsx', 'utf8');

for (const [id, file] of Object.entries(videos)) {
  const pattern = new RegExp('(id:\\s*' + id + ',[\\s\\S]*?videoSrc:\\s*)[\'][^\'" ]*[\']');
  s = s.replace(pattern, (m, prefix) => prefix + "'" + base + '/' + file + "'");
}

fs.writeFileSync('src/components/home/StoryWall.tsx', s, 'utf8');
console.log('done');
