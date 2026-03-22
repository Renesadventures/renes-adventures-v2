const fs = require('fs'), path = require('path');

const toursPath = path.join(process.cwd(), 'src', 'data', 'tours.ts');
let tours = fs.readFileSync(toursPath, 'utf8');

// First undo the bad insert — remove the duplicate closing ];
// The bad insert added another entry + ]; inside the wrong place
// Find and remove the reef-fishing block that was wrongly inserted
const badBlock = `  {
    id: "reef-fishing",
    title: "Reef Fishing",
    slug: "reef-fishing",
    description: "Light tackle. Fast action. Snappers, groupers, and jacks on the Belize Barrier Reef. The reel never stops — dinner is in the cooler by noon.",
    price: 400,
    fullDayPrice: 600,
    priceFullDay: 600,
    duration: 'Half Day (4 hours)',
    fullDayDuration: 'Full Day (8 hours)',
    hasHalfDay: true,
    hasFullDay: true,
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/reef-fishing.jpg',
    features: [
      "Target snappers, groupers, and jacks",
      "Light tackle — fast action fishing",
      "Fish the Belize Barrier Reef",
      "Fresh catch cleaned and prepped",
      "All equipment and bait included"
    ]
  },
];`;

if (tours.includes(badBlock)) {
  tours = tours.replace(badBlock, '];');
  console.log('✓ Removed bad insert');
} else {
  console.log('Bad block not found — checking state of file...');
  const idx = tours.indexOf('id: "reef-fishing"');
  if (idx !== -1) console.log('Found reef-fishing at:', idx, '\n', tours.slice(Math.max(0,idx-50), idx+100));
}

// Now find the CORRECT closing of the tours array
// It ends with the secret-beach entry closing brace + ];
const correctInsertPoint = `    ]
  },
];`;

const reefEntry = `    ]
  },
  {
    id: "reef-fishing",
    title: "Reef Fishing",
    slug: "reef-fishing",
    description: "Light tackle. Fast action. Snappers, groupers, and jacks on the Belize Barrier Reef. The reel never stops — dinner is in the cooler by noon.",
    price: 400,
    fullDayPrice: 600,
    priceFullDay: 600,
    duration: 'Half Day (4 hours)',
    fullDayDuration: 'Full Day (8 hours)',
    hasHalfDay: true,
    hasFullDay: true,
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/reef-fishing.jpg',
    features: [
      "Target snappers, groupers, and jacks",
      "Light tackle — fast action fishing",
      "Fish the Belize Barrier Reef",
      "Fresh catch cleaned and prepped",
      "All equipment and bait included"
    ]
  },
];`;

if (tours.includes(correctInsertPoint)) {
  // Only replace the LAST occurrence (end of tours array)
  const lastIdx = tours.lastIndexOf(correctInsertPoint);
  tours = tours.slice(0, lastIdx) + reefEntry + tours.slice(lastIdx + correctInsertPoint.length);
  console.log('✓ Reef fishing inserted at correct location');
} else {
  console.log('ERROR: correct insert point not found');
  // Show last 200 chars to debug
  console.log('File tail:', tours.slice(-300));
  process.exit(1);
}

fs.writeFileSync(toursPath, tours, 'utf8');
console.log('tours.ts size:', tours.length);
