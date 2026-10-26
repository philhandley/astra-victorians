// The Victorian age in dates and inventions, for victorians.html and the timeline poster.
// Sources: research/07-victorian-era-overview.md, 01-queen-victoria.md, 02-victorian-school-and-day.md, 04-wrenbury-and-landmarks.md.
const I = d => `<svg viewBox="0 0 40 40" class="line">${d}</svg>`;
const SM = 'https://collection.sciencemuseumgroup.org.uk/objects/';
const NHM_DINO = 'https://www.nhm.ac.uk/discover/crystal-palace-dinosaurs.html';
const NHM_WORD = 'https://www.nhm.ac.uk/discover/how-dinosaurs-got-their-name.html';
const EH_INV = 'https://www.english-heritage.org.uk/visit/inspire-me/victorian-inventions/';
const TFL = 'https://nile.tfl.gov.uk/info-for/media/press-releases/2005/august/harrowonthehill-station-celebrates-125th-birthday';
const GREAT_EX = 'https://blog.sciencemuseum.org.uk/a-great-exhibition/';

// The poster holds fourteen events; victorians.html shows them all.
export const TIMELINE = [
  { year: 1837, frac: 0.47, what: 'Victoria becomes queen, aged 18.', src: 'https://albert.rct.uk/queen-victoria-1819-1901', icon: I('<path d="M8 30h24M8 28L10 12l8 8 2-12 2 12 8-8 2 16z"/>') },
  { year: 1840, frac: 0.1, what: 'She marries Albert. The Penny Black, the first stamp, goes on sale.', src: 'https://en.wikipedia.org/wiki/Penny_Black', icon: I('<rect x="8" y="8" width="24" height="24" stroke-dasharray="2 2"/><circle cx="20" cy="20" r="6"/>') },
  { year: 1842, frac: 0.45, what: 'First monarch on a train, Slough to London. The word "dinosaur" is invented.', src: 'https://www.royal.uk/queen-celebrates-175th-anniversary-first-royal-train-journey', icon: I('<rect x="6" y="12" width="28" height="16" rx="3"/><path d="M6 22h28"/><circle cx="13" cy="32" r="2.5"/><circle cx="27" cy="32" r="2.5"/>') },
  { year: 1843, frac: 0.2, what: 'The railway works moves to Crewe, and a town grows round it.', src: 'https://www.crewehc.co.uk/news/crewe-works-180-announcment', icon: I('<path d="M6 32V16h8v6h6v-6h8v16z"/><path d="M12 32v-8h6v8M22 10v6"/>') },
  { year: 1851, frac: 0.35, what: 'The Great Exhibition in the Crystal Palace, a palace of glass. Six million people visit.', src: GREAT_EX, icon: I('<path d="M6 32V18l14-10 14 10v14z"/><path d="M12 32V20h16v12M12 26h16M20 8v24"/>') },
  { year: 1854, frac: 0.4, what: 'Life-size model dinosaurs are unveiled at Crystal Palace Park.', src: NHM_DINO, icon: I('<path d="M6 30c2-8 8-14 16-14 6 0 8 4 12 2l-2 4c-3 2-6 0-8 2-2 4-4 6-10 6z"/><path d="M12 30v6M20 30v6"/>') },
  { year: 1858, frac: 0.7, what: 'Wrenbury railway station opens.', src: 'https://en.wikipedia.org/wiki/Wrenbury_railway_station', icon: I('<path d="M6 30h28M10 30V18h20v12"/><path d="M8 18l12-8 12 8"/><rect x="17" y="22" width="6" height="8"/>') },
  { year: 1863, frac: 0.05, what: 'The London Underground, the first underground railway in the world.', src: TFL, icon: I('<circle cx="20" cy="20" r="12"/><path d="M4 20h32"/>') },
  { year: 1870, frac: 0.6, what: 'A new law: school boards to build schools wherever they are needed.', src: 'https://education-uk.org/documents/acts/1870-elementary-education-act.html', icon: I('<path d="M4 34V18h32v16z"/><path d="M12 18v-6h16v6M18 8h4v4"/><path d="M18 34v-6h4v6"/>') },
  { year: 1878, frac: 0.05, what: 'Alexander Graham Bell shows Queen Victoria his new telephone at Osborne.', src: EH_INV, icon: I('<path d="M10 8h6l2 7-3 3c2 4 5 7 9 9l3-3 7 2v6a2 2 0 0 1-2 2C18 34 6 22 6 10a2 2 0 0 1 2-2z"/>') },
  { year: 1879, frac: 0.5, what: 'The electric light bulb. Most homes still used gas and candles.', src: SM + 'co42487/swan-electric-lamp', icon: I('<path d="M14 26a9 9 0 1 1 12 0v4h-12z"/><path d="M16 34h8"/>') },
  { year: 1887, frac: 0.47, what: 'Golden Jubilee: 50 years as queen. Queen\'s Park in Crewe is a jubilee gift.', src: 'https://www.royal.uk/history-jubilees', icon: I('<path d="M20 6l4 8 9 1-6.5 6 1.5 9-8-4-8 4 1.5-9L8 15l9-1z"/>') },
  { year: 1895, frac: 0.97, what: 'X-rays: the first picture of the bones inside a hand.', src: SM + 'co134691', icon: I('<path d="M14 34V18l-4-8M26 34V18l4-8M14 34h12M14 18h12"/><path d="M20 10v8"/>') },
  { year: 1901, frac: 0.06, what: 'Victoria dies at Osborne House, aged 81. The Victorian age ends.', src: 'https://www.westminster-abbey.org/abbey-commemorations/royals/queen-victoria', icon: I('<path d="M8 32h24M12 32V16a8 8 0 0 1 16 0v16"/>') },
];

