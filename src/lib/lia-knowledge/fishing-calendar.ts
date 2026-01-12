export type CalendarMonthPrimarySpecies = {
  flats_inshore: string[];
  reef: string[];
  offshore_pelagic: string[];
};

export type CalendarMonthWindConditions = {
  dominant_winds: string;
  effects_on_fishing: string[];
};

export type CalendarMonthHolidays = {
  major_holidays_events: string[];
  impact_on_boat_tours: string[];
};

export type CalendarMonth = {
  month: string;
  primary_species: CalendarMonthPrimarySpecies;
  wind_conditions_and_tour_locations: CalendarMonthWindConditions;
  holidays_and_availability: CalendarMonthHolidays;
};

export type FishingCalendarDataset = {
  location: string;
  notes: {
    general: string;
    winds: {
      trade_winds: string;
      northers: string;
    };
    holidays: string;
  };
  months: CalendarMonth[];
};

export type SeasonalFishingIntel = {
  month: number;
  monthName: string;
  primary_species: string;
  effects_on_fishing: string[];
  wind_conditions_and_tour_locations: string;
  notes: string[];
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AMBERGRIS_CAYE_FISHING_CALENDAR: FishingCalendarDataset = {
  location: 'Ambergris Caye, Belize',
  notes: {
    general:
      'Gamefish such as tarpon, bonefish, permit, snapper, grouper, wahoo, and mahi mahi are present year‑round around Ambergris Caye, with different months offering stronger conditions for each species.',
    winds: {
      trade_winds:
        'A generally southeasterly trade wind regime dominates most of the year in coastal Belize, providing steady but sometimes brisk winds that make east‑facing (windward) reef flats choppy while keeping leeward lagoons comparatively sheltered.',
      northers:
        '‘Northers’ are cool‑season cold fronts that bring strong north or northwest winds, cooler air, rain, and very unsettled seas on exposed flats and reef, most common from mid‑December through mid‑February but possible from late November into March.',
    },
    holidays:
      'Belize has several national public holidays and local festivals—such as New Year’s Day, Easter, Labor Day, September celebrations, Garifuna Settlement Day, and Christmas—that can increase demand for boats or cause some operators to reduce or pause service.',
  },
  months: [
    {
      month: 'January',
      primary_species: {
        flats_inshore: [
          'Bonefish – good; consistent year‑round with many fish on accessible turtle‑grass and sand flats around Ambergris.',
          'Permit – fair to good; productive on new and full‑moon tides, though cold fronts can reduce shallow activity.',
          'Resident tarpon (20–90 lb) – present but highly weather‑dependent; better during warm, calm periods between fronts.',
          'Snook – often excellent in mangrove creeks and protected lagoons in cooler months.',
        ],
        reef: [
          'Snapper (various species) – very good, year‑round staples on inside‑reef and patch‑reef structure.',
          'Grouper – very good for some species in December–January, noting local closed seasons around spawning sites.',
          'Barracuda, jacks, mackerel – common along reef edges and channel mouths.',
        ],
        offshore_pelagic: [
          'Wahoo – excellent winter target just outside the barrier reef.',
          'Mahi Mahi – present; some calendars rate Jan–Apr as a good window though peak often comes later.',
          'Tuna species – available on offshore humps and drop‑offs when conditions allow.',
        ],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'One of the windiest months due to frequent ‘northers’; strong north to northeast winds can exceed 20–25 knots during frontal events, alternating with calmer trade‑wind days.',
        effects_on_fishing: [
          'Northers cool and sometimes blow water off the shallow flats, making sight‑fishing to permit and tarpon challenging and pushing fish deeper.',
          'Guides often shift to leeward (west‑side) mangrove lagoons and creek systems for bonefish, snook, and resident tarpon when the east reef is too rough.',
          'Reef trips typically focus inside the barrier reef or in more protected cuts rather than the fully exposed outer edge when swell is high.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'New Year’s Day – January 1, national public holiday.',
          'Local New Year’s parties and occasional coastal events or regattas in tourist hubs such as San Pedro.',
        ],
        impact_on_boat_tours: [
          'High holiday tourism around New Year drives strong demand for fishing and reef charters; prime guides can book out early.',
          'Some captains reduce or skip departures on January 1 for family time or after late‑night celebrations, especially early‑morning trips.',
        ],
      },
    },
    {
      month: 'February',
      primary_species: {
        flats_inshore: [
          'Bonefish – consistent on most calm days with good numbers on both windward and leeward flats.',
          'Permit – good on strong tide cycles; still sensitive to cold fronts but improving later in the month.',
          'Resident tarpon – available; activity improves on warming trends between fronts.',
        ],
        reef: [
          'Snapper and grouper – remain strong through the dry‑season transition.',
          'Barracuda, jacks, mackerel – reliable action along reef ledges and channels.',
        ],
        offshore_pelagic: [
          'Wahoo – still excellent late‑winter target.',
          'Mahi Mahi – fair to good; caught incidentally while targeting wahoo and tuna.',
        ],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'Mix of lingering northers and returning southeast trades; high‑wind periods are common but generally shorter than in January.',
        effects_on_fishing: [
          'On calmer trade‑wind spells, east‑side reef flats north and south of San Pedro fish well for bonefish and permit.',
          'During windy frontal periods, guides favor the ‘back side’ of the island—mangroves and lagoons—to avoid heavy chop and to target snook and small tarpon.',
          'Offshore wahoo trips are timed around days with manageable swell to allow safe crossings of reef cuts.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'San Pedro Carnaval – late February or early March, multi‑day island carnival with paint, parades, and street parties.',
          'National Heroes and Benefactors Day (Baron Bliss) is officially in March but sometimes associated with late‑February events.',
        ],
        impact_on_boat_tours: [
          'Carnaval brings increased domestic and regional visitors, raising last‑minute demand for reef and party‑style boat trips.',
          'Some downtown access can be disrupted by parades, but most fishing departures continue as normal from docks north and south of town.',
        ],
      },
    },
    {
      month: 'March',
      primary_species: {
        flats_inshore: [
          'Bonefish – very consistent with good visibility on clear days.',
          'Permit – often excellent; many operators consider March the start of a six‑month prime window for permit.',
          'Tarpon (20–90 lb) – increasingly common on reef channels and inside lagoons as water warms.',
          'Snook – still available in cooler backwaters and mangrove creeks.',
        ],
        reef: [
          'Snapper, grouper, barracuda, jacks – strong mixed‑bag reef fishing.',
          'Reef predators become more consistent as weather stabilizes.',
        ],
        offshore_pelagic: [
          'Wahoo – good early in the month.',
          'Mahi Mahi, tuna, and occasional sailfish on quality blue‑water days.',
        ],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'Northers taper; southeasterly trades become dominant, though March can still be breezy.',
        effects_on_fishing: [
          'Steady trades allow regular runs along the windward reef for bonefish, permit, and tarpon, with poling skiffs over turtle‑grass flats.',
          'Higher winds can make open‑water reef sections rough, so guides may tuck behind cayes or focus on leeward shorelines when gusts exceed about 20 knots.',
          'Clear, stable conditions favor sight‑fishing, but chop from strong trades can reduce visibility, pushing more anglers toward wadeable flats.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'National Heroes and Benefactors Day (Baron Bliss Day) – March 9, national public holiday with regattas and coastal events.',
          'La Ruta Maya Belize River Challenge – early March multi‑day canoe race on the mainland.',
        ],
        impact_on_boat_tours: [
          'Peak North American spring‑break season boosts demand for day trips and family‑friendly reef fishing.',
          'Baron Bliss regattas may briefly increase local boat use, but Ambergris fishing operations mostly run normally, sometimes offering special viewing trips.',
        ],
      },
    },
    {
      month: 'April',
      primary_species: {
        flats_inshore: [
          'Bonefish – excellent; large schools across many flats.',
          'Permit – often outstanding; aggressive feeding behavior around strong tide cycles.',
          'Tarpon (40–100 lb) – major migratory push begins with big fish moving onto reef channels and nearby flats.',
        ],
        reef: [
          'Snapper and grouper – very good; April is another strong month for certain grouper species subject to local closures.',
          'Barracuda, jacks, mackerel – active along current‑swept reef cuts.',
        ],
        offshore_pelagic: [
          'Sailfish – more regular encounters as blue water stabilizes offshore.',
          'Mahi Mahi and wahoo – both possible; mahi mahi activity builds toward early‑summer peaks.',
        ],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'Generally stable trade‑wind period with moderate seas and predictable tides.',
        effects_on_fishing: [
          'Excellent conditions for longer reef‑line runs and full‑day combos (flats in the morning, reef or offshore in the afternoon).',
          'Leeward lagoons stay productive but many anglers prioritize clear, windward flats when trades are moderate and stable.',
          'Offshore sailfish and mahi mahi trips are popular due to comfortable sea states and clearer blue water.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'Easter period (Good Friday, Holy Saturday, Easter Sunday, Easter Monday) – major 4‑day national holiday; dates vary March–April.',
          'Local Holy Week religious observances and beach events in coastal communities.',
        ],
        impact_on_boat_tours: [
          'Easter week is one of the busiest tourism periods, so fishing and snorkel trips book out early, especially in San Pedro.',
          'Some captains operate reduced hours or avoid Good Friday trips, while others run at full capacity; policy varies by operator.',
        ],
      },
    },
    {
      month: 'May',
      primary_species: {
        flats_inshore: [
          'Tarpon – peak season underway; strong numbers of big migratory fish on both reef and flats.',
          'Bonefish – excellent with large, willing schools.',
          'Permit – very good; many calendars highlight March–May as ‘excellent’ months.',
        ],
        reef: [
          'Snapper and grouper – strong mixed‑reef action; some spawning aggregations exist under local protection.',
          'Barracuda, jacks, mackerel – plentiful predators on spinning gear and trolling spreads.',
        ],
        offshore_pelagic: [
          'Sailfish – good target during late spring.',
          'Mahi Mahi – often one of the better months for numbers and size.',
        ],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'Hotter, relatively calm period with consistent southeast trades and smoother seas than winter.',
        effects_on_fishing: [
          'Glassy, clear flats favor early and late sessions, with mid‑day sun requiring stealthy approaches and longer leaders.',
          'Leeward lagoons can become quite warm mid‑day, so many guides split days between early flats and later reef fishing.',
          'Offshore mahi mahi and sailfish trips are popular and generally comfortable due to moderate wind and smaller seas.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'Labor Day / May Day – May 1, national public holiday.',
          'Commonwealth/Sovereign’s Day (date can vary late May or June in some years).',
        ],
        impact_on_boat_tours: [
          'Tarpon ‘grand slam’ season plus school breaks in North America generate strong demand for flats guides.',
          'Labor Day may see some businesses close or run reduced hours, but tourism operators on Ambergris typically remain active.',
        ],
      },
    },
    {
      month: 'June',
      primary_species: {
        flats_inshore: [
          'Tarpon – prime; many sources list May–June as the heart of tarpon season.',
          'Bonefish – excellent, with strong fishing often continuing through October.',
          'Permit – very good; June starts an extended best window June–November in many calendars.',
        ],
        reef: [
          'Snapper – very good; some species spawn around reef structure (subject to local rules).',
          'Grouper – good, though some spawning closures may limit harvest for certain species.',
          'Barracuda, jacks, mackerel – strong action on lures and bait.',
        ],
        offshore_pelagic: [
          'Mahi Mahi – excellent; many calendars highlight June–July for these fish.',
          'Tuna and assorted pelagics – good as bait pushes close to shore.',
        ],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'Start of the rainy season but still dominated by warm southeasterly trades, often with calm mornings and afternoon squalls.',
        effects_on_fishing: [
          'Calm seas allow longer runs along the barrier reef and to more distant cayes for combined flats and reef itineraries.',
          'Short‑lived thunderstorms may force quick course changes to avoid lightning, shifting between reef, flats, and sheltered lagoons.',
          'Rainy‑season onset tends to pull bait and gamefish closer to the reef, which can help reef and near‑shore pelagic fishing.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'Lobster season opening (typically mid‑June, exact date set by regulations); celebrated with Lobsterfest events in San Pedro and other towns June–July.',
          'June Solstice and occasional small local festivals.',
        ],
        impact_on_boat_tours: [
          'Lobsterfest significantly increases tourism and demand for reef and snorkel charters, often packaged with lobster beach barbecues.',
          'Tarpon, bonefish, and permit trips remain in high demand; some guides offer mixed days: morning flats, afternoon reef and lobster.',
        ],
      },
    },
    {
      month: 'July',
      primary_species: {
        flats_inshore: [
          'Tarpon – still excellent; July–September widely considered peak for big migration fish.',
          'Bonefish – strong, with plenty of school‑size fish on most flats.',
          'Permit – excellent, benefitting from stable warm water and good tides.',
        ],
        reef: [
          'Snapper and grouper – good; some species past peak spawn but still abundant.',
          'Barracuda, jacks, mackerel – very active warm‑water predators.',
        ],
        offshore_pelagic: [
          'Mahi Mahi – still excellent, especially early in the month.',
          'Marlin and other offshore gamefish – increasingly targeted in deeper water when weather is stable.',
        ],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'Wet season with high humidity, strong sun, southeasterly trades, and scattered squalls; hurricane risk is rising but still lower than later summer/fall.',
        effects_on_fishing: [
          'Stable warm water and moderate trades create ideal sight‑fishing most mornings.',
          'Guides route around localized squalls, often using leeward lagoons as backup when the wind spikes over open reef.',
          'Offshore trips for mahi mahi and marlin are scheduled with a close eye on storm forecasts and lightning risk.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'Lobsterfest activities often continue into early July in San Pedro.',
          'Summer vacation demand from North America keeps visitor numbers high.',
        ],
        impact_on_boat_tours: [
          'High demand plus peak tarpon/permit fishing means popular flats guides may be booked weeks or months in advance.',
          'Evening and sunset reef trips are popular during festival periods, while serious anglers prefer very early departures to beat heat and wind.',
        ],
      },
    },
    {
      month: 'August',
      primary_species: {
        flats_inshore: [
          'Tarpon – remains very good; July–August often flagged as prime months.',
          'Bonefish – good to excellent; warm water keeps them active on many flats.',
          'Permit – strong within the June–November ‘best months’ range.',
        ],
        reef: [
          'Snapper and grouper – good mixed‑bag reef fishing continues.',
          'Barracuda, jacks, mackerel – abundant targets for spin anglers and trolling.',
        ],
        offshore_pelagic: [
          'Mahi Mahi – good; many sources mark August–October as another high‑potential window.',
          'Marlin and other pelagics – can be targeted around deeper drop‑offs when conditions permit.',
        ],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'Peak wet‑season pattern with warm southeasterly trades, high humidity, frequent thunderstorms, and an elevated risk of tropical storms and hurricanes.',
        effects_on_fishing: [
          'Calm, hot mornings favor very early starts on flats before stronger afternoon trades and storm build‑up.',
          'Tropical disturbances can force wholesale cancellations of offshore and even reef trips until conditions stabilize.',
          'Leeward mangrove lagoons often provide backup options when the windward barrier reef is too rough.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'La Costa Maya Festival – early August, large regional festival hosted on Ambergris Caye.',
          'Emancipation Day – early August, national public holiday.',
        ],
        impact_on_boat_tours: [
          'La Costa Maya draws big crowds to San Pedro, increasing demand for day trips, sunset cruises, and party boats.',
          'Some smaller operators may pause operations or reduce offshore trips during periods of high storm risk, even as festival demand stays strong.',
        ],
      },
    },
    {
      month: 'September',
      primary_species: {
        flats_inshore: [
          'Tarpon – another top window; many calendars highlight September for large migratory fish.',
          'Bonefish – very good with relatively light fishing pressure.',
          'Permit – remains within the June–November prime period.',
          'Snook – improves in mangroves and estuaries with peak rainy‑season runoff.',
        ],
        reef: [
          'Snapper and grouper – good; fewer boats on the water mean less‑pressured reef fish.',
          'Jack crevalle – increasingly common on flats and near reef.',
        ],
        offshore_pelagic: [
          'Mahi Mahi – good; August–October offshore window continues.',
          'Tuna and other pelagics – available in weather windows.',
        ],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'Wet season with high hurricane risk; southeast trades dominate when no system is nearby, but tropical waves and storms can rapidly change conditions.',
        effects_on_fishing: [
          'Stable windows between systems can offer superb flats and reef fishing with minimal boat traffic.',
          'Tropical storms or hurricanes can halt all boat operations for several days and may require moving vessels to safe harbor.',
          'Guides often emphasize flexible half‑day trips close to San Pedro or sheltered lagoons when long‑range weather confidence is low.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'St. George’s Caye Day – September 10, national public holiday with coastal celebrations.',
          'Independence Day – September 21, major national holiday; entire month is celebrated as ‘Patriotic Month’ with parades, carnival, and events.',
        ],
        impact_on_boat_tours: [
          'Domestic celebrations and parades increase boat traffic for special events, but overall September is otherwise a low international tourism month; some operators reduce schedules or close briefly.',
          'Boat parades and harbor festivities can create temporary congestion but also opportunities for themed cruises and sunset events.',
        ],
      },
    },
    {
      month: 'October',
      primary_species: {
        flats_inshore: [
          'Tarpon – migratory numbers start to thin, but quality fish remain and can be aggressive before moving south.',
          'Bonefish – excellent; some of the larger fish and more aggressive behavior are reported this time of year.',
          'Permit – still productive within the June–November best‑months range.',
          'Snook – often strong with high freshwater input from the mainland.',
        ],
        reef: [
          'Snapper and grouper – very good; some calendars highlight October–December as strong for bottom species.',
          'Barracuda, jacks, mackerel – consistent reef predators.',
        ],
        offshore_pelagic: ['Mahi Mahi – good; October often included among better months for mahi near Belize.'],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'Late wet season with high tropical‑system risk; first cooler northers can also begin to appear toward the end of the month.',
        effects_on_fishing: [
          'Calm intervals between systems provide beautiful conditions and lightly pressured fish on flats and reef.',
          'Early northers may alternately roughen the east reef and cool the shallows, driving guides either into leeward lagoons or to postpone trips for safety.',
          'Offshore mahi mahi trips are highly weather‑dependent and frequently re‑scheduled around tropical waves or fronts.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'Pan American Day / Día de la Raza – mid‑October public holiday in some years.',
          'Some lodges and tour operators use October as a maintenance or staff‑vacation month due to lower tourist numbers and storm risk.',
        ],
        impact_on_boat_tours: [
          'Reduced tourist traffic can mean more flexible booking and fewer boats on key flats and reefs for visiting anglers.',
          'However, more operators may be temporarily closed or running limited schedules, and weather cancellations are more likely than in the dry season.',
        ],
      },
    },
    {
      month: 'November',
      primary_species: {
        flats_inshore: [
          'Tarpon – migratory fish move south but a ‘sweet spot’ of action is still possible in settled weather.',
          'Bonefish – good; year‑round species, with slightly cooler water improving mid‑day fishing.',
          'Permit – good when weather is stable; some operators highlight November as a productive permit month.',
        ],
        reef: [
          'Snapper and grouper – strong, entering the Oct–Dec prime period for bottom fishing.',
          'Snook – often very good in mangroves and creeks with lingering wet‑season flows.',
        ],
        offshore_pelagic: [
          'Wahoo – winter run begins; November often rated excellent.',
          'Other pelagics including tuna – active depending on currents and bait concentrations.',
        ],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'Transition from wet to dry season; hurricane risk declines, and early‑season northers begin alternating with trade‑wind periods.',
        effects_on_fishing: [
          'Calm trade‑wind windows produce outstanding flats and reef conditions with comfortable temperatures.',
          'Northers can roughen the east reef, cool the flats, and push fish into deeper or more protected water.',
          'Guides often alternate between windward reef flats on trade‑wind days and leeward lagoons during frontal events.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'Garifuna Settlement Day – November 19, major cultural holiday, especially in southern coastal towns but observed nationwide.',
          'U.S. Thanksgiving – late November; not a Belize holiday but a strong driver of U.S. tourist arrivals.',
        ],
        impact_on_boat_tours: [
          'Garifuna Settlement celebrations may see some operators close or run reduced schedules, particularly outside Ambergris; others operate normally but with festive atmosphere.',
          'Thanksgiving week brings a surge of U.S. visitors, increasing demand for both fishing and reef tours around Ambergris Caye.',
        ],
      },
    },
    {
      month: 'December',
      primary_species: {
        flats_inshore: [
          'Bonefish – good; can be very productive on calm, sunny days between fronts.',
          'Permit – available but heavily weather‑dependent due to frequent northers.',
          'Resident tarpon – present; migratory fish mostly gone, so action hinges on water temperature and wind stability.',
        ],
        reef: [
          'Snapper and grouper – very strong; many sources highlight October–December as peak bottom‑fishing months, with attention to any closed seasons.',
          'Barracuda, jacks, mackerel – abundant; ideal for mixed‑experience and family trips.',
        ],
        offshore_pelagic: [
          'Wahoo – winter high season offshore.',
          'Mahi Mahi – present but generally not at peak; often incidental while targeting wahoo or tuna.',
        ],
      },
      wind_conditions_and_tour_locations: {
        dominant_winds:
          'Start of the dry season but still squarely in the active norther window; frequent north and northeast winds alternate with trade‑wind spells.',
        effects_on_fishing: [
          'Sunny, calm breaks between fronts offer excellent flats and reef conditions, particularly for bonefish and reef species.',
          'Strong northers can blow shallow flats almost dry, create rough seas on the windward reef, and force guides into leeward lagoons or to cancel trips.',
          'Offshore wahoo runs are carefully timed around safe weather windows with manageable swell.',
        ],
      },
      holidays_and_availability: {
        major_holidays_events: [
          'Christmas Day – December 25, national public holiday.',
          'Boxing Day – December 26, public holiday.',
          'San Pedro Holiday Boat Parade (boat‑lighting parade) – typically early to mid‑December.',
        ],
        impact_on_boat_tours: [
          'Christmas–New Year is one of the busiest tourism periods; charters for fishing, snorkeling, and sunset cruises often sell out well in advance.',
          'Some operators may close or run limited trips on December 25–26, while many schedule special holiday or parade‑participation cruises around the boat parade.',
        ],
      },
    },
  ],
};

function extractPrimarySpeciesName(lines: string[]): string {
  const first = lines.find((x) => typeof x === 'string' && x.trim().length > 0);
  if (!first) return 'Unknown';
  const beforeDash = first.split('–')[0];
  return (beforeDash || first).trim();
}

function buildWindTourLocationText(month: CalendarMonth): string {
  const dominant = month.wind_conditions_and_tour_locations?.dominant_winds || '';
  const effects = month.wind_conditions_and_tour_locations?.effects_on_fishing || [];

  const parts: string[] = [];
  if (dominant) parts.push(`Dominant winds: ${dominant}`);
  if (effects.length) {
    parts.push(`Routing + effects: ${effects.join(' ')}`);
  }
  return parts.filter(Boolean).join(' ');
}

export function getSeasonalFishingIntel(date: Date = new Date()): SeasonalFishingIntel {
  const month = date.getMonth() + 1;
  const monthName = MONTH_NAMES[month - 1] || 'Unknown';

  const monthData = AMBERGRIS_CAYE_FISHING_CALENDAR.months.find((m) => m.month === monthName) ||
    AMBERGRIS_CAYE_FISHING_CALENDAR.months[0];

  const offshore = monthData?.primary_species?.offshore_pelagic || [];
  const flats = monthData?.primary_species?.flats_inshore || [];
  const reef = monthData?.primary_species?.reef || [];

  const primary_species =
    extractPrimarySpeciesName(offshore) || extractPrimarySpeciesName(flats) || extractPrimarySpeciesName(reef) || 'Unknown';

  const effects_on_fishing = monthData?.wind_conditions_and_tour_locations?.effects_on_fishing || [];
  const wind_conditions_and_tour_locations = buildWindTourLocationText(monthData);

  const notes: string[] = [
    AMBERGRIS_CAYE_FISHING_CALENDAR.notes.general,
    `Trade winds: ${AMBERGRIS_CAYE_FISHING_CALENDAR.notes.winds.trade_winds}`,
    `Northers: ${AMBERGRIS_CAYE_FISHING_CALENDAR.notes.winds.northers}`,
  ];

  return {
    month,
    monthName,
    primary_species,
    effects_on_fishing,
    wind_conditions_and_tour_locations,
    notes,
  };
}
