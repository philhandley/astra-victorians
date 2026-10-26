// Wrenbury spotter lists for sheets/walk.html and tasks/wrenbury-walk.html. Sources: research/04-wrenbury-and-landmarks.md
const svg = d => `<svg viewBox="0 0 40 40" class="line">${d}</svg>`;
export const ICONS = {
  church: svg('<path d="M6 34V20l10-6 10 6v14z"/><path d="M26 20V12h6v22M29 6v6M27 9h4"/>'),
  bridge: svg('<path d="M4 30h32M8 30V18M32 30V18M8 18l24-6M8 24h24"/>'),
  stonebridge: svg('<path d="M4 30V18h32v12"/><path d="M10 30v-6a6 6 0 0 1 12 0v6M24 30v-4a4 4 0 0 1 8 0v4"/>'),
  canal: svg('<path d="M6 14h28M6 26h28"/><path d="M10 20c3-2 6-2 9 0s6 2 9 0 6-2 6-2"/>'),
  train: svg('<rect x="6" y="10" width="28" height="18" rx="3"/><path d="M6 20h28M12 32l-2 4M28 32l2 4"/><circle cx="13" cy="31" r="2"/><circle cx="27" cy="31" r="2"/>'),
  pub: svg('<path d="M10 16h16v16H10z"/><path d="M26 20h4v8h-4"/><path d="M12 12l2-4h12l2 4"/>'),
  house: svg('<path d="M8 34V18l12-10 12 10v16z"/><path d="M16 34V24h8v10"/>'),
  green: svg('<path d="M4 30c8-8 24-8 32 0"/><circle cx="12" cy="16" r="5"/><path d="M12 21v9"/>'),
  school: svg('<path d="M4 34V18h32v16z"/><path d="M12 18v-6h16v6M18 8h4v4"/><path d="M18 34v-6h4v6"/>'),
  road: svg('<path d="M12 34l4-28h8l4 28"/><path d="M20 10v4M20 18v4M20 26v4"/>'),
  memorial: svg('<path d="M14 34h12M16 34V14h8v20"/><path d="M20 14V6M17 9h6"/>'),
  shop: svg('<path d="M6 16l3-6h22l3 6"/><path d="M9 20v14h22V20M16 34V26h8v8"/>'),
  hall: svg('<path d="M6 34V16l14-8 14 8v18z"/><path d="M12 34V22h6v12M22 34V22h6v12"/>'),
  boat: svg('<path d="M4 24h32l-4 8H8z"/><path d="M12 24V14h16v10M18 10h4v4"/>'),
  river: svg('<path d="M4 12c6 0 6 6 12 6s6-6 12-6 6 6 8 6M4 24c6 0 6 6 12 6s6-6 12-6 6 6 8 6"/>'),
  field: svg('<path d="M4 32L20 8l16 24z" stroke-dasharray="3 2"/><path d="M4 32h32"/>'),
  tree: svg('<circle cx="20" cy="16" r="10"/><path d="M20 26v10M16 36h8"/>'),
  hedge: svg('<path d="M4 30c4-10 10-10 14-4 4-6 10-6 14 0 2 2 4 4 4 4z"/>'),
  pond: svg('<path d="M6 22c4-8 24-10 28-2 2 6-6 12-16 12S4 28 6 22z"/>'),
  hill: svg('<path d="M4 32c6-14 22-14 30 0M18 32c4-8 12-8 18 0"/>'),
  weather: svg('<circle cx="14" cy="14" r="6"/><path d="M12 32a6 6 0 0 1 0-12 8 8 0 0 1 15 2 5 5 0 0 1 1 10z"/>'),
  soil: svg('<path d="M4 30h32M8 30c2-4 4-4 6 0M18 30c2-4 4-4 6 0M28 30c2-4 4-4 6 0"/><path d="M20 30V18M16 22l4-4 4 4"/>'),
  bird: svg('<path d="M6 18c4-6 10-6 14 0 4-6 10-6 14 0"/><path d="M12 28c3-4 6-4 9 0 3-4 6-4 9 0"/>'),
  reeds: svg('<path d="M10 34V14M16 34V10M22 34V16M28 34V12"/><path d="M8 14h4M20 16h4M26 12h4"/>'),
};

