/**
 * Belize Intelligence Hub — seed content.
 * Self-contained, statically rendered so every post is indexable on deploy
 * (no CMS dependency). Sanity can be layered on later without changing routes.
 * Each post targets one money keyword and links to its booking page.
 */

export interface BlogSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  excerpt: string;
  heroImage: string;
  heroAlt: string;
  author: string;
  publishedAt: string;
  readMins: number;
  category: string;
  relatedTourSlug: string;
  relatedTourLabel: string;
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'deep-sea-fishing-belize-guide',
    title: 'Deep Sea Fishing in Belize: A Private Charter Guide for Ambergris Caye',
    description:
      'What deep sea fishing in Belize is really like from Ambergris Caye — target species, seasons, what is included, and how a private charter with Captain Rene works.',
    keyword: 'deep sea fishing belize',
    excerpt:
      'Blue water starts minutes off Ambergris Caye. Here is how private deep sea fishing in Belize actually works, what you will target, and what a day on the boat includes.',
    heroImage: '/images/tours/deep-sea-fishing.jpg',
    heroAlt: 'Deep sea fishing off Ambergris Caye, Belize',
    author: 'Captain Rene',
    publishedAt: '2026-07-15',
    readMins: 6,
    category: 'Fishing',
    relatedTourSlug: 'deep-sea-fishing',
    relatedTourLabel: 'Deep Sea Fishing Charter',
    sections: [
      {
        paragraphs: [
          'Belize sits on the edge of one of the richest stretches of water in the Caribbean. Off Ambergris Caye, the reef drops fast into blue water, which means the run to real deep sea fishing grounds is short — you spend your day fishing, not commuting. For visitors who only have one day to get it right, that matters more than almost anything else.',
          'This guide covers what deep sea fishing in Belize is actually like on a private charter: what you target, when to come, and what a day with Rene’s Adventures includes.',
        ],
      },
      {
        heading: 'What you are targeting',
        paragraphs: [
          'The exact mix depends on season and conditions, but the blue water off San Pedro regularly holds a strong pelagic lineup. On a typical deep sea day you may be chasing:',
        ],
        bullets: [
          'Mahi-mahi (dorado) — fast, bright, and a favorite for the grill',
          'Wahoo — one of the quickest fish in the ocean, best in the cooler months',
          'Tuna — hard-pulling and reliable through much of the year',
          'Kingfish and barracuda closer to the reef edge',
          'Billfish (sailfish, marlin) on the right day for anglers who want a shot at a trophy',
        ],
      },
      {
        heading: 'When to go',
        paragraphs: [
          'Belize fishes year-round, and Ambergris Caye is protected enough that most days are workable. Wahoo and kingfish tend to show stronger from late fall through winter, while mahi and tuna are more consistent spring into summer. Rather than chase a perfect month, a good captain reads the daily conditions and puts you where the fish are that morning — which is exactly why a local, licensed operator beats a booking-agent lottery.',
        ],
      },
      {
        heading: 'Private beats crowded',
        paragraphs: [
          'A shared charter puts you on someone else’s clock with strangers competing for rod time. A private charter is your day, your boat, and your call. You decide when to leave, how hard to fish, and whether to pull lines early to snorkel or hit a beach. For a family or a couple who traveled a long way for this, that control is the whole point.',
        ],
      },
      {
        heading: 'What is included',
        paragraphs: [
          'Rene’s Adventures runs all-inclusive: fuel, rods, tackle, ice, water, sodas, snacks, rum punch, and fishing licenses are already in the posted price. The boat is fully licensed and insured — not the cash-only, handshake operation you will find at a lot of docks in the region. The price you see is the price you pay, plus tax, service fee, and whatever you decide to tip.',
          'Deep sea charters are designed for up to eight guests, and a beach BBQ can be added so the day ends with your catch cooked on the sand.',
        ],
      },
    ],
  },
  {
    slug: 'blue-hole-belize-tour-guide',
    title: 'The Great Blue Hole, Belize: What a Private Charter Trip Really Involves',
    description:
      'Planning a Blue Hole tour in Belize? Here is the honest picture from Ambergris Caye — distance, what you see, who it suits, and how to arrange a private trip with Captain Rene.',
    keyword: 'blue hole tour belize',
    excerpt:
      'The Great Blue Hole is a UNESCO World Heritage site and a genuine bucket-list run. Here is what a Blue Hole tour from Ambergris Caye actually involves before you book.',
    heroImage: '/images/tours/full-day-ultimate.jpg',
    heroAlt: 'Aerial view of the Great Blue Hole in Belize',
    author: 'Captain Rene',
    publishedAt: '2026-07-12',
    readMins: 5,
    category: 'Adventures',
    relatedTourSlug: 'blue-hole',
    relatedTourLabel: 'Blue Hole Adventure',
    sections: [
      {
        paragraphs: [
          'The Great Blue Hole is the image most people picture when they think of Belize: a perfect dark-blue circle, over 300 meters across, punched into the reef. It is a UNESCO World Heritage site and part of the second-largest barrier reef on earth. Seeing it in person is a genuine bucket-list moment — but it is also a serious run, and it pays to know what you are signing up for.',
        ],
      },
      {
        heading: 'It is farther than people expect',
        paragraphs: [
          'The Blue Hole sits well offshore near Lighthouse Reef, a long way from Ambergris Caye. This is a full-day commitment on open water, weather-dependent, and it is not the trip for someone who wants a relaxed half day close to shore. Because distance and conditions drive everything, Blue Hole trips with Rene’s Adventures are arranged by inquiry rather than instant checkout — so the plan is built around a safe weather window and the right boat, not a calendar slot.',
        ],
      },
      {
        heading: 'What you actually see',
        paragraphs: [
          'The hole itself is famous for its depth and its wall dives, where certified divers drop past ancient stalactites. But you do not have to be a diver to make the trip worth it — the surrounding atolls and reef offer some of the clearest snorkeling water in the country, and the aerial-postcard view over the rim is unforgettable from the surface.',
        ],
      },
      {
        heading: 'Who it suits',
        paragraphs: [
          'This is a trip for travelers who want the signature Belize experience and are comfortable with a long day on the water. If that is you, doing it privately means the itinerary bends to your group — dive, snorkel, or simply take it in — instead of a fixed script shared with a full boat of strangers.',
        ],
      },
      {
        heading: 'How to plan it',
        paragraphs: [
          'Because the Blue Hole depends so heavily on conditions, the best move is to reach out early with your dates. Captain Rene is licensed, insured, and local, and will give you a straight answer about whether the window works — including when it is smarter to save it for another day. Message on WhatsApp or email to start planning.',
        ],
      },
    ],
  },
  {
    slug: 'secret-beach-ambergris-caye-guide',
    title: 'Secret Beach, Ambergris Caye: How to Do It by Private Boat',
    description:
      'Secret Beach on Ambergris Caye, Belize — what it is, why the water is so shallow and calm, and why arriving by private charter beats the golf-cart crowd.',
    keyword: 'secret beach ambergris caye',
    excerpt:
      'Secret Beach is the shallow, calm-water stretch on the west side of Ambergris Caye. Here is why it is worth the trip and how a private boat changes the day entirely.',
    heroImage: '/images/tours/hol-chan-snorkel.jpg',
    heroAlt: 'Calm shallow turquoise water at Secret Beach, Ambergris Caye',
    author: 'Captain Rene',
    publishedAt: '2026-07-08',
    readMins: 5,
    category: 'Beaches',
    relatedTourSlug: 'secret-beach',
    relatedTourLabel: 'Secret Beach Day Charter',
    sections: [
      {
        paragraphs: [
          'Secret Beach is not much of a secret anymore, but it is still one of the best afternoons on Ambergris Caye. On the calm western side of the island, the water is warm, waist-deep a long way out, and glassy — the kind of place you can stand in the sea with a drink for hours. The question is how you get there, because that decides what kind of day you have.',
        ],
      },
      {
        heading: 'Golf cart vs. private boat',
        paragraphs: [
          'Most visitors take the long, bumpy golf-cart road across the island. It works, but it is dusty, slow, and it drops you into the busiest, most crowded stretch of bars. Arriving by private boat flips the day: you cruise over calm water, anchor where you want, swim off the boat, and step onto the sand on your own schedule — no traffic, no parking, no rush to leave.',
        ],
      },
      {
        heading: 'What to do there',
        bullets: [
          'Float in the shallow, protected water — ideal for families and non-swimmers',
          'Pull up to a beach bar for lunch, drinks, and music',
          'Swim, paddle, and relax without reef current to fight',
          'Combine it with a snorkel stop or a sunset run on the way back',
        ],
      },
      {
        heading: 'Why private is the upgrade',
        paragraphs: [
          'A Secret Beach day with Rene’s Adventures is designed for up to eight guests and priced all-inclusive, with a beach BBQ available as an add-on. You control the clock and the route. For a group that wants the postcard water without the cattle-crowd experience, the boat is the difference between a nice afternoon and a great one.',
        ],
      },
    ],
  },
  {
    slug: 'best-sunset-cruise-belize',
    title: 'The Best Sunset Cruise in Belize Is a Private One',
    description:
      'A private sunset cruise in Belize from Ambergris Caye — what the evening looks like, what is included, and why a private boat beats a packed booze-cruise.',
    keyword: 'sunset cruise belize',
    excerpt:
      'The Caribbean sunset off Ambergris Caye is the easiest great decision of your trip. Here is what a private sunset cruise in Belize includes and why it is worth doing right.',
    heroImage: '/images/tours/sunset-cruise.jpg',
    heroAlt: 'Sunset over the Caribbean from a boat off Ambergris Caye, Belize',
    author: 'Captain Rene',
    publishedAt: '2026-07-04',
    readMins: 4,
    category: 'Sunset',
    relatedTourSlug: 'sunset-cruise',
    relatedTourLabel: 'Sunset Cruise',
    sections: [
      {
        paragraphs: [
          'Some experiences you overthink. A sunset cruise in Belize is not one of them. The west-facing side of Ambergris Caye gives you an open Caribbean horizon, calm evening water, and a sky that runs gold to deep pink most nights of the year. Done privately, it is one of the most memorable two and a half hours of a Belize trip.',
        ],
      },
      {
        heading: 'What the evening looks like',
        paragraphs: [
          'You leave in the late afternoon light, cruise out to open water away from the docks, and settle in as the sun drops. There is no schedule to keep and no other groups on board — just your people, the boat, and the horizon. It is equally good as a proposal setting, an anniversary, a family wind-down, or simply the best drink you will have all week.',
        ],
      },
      {
        heading: 'Private vs. the party boat',
        paragraphs: [
          'The big shared sunset cruises pack strangers rail to rail with a loud soundtrack you did not choose. A private sunset cruise with Rene’s Adventures is your boat and your vibe — quiet and romantic, or music and celebration, your call. Water, sodas, snacks, and rum punch are included, and the captain is licensed and insured.',
        ],
      },
      {
        heading: 'Booking it',
        paragraphs: [
          'The sunset cruise runs about two and a half hours and is designed for up to eight guests. Evenings book up, especially in high season, so it is worth locking your date early.',
        ],
      },
    ],
  },
  {
    slug: 'things-to-do-ambergris-caye-by-boat',
    title: 'Things to Do in Ambergris Caye: The Case for a Private Boat Charter',
    description:
      'The best things to do in Ambergris Caye, Belize happen on the water. Here is how a private boat charter with a local captain ties them into one custom day.',
    keyword: 'private boat charter belize',
    excerpt:
      'From Hol Chan to Secret Beach to blue-water fishing, the best of Ambergris Caye is offshore. Here is why a private boat charter is the smartest way to see it.',
    heroImage: '/images/tours/reef-fishing.jpg',
    heroAlt: 'Private boat charter on the water near Ambergris Caye, Belize',
    author: 'Captain Rene',
    publishedAt: '2026-07-01',
    readMins: 6,
    category: 'Guides',
    relatedTourSlug: 'custom-charter',
    relatedTourLabel: 'Custom Charter',
    sections: [
      {
        paragraphs: [
          'Ambergris Caye is Belize’s largest island and the jump-off point for most of the country’s best water. You can fill a week here, but the experiences people remember almost all happen offshore. The smartest way to string them together is not to book five separate tours — it is one private boat charter with a captain who knows the island.',
        ],
      },
      {
        heading: 'The water is the attraction',
        bullets: [
          'Hol Chan Marine Reserve — sharks, rays, turtles, and reef in protected water',
          'Secret Beach — shallow, calm, drink-in-the-sea afternoons on the west side',
          'Deep sea fishing — mahi, tuna, and wahoo minutes off the reef edge',
          'The Great Blue Hole — the bucket-list UNESCO run for a full day',
          'Sunset cruises, snorkeling, and beach BBQs to close the day',
        ],
      },
      {
        heading: 'Why one private charter beats five tours',
        paragraphs: [
          'Booking individual group tours means five schedules, five crowds, and five compromises. A custom private charter is built around your group: you tell the captain what you care about — fishing, snorkeling, beach time, photos — and the day is shaped to fit. No fixed itinerary, no other guests, and you control the clock start to finish.',
          'This is the trip for the traveler who does not want their one week in Belize wasted on a generic cattle-boat tour.',
        ],
      },
      {
        heading: 'Local, licensed, all-inclusive',
        paragraphs: [
          'Rene’s Adventures is run by Captain Rene, a local with 25 years on this water, and the operation is fully licensed and insured. Charters are priced all-inclusive — fuel, gear, ice, drinks, and licenses in the posted price — and designed for up to eight guests. Tell us what your ideal day looks like and we will build the charter around it.',
        ],
      },
    ],
  },
];

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((p) => p.slug === slug);

export const allPostSlugs = (): string[] => blogPosts.map((p) => p.slug);
