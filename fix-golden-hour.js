const fs = require('fs');
let s = fs.readFileSync('src/components/home/StoryWall.tsx', 'utf8');

// After observer.observe loop, add immediate check for already-visible cards
const oldObserve =   for (const el of cardRefs.current) {
    if (el) observer.observe(el);
  };

const newObserve =   for (const el of cardRefs.current) {
    if (el) observer.observe(el);
  }

  // Immediately load videos already in viewport on mount
  for (const el of cardRefs.current) {
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const storyId = el.getAttribute('data-story-id');
      if (!storyId) continue;
      const video = videoRefs.current[storyId];
      if (video && !video.getAttribute('data-loaded')) {
        video.setAttribute('data-loaded', 'true');
        const dataSrc = video.getAttribute('data-src');
        if (dataSrc) { video.src = dataSrc; video.load(); video.play().catch(()=>{}); }
      }
    }
  };

s = s.replace(oldObserve, newObserve);
fs.writeFileSync('src/components/home/StoryWall.tsx', s, 'utf8');
console.log('done');