export const INVENTIONS = [
  { year: 1839, what: 'Photography', kid: 'The first photographs, called daguerreotypes. Before this, the only way to keep a face was to paint it.', src: 'https://hsm.ox.ac.uk/photographs', srcName: 'History of Science Museum, Oxford' },
  { year: 1840, what: 'The Penny Black', kid: 'The world\'s first sticky postage stamp, with Victoria\'s head on it. It cost one penny.', src: 'https://en.wikipedia.org/wiki/Penny_Black', srcName: 'Wikipedia' },
  { year: 1842, what: 'The word "dinosaur"', kid: 'Richard Owen made up the name Dinosauria, meaning "fearfully great" lizards.', src: NHM_WORD, srcName: 'Natural History Museum' },
  { year: 1847, what: 'Christmas crackers', kid: 'Tradition says Tom Smith, a London sweet maker, invented the cracker.', src: 'https://en.wikipedia.org/wiki/Christmas_cracker', srcName: 'Wikipedia' },
  { year: 1848, what: 'The Christmas tree craze', kid: 'A newspaper picture of the royal family round a decorated tree made Christmas trees popular all over Britain.', src: 'https://www.vam.ac.uk/blog/design-and-society/the-magic-of-the-tree', srcName: 'V&A' },
  { year: 1851, what: 'The Crystal Palace', kid: 'A giant building of glass and iron for the Great Exhibition. More than six million people visited in five and a half months.', src: GREAT_EX, srcName: 'Science Museum' },
  { year: 1853, what: 'Pillar boxes', kid: 'The first post boxes on street corners in mainland Britain, in Carlisle. The very first ones were green, not red.', src: 'https://en.wikipedia.org/wiki/Pillar_box', srcName: 'Wikipedia' },
  { year: 1854, what: 'Dinosaur models', kid: 'The first life-size dinosaur statues, at Crystal Palace Park. A dinner party was held inside one on New Year\'s Eve 1853.', src: NHM_DINO, srcName: 'Natural History Museum' },
  { year: 1863, what: 'The Underground', kid: 'The first underground railway in the world, from Paddington to Farringdon, pulled by steam engines.', src: TFL, srcName: 'Transport for London' },
  { year: 1867, what: 'The zoetrope', kid: 'A spinning drum with pictures inside. Look through the slits and the pictures seem to move: a cartoon before cartoons.', src: SM + 'co8180454/zoetrope', srcName: 'Science Museum' },
  { year: 1878, what: 'The telephone', kid: 'Alexander Graham Bell showed his new telephone to Queen Victoria at Osborne House.', src: EH_INV, srcName: 'English Heritage' },
  { year: 1879, what: 'The light bulb', kid: 'Joseph Swan in Newcastle and Thomas Edison in America made electric light bulbs that worked.', src: SM + 'co42487/swan-electric-lamp', srcName: 'Science Museum' },
  { year: 1885, what: 'The safety bicycle', kid: 'A bike with two wheels the same size, like yours, instead of a giant front wheel.', src: SM + 'co25833/rover-safety-bicycle-1885', srcName: 'Science Museum' },
  { year: 1888, what: 'The Football League', kid: 'Twelve clubs formed the first football league: as many clubs as there are months in a year.', src: 'https://en.wikipedia.org/wiki/English_Football_League', srcName: 'Wikipedia' },
  { year: 1895, what: 'X-rays', kid: 'Wilhelm Röntgen found rays that could photograph the bones inside a hand. His wife\'s ring shows in the first picture.', src: SM + 'co134691', srcName: 'Science Museum' },
  { year: 1896, what: 'The cinema', kid: 'Robert Paul was the first person in Britain to show films to a paying audience.', src: 'https://replay.bfi.org.uk/collection/255', srcName: 'BFI' },
];

