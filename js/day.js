// A Victorian child's day: booklet pages and two reference timelines. Sources: research/02-victorian-school-and-day.md.
// The example days are typical rather than exact: times varied by family, town and country.
export const BOOKLET = [
  { hour: 0, time: '', label: 'cover' },
  { hour: 6, time: '6 o\'clock', label: 'Wake up', start: 'I wake up early in a cold room. I share my bed with' },
  { hour: 7, time: '7 o\'clock', label: 'Chores', start: 'Before school I fetch water, clean the boots and' },
  { hour: 9, time: '9 o\'clock', label: 'School', start: 'I walk to school. The bell rings. I write on a slate with' },
  { hour: 12, time: '12 o\'clock', label: 'Dinner', start: 'I walk home for dinner. We eat bread and' },
  { hour: 2, time: '2 o\'clock', label: 'Afternoon', start: 'In the afternoon the boys do woodwork and the girls' },
  { hour: 5, time: '5 o\'clock', label: 'Tea and play', start: 'After tea I play outside with my hoop and' },
  { hour: 7, time: '7 o\'clock', label: 'Bedtime', start: 'At bedtime Mother lights a candle and' },
];

export const POOR_DAY = [
  { time: '5 to 6 am', what: 'Wake in a shared bed. Wash in cold water from a jug.' },
  { time: '6 to 8 am', what: 'Chores: fetch water from the street pump, light the fire, black-lead the range, polish the boots. Breakfast of porridge or bread.' },
  { time: '8.45 am', what: 'Walk to school. The bell rings at 9.' },
  { time: '9 am', what: 'Register and prayers. Then the three Rs: reading, writing on slates, reckoning. Times tables chanted out loud.' },
  { time: '12 noon', what: 'Dinner, often a walk home and back: bread, cheese, maybe a bit of stew.' },
  { time: '2 pm', what: 'Afternoon school: woodwork or gardening for boys, cooking and sewing for girls.' },
  { time: '5 pm', what: 'Home. More chores, then tea. Play in the street: a hoop and stick, a spinning top, a peg doll.' },
  { time: '8 pm', what: 'Bed by candle or oil lamp, several children to a bed. No electricity, no TV.' },
];

export const RICH_DAY = [
  { time: '7 am', what: 'Woken by the nursemaid in the nursery at the top of the house. Washed and dressed by a servant.' },
  { time: '8 am', what: 'Breakfast in the nursery: porridge, eggs, bread and butter.' },
  { time: '9 am', what: 'Lessons at home in the schoolroom with a governess: reading, writing, sums, French, piano, drawing.' },
  { time: '12 noon', what: 'A walk in the park with Nanny, or a ride in the carriage.' },
  { time: '2 pm', what: 'More lessons, then play: a rocking horse, a dolls\' house, tin soldiers, a magic lantern.' },
  { time: '5 pm', what: 'Nursery tea, then dressed up to see Mother and Father for an hour in the drawing room.' },
  { time: '7 pm', what: 'Bath by the fire, prayers and bed, with gas lamps in the hall and a candle on the stairs.' },
];

export const DAY_FACTS = [
  { kid: 'Many Victorian children got up at 5 or 6 o\'clock to do chores before school. Some boys earned pennies polishing shoes in the street.', src: 'https://collections.vam.ac.uk/item/O1058588/the-independent-shoe-black-photograph-john-thomson/', srcName: 'V&A' },
  { kid: 'The kitchen range had to be black-leaded every day: rubbed all over with black polish until it shone.', src: 'https://holstvictorianhouse.org.uk/the-kitchen-range/', srcName: 'Holst Victorian House' },
  { kid: 'School ran from 9 in the morning until 5 in the afternoon, and many children walked home for dinner in the middle.', src: 'https://4schools-resources.webspace.durham.ac.uk/victorian-durham/school-life', srcName: 'Durham University' },
  { kid: 'In the afternoons boys and girls had different lessons: woodwork or gardening for the boys, cooking and sewing for the girls.', src: 'https://www.stmichaelsprimary.bournemouth.sch.uk/victorian-school-life/', srcName: 'St Michael\'s Primary' },
  { kid: 'Favourite toys were a hoop and stick, spinning tops and peg dolls. Rich children might have a rocking horse or a magic lantern.', src: 'https://www.northeastmuseums.org.uk/learn/boxes-of-delight/victorian-toys', srcName: 'North East Museums' },
  { kid: 'Rich children lived in a nursery at the top of the house with a nursemaid, and had their lessons at home from a governess.', src: 'https://www.vam.ac.uk/articles/wallpapers-for-children', srcName: 'V&A' },
  { kid: 'There was no electric light. Towns had gas lamps, and many homes used candles and oil lamps.', src: 'https://en.wikipedia.org/wiki/Gas_lighting', srcName: 'Wikipedia' },
  { kid: 'Some poorer children had jobs instead of school. From 1880 the law said every child aged 5 to 10 must go to school.', src: 'https://www.ascl.org.uk/Leader/Issues/2024-Spring-term/The-news-from-1874', srcName: 'ASCL' },
];