// vic: true marks things built or opened while Victoria was queen (1837 to 1901).
export const HUMAN = [
  { name: "St Margaret's Church", note: 'built in the early 1500s, made new inside in 1865', icon: 'church', src: 'https://en.wikipedia.org/wiki/St_Margaret%27s_Church,_Wrenbury' },
  { name: 'The village green', note: 'with two black-and-white houses looking over it', icon: 'green', src: 'https://www.wrenbury-pc.gov.uk/past-and-present/' },
  { name: 'Our school', note: 'the old building has the date 1879 and a little bell tower', icon: 'school', vic: true, src: 'https://britishlistedbuildings.co.uk/101066020' },
  { name: 'A wooden lift bridge', note: 'three were built about 1790 by Thomas Telford', icon: 'bridge', src: 'https://www.wrenbury-pc.gov.uk/past-and-present/' },
  { name: 'The Llangollen Canal', note: 'finished in 1805 and busy with boats ever since', icon: 'canal', src: 'https://en.wikipedia.org/wiki/Llangollen_Canal' },
  { name: 'Boats at Wrenbury Mill', note: 'the marina by the push-button lift bridge', icon: 'boat', src: 'https://www.tyha.co.uk/marina-details/wrenburymill-marina' },
  { name: 'The Dusty Miller', note: 'a Victorian watermill that is now a pub', icon: 'pub', vic: true, src: 'https://camra.org.uk/pubs/136123' },
  { name: 'Wrenbury Mill Bridge', note: 'a red sandstone road bridge from Victorian times', icon: 'stonebridge', vic: true, src: 'https://britishlistedbuildings.co.uk/101066023-wrenbury-mill-bridge-wrenbury-cum-frith' },
  { name: 'Wrenbury railway station', note: 'opened in 1858, when Victoria was queen', icon: 'train', vic: true, src: 'https://en.wikipedia.org/wiki/Wrenbury_railway_station' },
  { name: 'The village hall', note: '', icon: 'hall', src: 'https://www.wrenbury-pc.gov.uk/local-organisations/' },
  { name: 'The war memorial', note: 'in the churchyard', icon: 'memorial', src: 'https://en.wikipedia.org/wiki/Wrenbury-cum-Frith' },
  { name: 'Houses', note: 'old brick, black-and-white, or new', icon: 'house' },
  { name: 'A road, a sign or a post box', note: '', icon: 'road' },
  { name: 'The post office and shop', note: '', icon: 'shop', src: 'https://en.wikipedia.org/wiki/Wrenbury-cum-Frith' },
];

export const PHYSICAL = [
  { name: 'The River Weaver', note: 'runs right beside the Dusty Miller', icon: 'river', src: 'https://camra.org.uk/pubs/136123' },
  { name: 'Flat fields', note: 'Wrenbury is on the flat Cheshire Plain', icon: 'field', src: 'https://publications.naturalengland.org.uk/publication/6076647514046464' },
  { name: 'Hedges', note: 'between the fields', icon: 'hedge' },
  { name: 'Trees', note: 'willows grow by the water', icon: 'tree', src: 'https://en.wikipedia.org/wiki/Marbury,_Cheshire' },
  { name: 'Reeds by the water', note: 'the meres nearby have reed beds', icon: 'reeds', src: 'https://en.wikipedia.org/wiki/Marbury,_Cheshire' },
  { name: 'A pond or a mere', note: 'a mere is a lake left by the ice age', icon: 'pond', src: 'https://en.wikipedia.org/wiki/Quoisley_Meres' },
  { name: 'Hills far away', note: 'the Bickerton and Peckforton hills', icon: 'hill', src: 'https://en.wikipedia.org/wiki/Bickerton_Hills' },
  { name: 'The weather today', note: 'sun, cloud, wind or rain', icon: 'weather' },
  { name: 'Soil and mud', note: 'Cheshire has sticky clay soil left by the ice', icon: 'soil', src: 'https://www.audlem.org/features/heritage/geology.html' },
  { name: 'Birds and animals', note: 'ducks, herons, cows, sheep', icon: 'bird' },
];
