// Victorian school facts used by sheets/school.html and tasks/victorian-school.html. Sources: research/02-victorian-school-and-day.md
const DURHAM = 'https://4schools-resources.webspace.durham.ac.uk/victorian-durham/school-life';
const BSM = 'https://britishschoolsmuseum.org.uk/discover/collections/being-punished';
const NEM = 'https://www.northeastmuseums.org.uk/learn/boxes-of-delight/victorian-schoolroom';
const WYLYE = 'https://apps.wiltshire.gov.uk/communityhistory/School/Details/1371';
const STM = 'https://www.stmichaelsprimary.bournemouth.sch.uk/victorian-school-life/';
const WELL = 'https://britishlistedbuildings.co.uk/101392597';

export const SAME_DIFFERENT = [
  { feature: 'Writing', victorian: 'A slate and a slate pencil, wiped clean with a rag. Older children used a dip pen and an ink well.', src: NEM },
  { feature: 'The class', victorian: 'Up to 80 children in one room, all ages together, with one teacher helped by older pupils called monitors.', src: DURHAM },
  { feature: 'Desks', victorian: 'Rows of wooden desks, all facing the front and the teacher.', src: DURHAM },
  { feature: 'Lessons', victorian: 'The three Rs: reading, writing and reckoning (sums). Times tables chanted out loud. Sewing for girls and woodwork for boys.', src: STM },
  { feature: 'Rules', victorian: 'Breaking a rule could mean the cane, the dunce\'s hat in the corner, or writing a line out hundreds of times.', src: BSM },
  { feature: 'The school day', victorian: 'From 9 in the morning until 5 in the afternoon, with dinner at home in the middle.', src: DURHAM },
  { feature: 'Doors', victorian: 'Separate entrances for boys, girls and infants, with the words carved over the doors.', src: WELL },
  { feature: 'Paying', victorian: 'A penny or two a week, until school became free in 1891.', src: WYLYE },
];

export const SCHOOL_FACTS = [
  { kid: 'In 1870 a new law said school boards could build schools wherever they were needed, so that there could be "efficient schools everywhere".', src: 'https://api.parliament.uk/historic-hansard/commons/1870/feb/17/leave-first-reading', srcName: 'Hansard, 1870' },
  { kid: 'From 1880 every child aged 5 to 10 had to go to school. A six-year-old would have been in their second year, just like now.', src: 'https://www.ascl.org.uk/Leader/Issues/2024-Spring-term/The-news-from-1874', srcName: 'ASCL' },
  { kid: 'A Victorian classroom could hold up to 80 children with one teacher: about three of our classes in one room.', src: DURHAM, srcName: 'Durham University' },
  { kid: 'Children practised their writing on slates with a slate pencil, then wiped them clean.', src: DURHAM, srcName: 'Durham University' },
  { kid: 'Boys, girls and infants had their own doors. You can still see BOYS and INFANTS carved over the doors of old schools.', src: WELL, srcName: 'Historic England listing' },
  { kid: 'Lessons were the three Rs: reading, writing and reckoning, which means sums. They all start with an R sound!', src: 'https://britishschoolsmuseum.org.uk/learning/school-programmes/1880-gallery-lesson/', srcName: 'British Schools Museum' },
  { kid: 'Children chanted their times tables out loud, over and over, until they could say them without a single mistake.', src: STM, srcName: 'St Michael\'s Primary' },
  { kid: 'A child who broke a rule might have to wear a pointed dunce\'s hat and sit in the corner.', src: BSM, srcName: 'British Schools Museum' },
  { kid: 'Before 1891 a child\'s school cost a penny or two a week. Then a new law made it free.', src: WYLYE, srcName: 'Wiltshire Community History' },
  { kid: 'Our own school in Wrenbury has a date stone saying 1879, and a little bell tower on the roof.', src: 'https://britishlistedbuildings.co.uk/101066020', srcName: 'Historic England listing' },
];

export const LABELS_OUTSIDE = ['bell tower', 'tall windows', 'red bricks', 'slate roof', 'chimney', 'BOYS door', 'GIRLS door', 'INFANTS door', 'playground wall', 'iron railings', 'the date stone', 'weathervane'];
export const LABELS_INSIDE = ['blackboard', 'chalk', 'slate', 'slate pencil', 'abacus', 'ink well', 'dip pen', "teacher's high desk", 'rows of desks', 'coal stove', 'globe', "dunce's cap", 'cane', 'register'];
