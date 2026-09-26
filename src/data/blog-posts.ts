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
  {
    slug: 'reef-fishing-belize-ambergris-caye-guide',
    title: "Reef Fishing in Belize: The Half-Day Charter Beginners and Families Actually Want",
    description:
      "What reef fishing off Ambergris Caye is really like — target species, why it suits beginners and kids, what a half day and full day cost, and how to book with Captain Rene.",
    keyword: 'reef fishing belize',
    excerpt:
      "Reef fishing off Ambergris Caye is calmer, closer, and more forgiving than a deep sea run — and often the better call for families and first-timers. Here is what to expect.",
    heroImage: '/images/tours/reef-fishing.jpg',
    heroAlt: "Reef fishing charter off Ambergris Caye, Belize",
    author: 'Captain Rene',
    publishedAt: '2026-07-20',
    readMins: 5,
    category: 'Fishing',
    relatedTourSlug: 'reef-fishing',
    relatedTourLabel: "Reef Fishing Charter",
    sections: [
      {
        paragraphs: [
          "Not every fishing day needs to be a two-hour run into open blue water. The reef system that runs the length of Ambergris Caye sits minutes from the dock, and it holds a fishery of its own — one that is generally calmer, more forgiving of a rough stomach, and a lot easier on kids and first-time anglers than a deep sea trip.",
          "This guide covers what reef fishing off Ambergris Caye actually involves, who it suits, and what it costs with Rene’s Adventures.",
        ],
      },
      {
        heading: "What you are catching",
        paragraphs: [
          "Reef fishing here means working structure close to shore — snapper, grouper, jacks, and barracuda are the regulars, with the occasional kingfish running the edges. It is light-tackle fishing, less about the trophy fight and more about steady action, which is exactly why it works so well for a mixed group of skill levels.",
        ],
      },
      {
        heading: "Why it suits beginners and families",
        paragraphs: [
          "Calmer water means less time spent fighting seasickness and more time with a rod in hand. Kids can reel in a real fish without needing the arm strength for a wahoo or a marlin, and someone who has never fished before gets coached through it rather than left to figure it out mid-fight. It is the trip we recommend most often for a family with a mixed range of ages.",
        ],
      },
      {
        heading: "Half day or full day",
        paragraphs: [
          "A half day (4 hours) runs $400 and covers up to 4 guests, with additional guests at $75 each up to a maximum of 8. A full day (8 hours) runs $600 and gives you time to work multiple reef sections, chase a moving school, or pull lines early to snorkel a spot along the way — a reef trip pairs naturally with a stop at Hol Chan or Shark Ray Alley if your group wants to add it.",
        ],
      },
      {
        heading: "Booking it",
        paragraphs: [
          "Every charter with Rene’s Adventures is private — your boat, your group, no strangers splitting rod time. Pricing is all-inclusive: fuel, tackle, ice, and licenses in the posted rate. Message on WhatsApp or check availability on the Reef Fishing page to get a date locked in.",
        ],
      },
    ],
  },

  {
    slug: 'belize-boat-charter-cost-guide',
    title: "How Much Does a Private Boat Charter Cost in Belize? A Straight Answer",
    description:
      "Real prices for private boat charters out of Ambergris Caye, Belize — deep sea fishing, reef fishing, sunset cruises, Secret Beach, and custom adventures, with what is actually included.",
    keyword: 'belize boat charter cost',
    excerpt:
      "Charter pricing in Belize is rarely posted in plain numbers. Here is what a private boat charter out of Ambergris Caye actually costs, tour by tour, and what is included at that price.",
    heroImage: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/vacation-and-leisure-aerial-view-on-fast-boats-on-2025-03-05-01-56-50-utc.jpg',
    heroAlt: "Private charter boats on the water off Ambergris Caye, Belize",
    author: 'Captain Rene',
    publishedAt: '2026-07-25',
    readMins: 6,
    category: 'Guides',
    relatedTourSlug: 'custom-charter',
    relatedTourLabel: "Rene's Custom Adventures",
    sections: [
      {
        paragraphs: [
          "Most charter operators in Belize make you ask before you get a number, and the range you hear back can vary wildly depending on who you talk to. Here is a straight, tour-by-tour breakdown of what a private charter costs with Rene’s Adventures out of San Pedro, Ambergris Caye, and what that price actually covers.",
        ],
      },
      {
        heading: "The pricing model",
        paragraphs: [
          "Every charter is private — it is your boat and your group, not a shared seat on someone else's schedule. Prices are all-inclusive: fuel, gear, ice, drinks, and licenses are built into the posted rate rather than added on afterward. Each tour is priced for up to 4 guests included, with additional guests at $75 per person up to a maximum of 8 total.",
        ],
      },
      {
        heading: "Tour-by-tour pricing",
        bullets: [
          "Deep Sea Fishing — $600 half day (4 hours), $900 full day (8 hours)",
          "Reef Fishing — $400 half day (4 hours), $600 full day (8 hours)",
          "Secret Beach — $400 half day (4 hours), $600 full day (8 hours)",
          "Custom Charter (Rene's Custom Adventures) — $400 half day (4 hours), $675 full day (8 hours)",
          "Sunset Cruise — $350 for a 2.5-hour cruise",
          "Great Blue Hole — by inquiry only; distance and weather windows mean this one is quoted per trip, not posted as a flat rate",
        ],
      },
      {
        heading: "Why some tours are quoted, not listed",
        paragraphs: [
          "The Blue Hole is the one exception to a posted price. It is a long, weather-dependent run to Lighthouse Reef, and the right call on any given week depends on conditions on the water that day — so it is planned by direct message rather than instant checkout, to make sure the day actually happens the way it should.",
        ],
      },
      {
        heading: "Getting an exact quote",
        paragraphs: [
          "Group size, tour choice, and half day versus full day are what move the number from there. Message on WhatsApp with your dates and group size and you will get a straight quote back — no upsell script, just what it actually costs for your day on the water.",
        ],
      },
    ],
  },

  {
    slug: 'shark-ray-alley-hol-chan-snorkeling-guide',
    title: "Shark Ray Alley and Hol Chan: What Snorkeling with Nurse Sharks Is Really Like",
    description:
      "What to expect snorkeling Shark Ray Alley and the Hol Chan Marine Reserve off Ambergris Caye, Belize — the nurse sharks, the stingrays, and how to add it to a private charter.",
    keyword: 'shark ray alley belize',
    excerpt:
      "Nurse sharks and stingrays circling in four feet of clear water, ten minutes from San Pedro. Here is what Shark Ray Alley and Hol Chan are actually like, and who they are for.",
    heroImage: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/person-snorgles-under-a-group-of-fish-in-the-vast-2025-02-03-23-16-18-utc.jpg',
    heroAlt: "Snorkeler surrounded by fish near Hol Chan Marine Reserve, Belize",
    author: 'Captain Rene',
    publishedAt: '2026-07-30',
    readMins: 5,
    category: 'Adventures',
    relatedTourSlug: 'custom-charter',
    relatedTourLabel: "Rene's Custom Adventures",
    sections: [
      {
        paragraphs: [
          "Ten minutes off San Pedro, inside the Hol Chan Marine Reserve, there is a patch of sandy bottom in about four feet of water where dozens of nurse sharks and southern stingrays circle almost constantly. It is called Shark Ray Alley, and it is one of the most talked-about snorkel stops in Belize — for good reason.",
        ],
      },
      {
        heading: "Why the animals are there",
        paragraphs: [
          "Fishermen used to clean their catch here and toss the scraps overboard. The nurse sharks and stingrays learned exactly where the free meal was, and generations later, they still show up. It means the encounter is reliable — this is not a lucky sighting, it is a near-guarantee on a normal day.",
        ],
      },
      {
        heading: "What it actually feels like",
        paragraphs: [
          "Nurse sharks are bottom feeders — slow, docile, and mostly indifferent to swimmers, though they will brush past your legs or pass directly underneath you. First-timers usually grip the boat ladder for the first minute and then let go once they realize nothing is coming for them. The stingrays are more active and will approach quickly, used to being hand-fed here for years.",
        ],
      },
      {
        heading: "Do you need to be a strong swimmer",
        paragraphs: [
          "No. The water is shallow, calm, and clear, and a life vest or pool noodle works fine if you are not confident in open water. It is a good stop for a mixed group — nervous swimmers can stay near the boat while the confident ones drop in for a closer look.",
        ],
      },
      {
        heading: "How to add it to your day",
        paragraphs: [
          "Shark Ray Alley and the wider Hol Chan reef sit close enough to San Pedro that they slot naturally into a custom charter alongside fishing, a beach stop, or a sunset run — it is one of the activities Captain Rene builds into Rene's Custom Adventures rather than a standalone booking. Tell us you want it in the itinerary and it gets built into the day.",
        ],
      },
    ],
  },

  {
    slug: 'best-time-to-visit-ambergris-caye',
    title: "Best Time to Visit Ambergris Caye, Belize (By Month and By Activity)",
    description:
      "When to visit Ambergris Caye, Belize for the best weather, fishing seasons, and calmest water — a month-by-month guide from a local charter captain.",
    keyword: 'best time to visit ambergris caye',
    excerpt:
      "Belize does not have a bad season so much as it has different seasons for different reasons. Here is when to come depending on what you actually want out of the trip.",
    heroImage: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/tropical-beach-in-belize-clear-blue-water-and-pal-2025-10-28-21-19-01-utc.jpg',
    heroAlt: "Clear turquoise water and palm trees on Ambergris Caye, Belize",
    author: 'Captain Rene',
    publishedAt: '2026-08-04',
    readMins: 6,
    category: 'Guides',
    relatedTourSlug: 'custom-charter',
    relatedTourLabel: "Rene's Custom Adventures",
    sections: [
      {
        paragraphs: [
          "Belize gets asked about its \"best\" season more than almost any other question, and the honest answer is that it depends on what you are optimizing for. Ambergris Caye sees roughly 300 sunny days a year, so weather alone rarely rules a trip out — but fishing runs, water clarity, and crowd levels do shift through the year.",
        ],
      },
      {
        heading: "Late fall to spring (November–April)",
        paragraphs: [
          "This is Belize's dry season, and it is the most popular stretch for a reason — lower humidity, minimal rain, and generally calmer seas for open-water runs like the Blue Hole. Wahoo and kingfish also tend to show stronger through the cooler months, which makes late fall through winter a strong window for anglers chasing those species specifically.",
        ],
      },
      {
        heading: "Late spring to summer (May–August)",
        paragraphs: [
          "This is Belize's wet season, though \"wet\" mostly means short afternoon showers rather than washed-out days — mornings are typically clear. Mahi-mahi and tuna fishing tends to pick up through this stretch, and lobster season opens June 15th, which means fresh lobster shows up on every menu in San Pedro through the summer.",
        ],
      },
      {
        heading: "Hurricane season (June–November)",
        paragraphs: [
          "Worth knowing rather than worrying over: this window overlaps with the wet season, and while direct hits on Ambergris Caye are uncommon, it is the reason a smart operator plans around conditions rather than a fixed calendar — especially for a long-distance run like the Blue Hole.",
        ],
      },
      {
        heading: "The honest recommendation",
        paragraphs: [
          "If flexibility matters more than anything else, December through April gives you the calmest, driest run of days. If you are chasing lobster season or a specific fish, let the season drive the date instead. Either way, book the water-dependent trips — Blue Hole especially — with some flexibility built in, and a local captain will steer you around a bad window rather than force it.",
        ],
      },
    ],
  },

  {
    slug: 'caye-caulker-day-trip-from-san-pedro',
    title: "Caye Caulker Day Trip from San Pedro: Is It Worth the Boat Ride?",
    description:
      "Thinking about a Caye Caulker day trip from San Pedro, Ambergris Caye? Here is what the island is actually like, how long the ride takes, and whether it is worth adding to your charter.",
    keyword: 'caye caulker day trip from san pedro',
    excerpt:
      "Caye Caulker runs on one rule — Go Slow — and it is close enough to San Pedro to fold into a single day. Here is whether it is worth the ride.",
    heroImage: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/buildings-of-caye-caulker-belize-tropical-beach-2025-10-16-05-19-14-utc.jpg',
    heroAlt: "Colorful waterfront buildings on Caye Caulker, Belize",
    author: 'Captain Rene',
    publishedAt: '2026-08-09',
    readMins: 5,
    category: 'Islands',
    relatedTourSlug: 'custom-charter',
    relatedTourLabel: "Rene's Custom Adventures",
    sections: [
      {
        paragraphs: [
          "Caye Caulker sits a short run south of Ambergris Caye, and it has a completely different pace — no cars, no traffic, and a hand-painted sign at the dock that just says \"Go Slow.\" People ask fairly often whether it is worth folding into a day trip from San Pedro. Short answer: usually yes, if you know what you are actually going for.",
        ],
      },
      {
        heading: "What the island is like",
        paragraphs: [
          "The whole island is about half a mile wide — you can walk from the Caribbean side to the lagoon side in a few minutes. There are no resorts crowding the shoreline, just barefoot bars, reggae from somewhere you can't quite locate, and a channel called The Split where most visitors spend their afternoon floating in warm, gentle current.",
        ],
      },
      {
        heading: "How long the trip actually takes",
        paragraphs: [
          "By private boat from San Pedro, the run to Caye Caulker is short enough to make it a half-day add-on rather than a trip that eats your whole itinerary — which is the advantage of doing it privately instead of on a scheduled water taxi that runs its own timetable.",
        ],
      },
      {
        heading: "Who it is worth it for",
        paragraphs: [
          "If you want a slower, more local feel than San Pedro's main strip, or you simply want to say you've swum at The Split, it is worth the ride. If your priority is fishing time or a full day on the Blue Hole, it competes for the same hours and is easier to save for a separate trip.",
        ],
      },
      {
        heading: "Booking it as part of a custom day",
        paragraphs: [
          "Because it is close and low-key, Caye Caulker fits naturally into a custom charter — a stop on the way to or from another activity, rather than the whole day. Mention it when you reach out and Captain Rene will tell you honestly whether it fits your itinerary or deserves its own trip.",
        ],
      },
    ],
  },

  {
    slug: 'belize-lobster-season-guide',
    title: "Belize Lobster Season: When It Runs and How to Eat It Straight Off the Reef",
    description:
      "When Belize lobster season opens and closes, what makes it different from other Caribbean seasons, and how to plan a charter around it out of Ambergris Caye.",
    keyword: 'lobster season belize',
    excerpt:
      "From June 15th to February 14th, fresh lobster runs the menu in San Pedro. Here is when the season opens, why the dates matter, and how to time a trip around it.",
    heroImage: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/tasty-prepared-lobsters-and-jumbo-shrimps-2024-10-13-09-11-27-utc.jpg',
    heroAlt: "Freshly grilled Caribbean lobster in Belize",
    author: 'Captain Rene',
    publishedAt: '2026-08-14',
    readMins: 5,
    category: 'Guides',
    relatedTourSlug: 'custom-charter',
    relatedTourLabel: "Rene's Custom Adventures",
    sections: [
      {
        paragraphs: [
          "Every year on June 15th, a buzzer sounds and the whole island of Ambergris Caye goes into the water. Lobster season has opened, and every captain, diver, and fisherman on the island knows the date the way other people know their own birthday.",
        ],
      },
      {
        heading: "The dates that matter",
        paragraphs: [
          "Belize's lobster season runs from June 15th through February 14th — Valentine's Day — when it closes to protect the breeding stock through the spring and early summer. That closing date is not arbitrary; it is what keeps the reef's lobster population healthy enough for the season to reopen strong the following June.",
        ],
      },
      {
        heading: "How it is caught",
        paragraphs: [
          "The Caribbean spiny lobster has no claws — all the meat is in the tail — and it lives in the crevices of the reef system. Local fishermen and divers work the reef by hand using snares and tickle sticks rather than traps, which is skilled, physical work. Knowing exactly where to look is what separates an average lobster day from a great one.",
        ],
      },
      {
        heading: "Why the timing matters for your trip",
        paragraphs: [
          "If eating fresh, reef-to-table lobster is part of why you're coming to Belize, timing your visit anywhere between June and February puts it on nearly every menu in San Pedro — grilled with butter and lime, in a ceviche, or split and charred on a beach BBQ alongside conch and snapper.",
        ],
      },
      {
        heading: "Building it into a charter",
        paragraphs: [
          "A custom charter during the season can include a beach BBQ stop where the catch of the day — lobster included, depending on availability — ends up on the grill. Mention that you're visiting during the season when you reach out and Captain Rene will build the day around it.",
        ],
      },
    ],
  },

  {
    slug: 'how-to-get-to-ambergris-caye-belize',
    title: "How to Get to Ambergris Caye, Belize: Flights, Water Taxis, and What to Book First",
    description:
      "The actual routes to Ambergris Caye, Belize from Belize City — domestic flights versus water taxi — and what to book before you arrive so your first day on the water isn't wasted.",
    keyword: 'how to get to ambergris caye',
    excerpt:
      "There are two real ways to reach Ambergris Caye from the mainland — a short flight or a water taxi. Here is how each works and what to line up in advance.",
    heroImage: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/unrecognizable-person-driving-a-motorboat-along-th-2025-01-08-23-19-45-utc.jpg',
    heroAlt: "Boat traveling along the coast near Ambergris Caye, Belize",
    author: 'Captain Rene',
    publishedAt: '2026-08-20',
    readMins: 6,
    category: 'Guides',
    relatedTourSlug: 'custom-charter',
    relatedTourLabel: "Rene's Custom Adventures",
    sections: [
      {
        paragraphs: [
          "Ambergris Caye is an island, so however you arrive in Belize, the last leg of the trip is either by air or by water. Both routes are straightforward once you know which one fits your itinerary — here is how each actually works.",
        ],
      },
      {
        heading: "By domestic flight",
        paragraphs: [
          "From the international airport near Belize City, small domestic carriers run frequent short hops to San Pedro's airstrip — the flight itself is around 15 to 20 minutes and gives you a low-altitude look at the reef on the way in. This is the faster option and the one most visitors choose when time on the island matters more than the cost difference.",
        ],
      },
      {
        heading: "By water taxi",
        paragraphs: [
          "Water taxis run from Belize City's water taxi terminals to San Pedro, generally taking somewhere around an hour and a half depending on stops along the way. It costs less than flying and comes with its own scenery, though it is a longer, sometimes choppier ride than a flight.",
        ],
      },
      {
        heading: "What to book before you land",
        paragraphs: [
          "The one thing worth arranging ahead of time is anything weather-dependent — the Blue Hole especially, since it needs a safe window and sometimes a specific day works better than another. Reaching out before you arrive means your captain can look at the forecast for your actual travel dates and tell you honestly which day to protect for it.",
        ],
      },
      {
        heading: "Once you're on the island",
        paragraphs: [
          "San Pedro itself is compact and walkable, with golf carts as the main local transport. From there, everything on the water — fishing, the Blue Hole, Secret Beach, a sunset cruise — starts at the dock, which is why most of the planning that actually matters happens before you land, not after.",
        ],
      },
    ],
  },

  {
    slug: 'belize-honeymoon-boat-charter-guide',
    title: "Planning a Belize Honeymoon? Here's Where a Private Boat Charter Fits In",
    description:
      "How a private boat charter fits into a Belize honeymoon — sunset cruises, secluded beach stops, and how to plan a private day on the water around Ambergris Caye.",
    keyword: 'belize honeymoon boat charter',
    excerpt:
      "A honeymoon in Belize usually means a resort and a beach — a private charter is the part that turns one afternoon into the story you tell for years.",
    heroImage: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/Champaign-Glass-sunset.jpg',
    heroAlt: "Champagne glass at sunset on a private charter in Belize",
    author: 'Captain Rene',
    publishedAt: '2026-08-26',
    readMins: 5,
    category: 'Romance',
    relatedTourSlug: 'sunset-cruise',
    relatedTourLabel: "Sunset Cruise",
    sections: [
      {
        paragraphs: [
          "Most Belize honeymoon planning goes toward the resort and the beach, and both matter — but the part that ends up in the wedding album is usually the afternoon spent alone on the water, away from the pool crowd and the buffet line.",
        ],
      },
      {
        heading: "Why a private charter works for a honeymoon",
        paragraphs: [
          "It is your boat and nobody else's. No shared sunset cruise with a dozen other couples angling for the same photo — just the two of you, the crew, and the water. That privacy is the entire value for a couple who traveled a long way for exactly this kind of afternoon.",
        ],
      },
      {
        heading: "The sunset cruise",
        paragraphs: [
          "At 6pm, the sky over Belize turns gold and crimson in a way that photographs well and lingers even better in memory. A 2.5-hour private sunset cruise gives you that window without an agenda attached — drink in hand, no itinerary to keep, just the two of you and the crew keeping a respectful distance.",
        ],
      },
      {
        heading: "Building a full day around it",
        paragraphs: [
          "Couples who want more than a sunset often build a custom day around it — a stop at Secret Beach in the afternoon, a quiet snorkel at Hol Chan, then easing into the sunset run as the day winds down. It is entirely built around your pace, not a fixed script.",
        ],
      },
      {
        heading: "Planning ahead",
        paragraphs: [
          "If a proposal or an anniversary moment is part of the plan, say so when you reach out — a private boat gives you room to make it happen without an audience, and Captain Rene will work the timing around the light and the tide rather than a rigid slot.",
        ],
      },
    ],
  },

  {
    slug: 'family-friendly-boat-tours-ambergris-caye',
    title: "Family-Friendly Boat Tours in Ambergris Caye: What Actually Works With Kids",
    description:
      "Which boat tours in Ambergris Caye, Belize actually work for families with kids — calm water options, realistic trip lengths, and how to build a day that works for every age.",
    keyword: 'family boat tour belize',
    excerpt:
      "Not every Belize tour works with kids on board. Here is which ones actually do, and how a private charter adapts the day around the youngest person in your group.",
    heroImage: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/children-a-boy-and-a-girl-swim-near-the-shore-in-a-2025-10-15-03-34-43-utc.jpg',
    heroAlt: "Children swimming near the shore on a family beach trip in Belize",
    author: 'Captain Rene',
    publishedAt: '2026-09-02',
    readMins: 5,
    category: 'Family',
    relatedTourSlug: 'secret-beach',
    relatedTourLabel: "Secret Beach",
    sections: [
      {
        paragraphs: [
          "A boat trip with kids lives or dies on a few practical things — how rough the water is, how long everyone has to sit still, and whether there's something to actually do besides watch the horizon. Some Belize tours handle this well. Others do not.",
        ],
      },
      {
        heading: "What works: Secret Beach",
        paragraphs: [
          "Secret Beach is shallow enough to walk a hundred meters out and still stand chest-deep, which makes it close to foolproof for kids who aren't strong swimmers yet. There's sand to dig in, calm water to splash in, and none of the open-ocean swell that turns a long boat ride into a rough one.",
        ],
      },
      {
        heading: "What works: reef fishing",
        paragraphs: [
          "Reef fishing stays close to shore in calmer water, and a half day (4 hours) is usually the right length before attention spans wear out. Kids get to reel in a real fish without needing the stamina for a deep sea fight, and the crew coaches them through it rather than leaving them to figure it out.",
        ],
      },
      {
        heading: "What to think twice about",
        paragraphs: [
          "The Blue Hole is a long, open-water run that suits older kids and adults who are comfortable with a full day on the boat — it is usually not the first trip to book with younger children. Deep sea fishing's full-day option can also be a long stretch for a shorter attention span, though a half day works fine.",
        ],
      },
      {
        heading: "Building your family's day",
        paragraphs: [
          "Because every charter with Rene's Adventures is private, the day bends around your family instead of a fixed script shared with strangers — shorter stretches on the water, more time in the shallows, snacks and breaks whenever they're needed. Tell us the ages in your group and the itinerary gets built around them.",
        ],
      },
    ],
  },

  {
    slug: 'maya-ruins-day-trip-ambergris-caye',
    title: "Maya Ruins Day Trip from Ambergris Caye: What to Know Before You Book",
    description:
      "Planning a Maya ruins day trip from Ambergris Caye, Belize? Here is what the trip involves, how it connects to the mainland, and how to weigh it against a day on the water.",
    keyword: 'maya ruins day trip belize',
    excerpt:
      "Belize has more Maya archaeological sites per square mile than almost anywhere on earth. Here is what a day trip from Ambergris Caye to see them actually involves.",
    heroImage: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/adventure-in-the-yucatan-2024-09-13-23-43-13-utc.jpg',
    heroAlt: "Jungle and ruins landscape near the Yucatan and Belize border",
    author: 'Captain Rene',
    publishedAt: '2026-09-10',
    readMins: 5,
    category: 'Adventures',
    relatedTourSlug: 'custom-charter',
    relatedTourLabel: "Rene's Custom Adventures",
    sections: [
      {
        paragraphs: [
          "Belize has more known Maya archaeological sites per square mile than any other country on earth — over 600 of them, with researchers estimating that number represents only a fraction of what is still buried under the jungle. A fair number of visitors staying on Ambergris Caye don't realize a day trip to see them is even on the table.",
        ],
      },
      {
        heading: "Getting from the island to the mainland",
        paragraphs: [
          "Because Ambergris Caye is an island, a Maya ruins day trip means a mainland transfer first — by boat and ground transport, or a short domestic flight connection — before you reach a site. It is a longer day than staying on the water, which is the main trade-off to weigh going in.",
        ],
      },
      {
        heading: "What you're actually seeing",
        paragraphs: [
          "Sites like Xunantunich sit on a ridge with carved friezes still visible after a thousand years, while Lamanai — meaning \"submerged crocodile\" — has been continuously occupied for 3,000 years. The Maya never disappeared from Belize; over 30,000 Maya people still live in the country today, and many of the guides at these sites are descendants of the civilization that built them.",
        ],
      },
      {
        heading: "Is it worth giving up a day on the water for",
        paragraphs: [
          "Most people come to Ambergris Caye for the reef, and that's the right call for most of a trip. But travelers who add one inland day almost always say the same thing afterward — it recontextualizes everything else they saw, and the ruins are more present and less like a museum exhibit than they expected.",
        ],
      },
      {
        heading: "Planning it around your charter days",
        paragraphs: [
          "Because it's a full mainland day, it is worth planning around your fishing and Blue Hole days rather than squeezing it in as an afterthought. Mention it when you reach out about your custom charter and Captain Rene can help you sequence the week so neither the ruins nor the reef gets shortchanged.",
        ],
      },
    ],
  },
];

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((p) => p.slug === slug);

export const allPostSlugs = (): string[] => blogPosts.map((p) => p.slug);