export const LIFE = [
  { kid: 'There was no electric light at home. Towns had gas lamps from the 1850s, and many homes still used candles and oil lamps.', src: 'https://en.wikipedia.org/wiki/Gas_lighting', srcName: 'Wikipedia' },
  { kid: 'Cooking was done on a cast-iron range, a big black stove that had to be polished with black lead to stop it rusting.', src: 'https://holstvictorianhouse.org.uk/the-kitchen-range/', srcName: 'Holst Victorian House' },
  { kid: 'Rich children lived in a nursery at the top of the house, looked after by a nursemaid, and had lessons from a governess.', src: 'https://www.vam.ac.uk/articles/wallpapers-for-children', srcName: 'V&A' },
  { kid: 'A rocking horse was an expensive toy for wealthy children. Poorer children had peg dolls and spinning tops.', src: 'https://collections.vam.ac.uk/item/O181064/rocking-horse-unknown/', srcName: 'V&A' },
  { kid: 'Favourite toys included a hoop and stick, peg dolls, a zoetrope and magic lantern slides.', src: 'https://www.northeastmuseums.org.uk/learn/boxes-of-delight/victorian-toys', srcName: 'North East Museums' },
  { kid: 'Some children had jobs instead of school, like the shoe-black boys who polished boots in the street. From 1880 the law said every child aged 5 to 10 had to go to school.', src: 'https://www.ascl.org.uk/Leader/Issues/2024-Spring-term/The-news-from-1874', srcName: 'ASCL' },
];

export const TRAVEL = [
  { kid: 'Before trains, people walked, rode horses or went by horse and cart. Canal boats were pulled by horses along the towpath.' },
  { kid: 'The canal through Wrenbury was planned in 1793 and finished in 1805, before Victoria was born, but it was busy with boats all through her reign.', src: 'https://canalrivertrust.org.uk/canals-and-rivers/llangollen-canal/history-of-the-llangollen-canal', srcName: 'Canal & River Trust' },
  { kid: 'Railways spread across Britain in the 1840s. The railway works moved to Crewe in 1843 and a whole town grew up round it.', src: 'https://www.crewehc.co.uk/news/crewe-works-180-announcment', srcName: 'Crewe Heritage Centre' },
  { kid: 'Wrenbury got its own railway station in September 1858, on the line from Crewe to Shrewsbury.', src: 'https://en.wikipedia.org/wiki/Wrenbury_railway_station', srcName: 'Wikipedia' },
  { kid: 'Victoria was the first monarch to ride a train, on 13 June 1842, from Slough to London. It took about half an hour.', src: 'https://www.royal.uk/queen-celebrates-175th-anniversary-first-royal-train-journey', srcName: 'royal.uk' },
  { kid: 'The penny-farthing bicycle, with its giant front wheel, was a craze from about 1880 to 1890. Safer bikes with two equal wheels came in 1885.', src: SM + 'co8421051/penny-farthing-bicycle', srcName: 'Science Museum' },
  { kid: 'The first motor cars arrived at the very end of her reign. In 1896 the speed limit was set at 14 miles an hour.', src: 'https://en.wikipedia.org/wiki/Locomotives_on_Highways_Act_1896', srcName: 'Wikipedia' },
];

export const ERA_SOURCES = [
  { name: 'Royal Collection Trust: Queen Victoria (1819 to 1901)', url: 'https://albert.rct.uk/queen-victoria-1819-1901' },
  { name: 'Science Museum Group collection', url: 'https://collection.sciencemuseumgroup.org.uk/' },
  { name: 'Natural History Museum: Crystal Palace dinosaurs', url: NHM_DINO },
  { name: 'English Heritage: Victorian inventions', url: EH_INV },
  { name: 'V&A: the magic of the Christmas tree', url: 'https://www.vam.ac.uk/blog/design-and-society/the-magic-of-the-tree' },
  { name: 'Office for National Statistics: 200 years of the census', url: 'https://cy.ons.gov.uk/census/2011census/howourcensusworks/aboutcensuses/censushistory/200yearsofthecensus' },
  { name: 'National curriculum in England: history programmes of study', url: 'https://www.gov.uk/government/publications/national-curriculum-in-england-history-programmes-of-study/national-curriculum-in-england-history-programmes-of-study' },
];

export const ERA_GALLERY = ['crystal-palace.jpg', 'penny-black.jpg', 'penny-farthing.jpg', 'christmas-tree.jpg', 'dinosaurs.jpg', 'zoetrope.jpg', 'hoop.jpg', 'classroom.jpg'];
