const fs = require('fs');
const base = 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev';

let s = fs.readFileSync('src/components/home/StoryWall.tsx', 'utf8');

const videos = {
  1: 'deep-sea-fishing.mp4',
  2: 'star-fish.mp4',
  3: 'lobster.mp4',
  4: 'coral-reef.mp4',
  5: 'garifuna-drumming.mp4',
  6: 'sunset-proposal.mp4',
  7: 'blue-hole-two.mp4',
  8: 'speargun-one.mp4',
  9: 'secrete-beach.mp4'
};

for (const [id, file] of Object.entries(videos)) {
  const pattern = new RegExp(
    '(id:\\s*' + id + ',[\\s\\S]*?videoSrc:\\s*)[\'][^\'" ]*[\']'
  );
  s = s.replace(pattern, (m, prefix) => prefix + "'" + base + '/' + file + "'");
}

fs.writeFileSync('src/components/home/StoryWall.tsx', s, 'utf8');
console.log('StoryWall done');

let a = fs.readFileSync('src/components/home/AdventureGrid.tsx', 'utf8');
a = a.replace(/blue-hole-one\.mp4|caye-caulker\.mp4|san-pedro-at-dawn\.mp4|great-blue-hole\.mp4|sunset-cruise\.mov/, 'sunset-cruise.mp4');
fs.writeFileSync('src/components/home/AdventureGrid.tsx', a, 'utf8');
console.log('AdventureGrid done');
