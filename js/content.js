// Content for every task page. Every fact carries a src URL from the research briefs in research/. Edit here, not in the shells.
import { FACTS as VFACTS } from './victoria.js';
import { BM_FACTS } from './bathing.js';
import { SCHOOL_FACTS } from './school.js';
import { DAY_FACTS } from './day.js';

const S = {
  ncHist: { name: 'National curriculum in England: history programmes of study (gov.uk)', url: 'https://www.gov.uk/government/publications/national-curriculum-in-england-history-programmes-of-study/national-curriculum-in-england-history-programmes-of-study' },
  ncGeog: { name: 'National curriculum in England: geography programmes of study (gov.uk)', url: 'https://www.gov.uk/government/publications/national-curriculum-in-england-geography-programmes-of-study/national-curriculum-in-england-geography-programmes-of-study' },
  ncSci: { name: 'National curriculum in England: science programmes of study (gov.uk PDF)', url: 'https://assets.publishing.service.gov.uk/media/5a806ebd40f0b62305b8b1fa/PRIMARY_national_curriculum_-_Science.pdf' },
  ncEng: { name: 'National curriculum in England: English programmes of study, Year 2 handwriting (gov.uk)', url: 'https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study#year-2-programme-of-study' },
  osborne: { name: 'English Heritage: Osborne', url: 'https://www.english-heritage.org.uk/visit/places/osborne/' },
  royal: { name: 'royal.uk: Queen Victoria', url: 'https://www.royal.uk/queen-victoria' },
  abbey: { name: 'Westminster Abbey: Queen Victoria', url: 'https://www.westminster-abbey.org/abbey-commemorations/royals/queen-victoria' },
  durham: { name: 'Durham University 4Schools: Victorian school life', url: 'https://4schools-resources.webspace.durham.ac.uk/victorian-durham/school-life' },
  bsm: { name: 'British Schools Museum: being punished', url: 'https://britishschoolsmuseum.org.uk/discover/collections/being-punished' },
  nem: { name: 'North East Museums: Victorian schoolroom box', url: 'https://www.northeastmuseums.org.uk/learn/boxes-of-delight/victorian-schoolroom' },
  ascl: { name: 'ASCL: the news from 1874 (the 1870 and 1880 Education Acts)', url: 'https://www.ascl.org.uk/Leader/Issues/2024-Spring-term/The-news-from-1874' },
  wrenSchool: { name: 'Historic England listing (via British Listed Buildings): Wrenbury School, dated 1879', url: 'https://britishlistedbuildings.co.uk/101066020' },
  parish: { name: 'Wrenbury Parish Council: past and present', url: 'https://www.wrenbury-pc.gov.uk/past-and-present/' },
};
const NC_GEOG = S.ncGeog.url;

export const CONTENT = {
  'victorian-school': {
    time: 'about an hour',
    explore: [
      { page: 'victorian-school.html', preview: 'explore-school.jpg', fig: 'Fig. 01', title: 'A tiny school for 50 children', desc: 'Monks Horton, Kent, 1852, modelled from the architect\'s own plans, with his drawing beside it. Ring the bell, light the fire, find the child who is late, and cut the whole school open to see inside.' },
      { page: 'wrenbury-school.html', preview: 'explore-wrenbury.jpg', fig: 'Fig. 02', title: 'Our school in 1879, and a new one', desc: 'Wrenbury School in 3D, from the 1897 map and a 2006 photograph: the bell tower, the round date stone, three yards with paths to the road. Next to it, a new school on a plot just the same size. Cut them open and watch the paper models fold.' },
    ],
    intro: 'Victorian schools were strict, crowded and often cold, but for many children they were the first school their family had ever been to. Draw one, label it, and spot what has changed. Our own school in Wrenbury has a Victorian building, dated 1879.',
    steps: [
      'Look at the pictures of a real Victorian school and classroom on this page. What do you notice first?',
      'Print the sheet. Draw the <b>outside</b> of a Victorian school: tall windows, a bell, red bricks, separate doors for boys, girls and infants.',
      'Write a label for each part and draw a line to it. The word bank is on the sheet.',
      'Fill in the <b>Same or different?</b> table: the Victorian side is done, you write about our school today.',
      'If you like, draw the <b>inside</b> too: rows of desks, the blackboard, the coal stove.',
    ],
    printables: [
      { sheet: 'school.html', pdf: 'school.pdf', preview: 'school.jpg', title: 'A Victorian school: draw, label, compare', desc: 'Outside drawing frame with word bank, the same-or-different table, and an inside drawing frame.', pages: '3 pages, A4' },
    ],
    facts: SCHOOL_FACTS,
    gallery: ['classroom.jpg', 'board-school.jpg', 'slate.jpg', 'copybook.jpg'],
    ideas: [
      'Use a ruler to draw rows of bricks, then colour them with a red crayon on its side.',
      'Draw two lines of children in the playground, boys on one side and girls on the other.',
      'Carve a date stone over the door: 1879, like Wrenbury\'s own school.',
      'Add a bell tower with a rope, and a chimney with coal smoke.',
      'Walk past our school and look for the date stone, the bell tower and the weathervane. Draw what you see.',
      'Build the same school in Astra Architect or with blocks, then photograph it for the model task too.',
    ],
    notes: ['Key Stage 1 history asks for "changes within living memory" and "events beyond living memory that are significant nationally", so comparing a Victorian school with your own is exactly on target. Punishments are named (the cane, the dunce\'s hat, lines) without detail. Class sizes come from a Durham University schools resource and a Wiltshire school history; the 1870, 1880 and 1891 Acts are quoted from the Act texts and Hansard.'],
    sources: [S.ncHist, S.durham, S.bsm, S.nem, S.ascl, { name: 'Education in England: the 1870 Elementary Education Act', url: 'https://education-uk.org/documents/acts/1870-elementary-education-act.html' }, { name: 'Historic England listing (via British Listed Buildings): Victoria Schools, Wellingborough, 1895', url: 'https://britishlistedbuildings.co.uk/101392597' }, S.wrenSchool],
  },

  'poem': {
    time: '20 minutes a poem',
    intro: 'Victorian children learned to write by copying: first strokes, then letters, then whole poems from a copybook. Pick a short poem, trace it, then copy it as neatly as you can.',
    steps: [
      'Do the <b>warm-up sheet</b> first: trace the curly strokes, then the letters.',
      'Choose a poem. Read it aloud together twice so it sounds like a song.',
      'Trace the grey words on the <b>trace</b> page, one line at a time.',
      'Copy the poem onto the <b>copy</b> page in your best handwriting. Tall letters touch the top, tails hang below.',
      'Draw a picture for the poem and decorate the border. Stick it in the green book.',
    ],
    printables: [
      { sheet: 'poems.html?only=warmup', pdf: 'poems-warmup.pdf', preview: 'poems-warmup.jpg', title: 'Warm-up: strokes and letters', desc: 'Curly strokes to trace, copperplate letters to look at, and the letter-size rule.', pages: '1 page, A4' },
      { sheet: 'poems.html?only=owl', pdf: 'poems-owl.pdf', preview: 'poems-owl.jpg', title: 'The Owl and the Pussy-Cat', desc: 'Edward Lear, 1871. Four lines: a boat, some honey and plenty of money.', pages: '2 pages, A4' },
      { sheet: 'poems.html?only=wind', pdf: 'poems-wind.pdf', preview: 'poems-wind.jpg', title: 'Who Has Seen the Wind?', desc: 'Christina Rossetti, 1872. A whole poem in eight short lines.', pages: '2 pages, A4' },
      { sheet: 'poems.html?only=swing', pdf: 'poems-swing.pdf', preview: 'poems-swing.jpg', title: 'The Swing', desc: 'Robert Louis Stevenson, 1885. Up in the air so blue.', pages: '2 pages, A4' },
      { sheet: 'poems.html?only=beard', pdf: 'poems-beard.pdf', preview: 'poems-beard.jpg', title: 'There Was an Old Man with a Beard', desc: 'Edward Lear, 1846. A limerick with two owls, a hen, four larks and a wren.', pages: '2 pages, A4' },
      { sheet: 'poems.html', pdf: 'poems.pdf', preview: 'poems.jpg', title: 'All eleven poems', desc: 'Lear, Rossetti, Stevenson and Carroll, plus Twinkle Twinkle and Mary Had a Little Lamb. Pick one from the menu at the top.', pages: '23 pages, A4' },
    ],
    facts: [
      { kid: 'Edward Lear made up the word "runcible" for the runcible spoon in The Owl and the Pussy-Cat. Nobody knows exactly what one is.', src: 'https://en.wikipedia.org/wiki/Runcible', srcName: 'Wikipedia' },
      { kid: 'Lear\'s Book of Nonsense came out in 1846. It is full of limericks, the funny five-line poems.', src: 'https://en.wikipedia.org/wiki/Edward_Lear', srcName: 'Wikipedia' },
      { kid: 'Christina Rossetti wrote a whole book of rhymes for little children called Sing-Song, in 1872.', src: 'https://en.wikipedia.org/wiki/Christina_Rossetti', srcName: 'Wikipedia' },
      { kid: 'Robert Louis Stevenson wrote 64 poems for A Child\'s Garden of Verses and dedicated the book to his childhood nurse, Alison Cunningham.', src: 'https://en.wikipedia.org/wiki/A_Child%27s_Garden_of_Verses', srcName: 'Wikipedia' },
      { kid: 'Victorian children wrote on slates because paper was expensive. They rubbed the writing off with a damp cloth, or their sleeve.', src: 'https://www.mylearning.org/resources/victorian-school-slate', srcName: 'My Learning' },
      { kid: 'Older children used a steel pen dipped in an ink well set into the desk. One child, the ink monitor, filled all the ink wells each morning.', src: 'https://www.objectlessons.org/childhood-and-games-victorians/ink-bottle-victorian-original/s67/a924/', srcName: 'Object Lessons' },
      { kid: 'In a copybook, each page started with a printed line at the top, and the child copied it again and again down the page.', src: 'https://en.wikipedia.org/wiki/Copybook_(education)', srcName: 'Wikipedia' },
      { kid: 'Vere Foster\'s copybooks cost a penny each in 1865, and about a million were sold in the first year.', src: 'https://en.wikipedia.org/wiki/Vere_Foster', srcName: 'Wikipedia' },
      { kid: 'Fancy Victorian handwriting with loops and thick-and-thin strokes is called copperplate, because the copybooks were printed from engraved copper plates.', src: 'https://en.wikipedia.org/wiki/Copperplate_script', srcName: 'Wikipedia' },
    ],
    gallery: ['owl-pussycat.jpg', 'copybook.jpg', 'steel-pens.jpg', 'stevenson-title.jpg'],
    ideas: [
      'Write the poem with a real dip pen or a brush pen to feel like a Victorian.',
      'Make a border of the things in the poem: an owl, a boat, a guitar, stars.',
      'Learn the poem by heart and say it to the class.',
      'Copy just four lines if eight feel too many. Neat beats long.',
      'Try the copperplate alphabet on the warm-up sheet with a pencil, slowly.',
    ],
    notes: ['The Year 2 handwriting goals are, in the curriculum\'s words, to "form lower-case letters of the correct size relative to one another", to "start using some of the diagonal and horizontal strokes needed to join letters", to write capitals and digits of the correct size, and to "use spacing between words that reflects the size of the letters". The trace page helps with size and spacing; the copy page is the real test. All the poems are public domain, copied from Wikisource and Project Gutenberg editions (the Rossetti text is the 1893 edition of Sing-Song).'],
    sources: [S.ncEng, { name: 'Wikisource: Nonsense Songs (1871)', url: 'https://en.wikisource.org/wiki/Nonsense_Songs,_Stories,_Botany,_and_Alphabets/The_Owl_and_the_Pussy-cat' }, { name: 'Project Gutenberg: Sing-Song', url: 'https://www.gutenberg.org/ebooks/76703' }, { name: 'Project Gutenberg: A Child\'s Garden of Verses', url: 'https://www.gutenberg.org/ebooks/25609' }, { name: 'Object Lessons (Islington Education Library): Victorian copybook', url: 'https://www.objectlessons.org/a1004/' }],
  },

  'wrenbury-walk': {
    time: 'a 45-minute walk',
    intro: 'Geographers sort what they see into human features, made by people, and physical features, made by nature. Wrenbury has plenty of both: a church, a canal with lift bridges, a Victorian station and school, a river, flat fields and hills far away.',
    steps: [
      'Print the spotter sheet and take it on a clipboard with a pencil, or just take a phone for photos.',
      'Start on the village green. Walk to the canal and the lift bridge, along the towpath to the Dusty Miller, and back by the lane. A grown-up checks the route first.',
      'Choose <b>three human</b> features and <b>three physical</b> features. Draw them in the boxes, or photograph them.',
      'Back home, write what each one is. Which human feature is the oldest? Which is the newest?',
      'Stick photos on the photo page, or draw from your photos.',
    ],
    printables: [
      { sheet: 'walk.html', pdf: 'walk.pdf', preview: 'walk.jpg', title: 'Wrenbury walk: spotter sheet', desc: 'Six drawing boxes, a Wrenbury tick list with little symbols, and a photo page.', pages: '3 pages, A4' },
    ],
    facts: [
      { kid: 'A human feature is something people made: a bridge, a church, a road. A physical feature is natural: a river, a hill, a field.', src: NC_GEOG, srcName: 'National curriculum' },
      { kid: 'St Margaret\'s Church was built in the early 1500s, so it was already more than 300 years old when Victoria became queen.', src: 'https://en.wikipedia.org/wiki/St_Margaret%27s_Church,_Wrenbury', srcName: 'Wikipedia' },
      { kid: 'The three wooden lift bridges on the canal were built about 1790 by the famous engineer Thomas Telford. The road one by the Dusty Miller lifts at the push of a button.', src: S.parish.url, srcName: 'Wrenbury Parish Council' },
      { kid: 'Wrenbury railway station opened in September 1858, when Victoria had been queen for 21 years. Trains still stop there.', src: 'https://en.wikipedia.org/wiki/Wrenbury_railway_station', srcName: 'Wikipedia' },
      { kid: 'Our own school has a Victorian building with a date stone saying 1879, a little bell tower and a weathervane.', src: S.wrenSchool.url, srcName: 'Historic England listing' },
      { kid: 'The River Weaver runs right beside the Dusty Miller, which was a watermill in Victorian times.', src: 'https://camra.org.uk/pubs/136123', srcName: 'CAMRA' },
      { kid: 'Wrenbury sits on the Cheshire Plain: flat or gently rolling farmland with small sandstone ridges running across it.', src: 'https://publications.naturalengland.org.uk/publication/6076647514046464', srcName: 'Natural England' },
      { kid: 'The meres near Marbury are lakes left behind when the ice melted at the end of the Ice Age, 10,000 to 15,000 years ago.', src: 'https://en.wikipedia.org/wiki/Quoisley_Meres', srcName: 'Wikipedia' },
      { kid: 'Raw Head, the top of the Bickerton Hills you can see to the north-west, is 227 metres high: about 50 double-decker buses stacked up.', src: 'https://en.wikipedia.org/wiki/Bickerton_Hills', srcName: 'Wikipedia' },
      { kid: 'The name Wrenbury is said to mean "old forest where wrens live".', src: 'https://en.wikipedia.org/wiki/Wrenbury-cum-Frith', srcName: 'Wikipedia' },
    ],
    gallery: ['wrenbury-bridge.jpg', 'wrenbury-dusty-miller.jpg', 'wrenbury-church.jpg', 'wrenbury-station.jpg'],
    ideas: [
      'Take a wax crayon and paper and make a rubbing of the date stone on the school or a bridge plate.',
      'Count the lift bridges, and count the boats in the marina.',
      'Look for the oldest thing and the newest thing you can see from one spot.',
      'Photograph the same view twice: once zoomed on a human feature, once on a physical feature.',
      'Draw a tiny map of the walk afterwards: it counts towards the map task too.',
      'Spot things that were there in Victorian times and things that were not (cars, street lights, tarmac).',
    ],
    notes: ['Hold hands near the canal and at the lift bridges; the road bridge carries traffic and children should not touch its controls. The station is a request stop: look from the road rather than the platform. The suggested loop is about a mile; check it on a map first.'],
    sources: [S.ncGeog, S.parish, { name: 'Wikipedia: Wrenbury-cum-Frith', url: 'https://en.wikipedia.org/wiki/Wrenbury-cum-Frith' }, { name: 'Historic England listing (via British Listed Buildings): Wrenbury Church Bridge', url: 'https://britishlistedbuildings.co.uk/101357482-wrenbury-church-bridge-wrenbury-cum-frith' }, S.wrenSchool, { name: 'Natural England: Shropshire, Cheshire and Staffordshire Plain (NCA 61)', url: 'https://publications.naturalengland.org.uk/publication/6076647514046464' }],
  },

  'queen-victoria-picture': {
    time: 'about an hour',
    intro: 'Victoria was painted and photographed all her life, so we know exactly what she looked like at every age. Make your own picture of her, with any materials you like.',
    steps: [
      'Look at the real portraits on this page: young, mother, old queen. Choose which Victoria to draw.',
      'Follow the <b>six steps</b> on the sheet to draw her face lightly in pencil.',
      'Draw her big, inside the portrait frame on the sheet, or on your own paper.',
      'Add colour: dark hair, a blue sash, a gold crown, and white lace (or black if she is old).',
      'Try an art idea: collage, silhouette, paint, or your own Penny Black stamp.',
    ],
    printables: [
      { sheet: 'portrait.html', pdf: 'portrait.pdf', preview: 'portrait.jpg', title: 'Draw Queen Victoria', desc: 'Six-step drawing guide, a Victorian portrait frame to fill, colour guide, and six art ideas with a stamp frame.', pages: '3 pages, A4' },
    ],
    facts: [
      { kid: 'In the famous painting from 1842, the young queen has dark hair parted in the middle and looped over her ears, a white dress with lace, and a small sparkling tiara.', src: 'https://commons.wikimedia.org/wiki/File:The_Young_Queen_Victoria.jpg', srcName: 'Winterhalter, 1842' },
      { kid: 'In her coronation portrait she wears a crown and long robes and holds a sceptre. She was 19.', src: 'https://commons.wikimedia.org/wiki/File:Coronation_portrait_of_Queen_Victoria_-_Hayter_1838.jpg', srcName: 'Hayter, 1838' },
      { kid: 'She was small, about 4 feet 11 inches tall, so painters often showed her sitting on a throne to look grand.', src: 'https://www.countryfile.com/people/royals/how-tall-was-queen-victoria', srcName: 'Countryfile' },
      { kid: 'After Prince Albert died in 1861 she wore black for the rest of her life.', src: S.royal.url, srcName: 'royal.uk' },
      { kid: 'The 1882 photograph by Alexander Bassano shows her in black with a white veil and a small diamond crown. People kept still faces for photographs, because they took so long.', src: 'https://commons.wikimedia.org/wiki/File:Queen_Victoria_by_Bassano.jpg', srcName: 'Bassano, 1882' },
      { kid: 'Her profile was on the Penny Black in 1840, when she was 21, and her head has been on stamps and coins ever since.', src: 'https://en.wikipedia.org/wiki/Penny_Black', srcName: 'Wikipedia' },
    ],
    gallery: ['victoria-young.jpg', 'victoria-coronation.jpg', 'victoria-1856.jpg', 'victoria-family.jpg', 'victoria-bassano.jpg', 'penny-black.jpg'],
    ideas: [
      'Collage: fabric for the dress, foil for the crown, a paper doily for the lace.',
      'Silhouette: draw her side view on black paper, cut it out, stick it on white.',
      'Paint a background first, then the dress, then the face last.',
      'Design a stamp with her head in profile, like the Penny Black.',
      'Draw her twice: young and old, side by side.',
      'Make a salt-dough medal with her face and paint it gold.',
    ],
    notes: ['All the portraits on this page are public domain: the artists and photographers died more than 70 years ago, and the pictures are from Wikimedia Commons with the licence checked on each file page. A photo of your picture can go straight in the green book.'],
    sources: [{ name: 'Wikimedia Commons: The Young Queen Victoria (Winterhalter, 1842)', url: 'https://commons.wikimedia.org/wiki/File:The_Young_Queen_Victoria.jpg' }, { name: 'Wikimedia Commons: Queen Victoria by Bassano (1882)', url: 'https://commons.wikimedia.org/wiki/File:Queen_Victoria_by_Bassano.jpg' }, S.royal],
  },

  'modern-school': {
    time: 'as long as you like',
    intro: 'There is already a tool for this one. Astra Architect lets you build a modern school in blocks, walk around inside it, run a school day, and print the plans to label.',
    app: { title: 'Build it in Astra Architect', text: 'Place rooms on the site, stack them, choose windows and colours, then print the plans and elevations for the green book.', url: 'https://philhandley.github.io/astra-architect/v2/', button: 'Open Astra Architect' },
    steps: [
      'Open Astra Architect and build your school: classrooms, a hall, a pool, whatever makes it a great place to learn.',
      'Walk inside it and run a school day. Would you want to go there?',
      'Print the plans and elevations from the app, or draw the front of your school on paper.',
      'Label the parts: write what each room is for and why it is there.',
      'Tick the features you included on the checklist sheet.',
    ],
    printables: [
      { sheet: 'model-school.html', pdf: 'model-school.pdf', preview: 'model-school.jpg', title: 'Features checklist and plan sheet', desc: 'Page 3 lists what a modern school could have; page 1 has front and plan drawing frames.', pages: '3 pages, A4' },
    ],
    factsTitle: 'Things to think about',
    facts: [
      { kid: 'Where does the daylight come from? Where would you put the biggest windows?' },
      { kid: 'Where do you go when you need quiet? And where do you go when you need to run?' },
      { kid: 'How does everyone get in, including someone in a wheelchair or a pushchair?' },
      { kid: 'What can you see from your classroom window: the sea, a field, a playground, a waterfall?' },
      { kid: 'Where do you eat, and where do you grow things to eat?' },
      { kid: 'What is the one thing your school has that no other school has?' },
    ],
    gallery: ['architect.jpg'],
    ideas: [
      'Give every room a label and a reason: "Library, because reading is quiet."',
      'Put the running track on the roof and the aquarium in the corridor.',
      'Show where the sun is at playtime with a yellow circle on the plan.',
      'Draw the children: how many fit in your hall?',
      'Compare it with the Victorian school from task one. List three things you kept and three you changed.',
    ],
    notes: ['Astra Architect\'s Print button makes A4 landscape sheets: an overview, one plan per floor and the elevations, with room numbers and a key. The Share button makes a link to send to school.'],
    sources: [{ name: 'Astra Architect', url: 'https://philhandley.github.io/astra-architect/v2/' }],
  },

  'map': {
    time: 'about an hour',
    intro: 'A map is a drawing of a place as a bird would see it from above, using small symbols instead of pictures. The key tells the reader what each symbol means.',
    steps: [
      'Choose a place you know well: your bedroom, the whole house, the garden, or the park.',
      'Walk round it. What is next to what? What is the biggest thing?',
      'Print the map sheet. Draw the outline from above, then add the big things, then the small things.',
      'Use a symbol for each kind of thing. Copy symbols from the symbol sheet, or invent your own.',
      'Fill in the key, add the compass (N at the top) and a title.',
    ],
    printables: [
      { sheet: 'map.html', pdf: 'map.pdf', preview: 'map.jpg', title: 'My map: grid, compass and key', desc: 'A gridded map sheet with a compass rose and key box, 28 symbols to copy, and six how-to steps.', pages: '3 pages, A4' },
    ],
    facts: [
      { kid: 'The Ordnance Survey says maps usually show the land "as it would be seen from above, looking directly down". That is a bird\'s-eye view.', src: 'https://www.ordnancesurvey.co.uk/documents/resources/map-reading.pdf', srcName: 'Ordnance Survey' },
      { kid: 'A key, also called a legend, explains "what each and every symbol on the map represents". Every map needs one.', src: 'https://www.ordnancesurvey.co.uk/documents/resources/map-reading.pdf', srcName: 'Ordnance Survey' },
      { kid: 'Year 2 geographers use the four compass directions, north, south, east and west, and words like near, far, left and right.', src: NC_GEOG, srcName: 'National curriculum' },
      { kid: 'Real maps use tiny symbols too. On Ordnance Survey maps a church is drawn with its tower or spire, and PO means post office.', src: 'https://www.ordnancesurvey.co.uk/documents/resources/25k-raster-legend.pdf', srcName: 'Ordnance Survey legend' },
      { kid: 'While Victoria was queen, the Ordnance Survey mapped all of Cheshire in huge detail, between 1870 and 1875, including every field in Wrenbury.', src: 'https://maps.nls.uk/os/county-series/dates-england-and-wales.html', srcName: 'National Library of Scotland' },
      { kid: 'The Victorian map of Chester on this page was drawn between 1871 and 1891. Can you find the river, the walls and the railway on it?', src: 'https://commons.wikimedia.org/wiki/File:Map_of_Chester_and_its_Environs_OS_Map_name_038-01,_Ordnance_Survey,_1871-1891.png', srcName: 'Ordnance Survey, 1871 to 1891' },
    ],
    gallery: ['os-map.jpg'],
    ideas: [
      'Map your bedroom first (10 minutes), then try the whole garden.',
      'Make the map a treasure map: hide something and mark it with an X for a grown-up to find.',
      'Use colours in the key: green for grass, blue for water, grey for paths.',
      'Add a scale: "one square = one big step".',
      'Map the Wrenbury walk from the walk task, with the church, the canal and the station.',
      'Try to draw the map of a place from memory, then check it by walking round.',
    ],
    notes: ['Key Stage 1 geography asks children to "devise a simple map; and use and construct basic symbols in a key" and to "use simple compass directions (North, South, East and West) and locational and directional language". The grid is 1 cm, which helps with keeping things the right size relative to each other.'],
    sources: [S.ncGeog, { name: 'Ordnance Survey: map reading guide (PDF)', url: 'https://www.ordnancesurvey.co.uk/documents/resources/map-reading.pdf' }, { name: 'Ordnance Survey: 1:25 000 map legend (PDF)', url: 'https://www.ordnancesurvey.co.uk/documents/resources/25k-raster-legend.pdf' }, { name: 'National Library of Scotland: County Series survey dates', url: 'https://maps.nls.uk/os/county-series/dates-england-and-wales.html' }],
  },

  'materials': {
    time: 'an afternoon',
    intro: 'Everything is made of something. Go round the house like a detective, sort what you find by material, and test what each material is like. Then see how Victorian things were different.',
    steps: [
      'Print the sorting chart. Hunt for things made of wood, metal, plastic, glass, fabric, and paper or card.',
      'Write or draw each thing in the right box. Choose the main material if there are two.',
      'Pick eight things and test them: hard? bendy? shiny? see-through? waterproof? magnetic?',
      'Write one thing you noticed. Why is a window glass and not wood?',
      'Try the Victorian page: what were the old versions of your things made of?',
    ],
    printables: [
      { sheet: 'materials.html', pdf: 'materials.pdf', preview: 'materials.jpg', title: 'Material hunt and property tests', desc: 'A six-box sorting chart, a tick table for six property tests, and a Victorian-or-modern page.', pages: '3 pages, A4' },
    ],
    facts: [
      { kid: 'The curriculum says it best: spoons "can be made from plastic, wood, metal, but not normally from glass".', src: S.ncSci.url, srcName: 'National curriculum' },
      { kid: 'Wood comes from trees, glass is made from melted sand, and metal is dug out of the ground in rock called ore.', src: 'https://en.wikipedia.org/wiki/Glass', srcName: 'Wikipedia' },
      { kid: 'Wool comes from sheep, cotton grows as fluff around the seeds of the cotton plant, and rubber is the milky sap of a tree.', src: 'https://en.wikipedia.org/wiki/Cotton', srcName: 'Wikipedia' },
      { kid: 'Only some metals are magnetic. Iron and steel stick to a fridge magnet; copper coins and aluminium foil do not.', src: 'https://en.wikipedia.org/wiki/Ferromagnetism', srcName: 'Wikipedia' },
      { kid: 'Alexander Parkes showed one of the first man-made plastics, Parkesine, at a big exhibition in London in 1862, while Victoria was queen.', src: 'https://collection.sciencemuseumgroup.org.uk/people/ap26659', srcName: 'Science Museum' },
      { kid: 'Bakelite, the first fully man-made plastic that everyone used, was only invented in 1907, six years after Victoria died. So Victorian homes had almost no plastic.', src: 'https://blog.sciencemuseum.org.uk/bakelite-the-first-synthetic-plastic/', srcName: 'Science Museum' },
      { kid: 'The Crystal Palace of 1851 was a building made almost entirely of glass and iron: 293,655 panes of glass. Counting one a second would take three and a half days.', src: 'https://museum.wa.gov.au/online-collections/node/86014', srcName: 'Western Australian Museum' },
      { kid: 'Victorian kitchens had a cast-iron range for cooking, like the one in the Science Museum made in London between 1848 and 1860.', src: 'https://collection.sciencemuseumgroup.org.uk/objects/co48606/cast-iron-cooking-range', srcName: 'Science Museum' },
    ],
    gallery: ['crystal-palace.jpg', 'crystal-palace-inside.jpg', 'kitchen-range.jpg', 'parkes-plaque.jpg'],
    ideas: [
      'Do the tests with a torch, a fridge magnet and a dropper or a wet finger.',
      'Find something made of two materials, like a pencil, and say what each part is.',
      'Sort your toys by material: how many are plastic?',
      'Find the oldest object in the house. What is it made of?',
      'Photograph your sorted piles for the green book.',
      'Make a "material of the day" label and stick it on something new each day.',
    ],
    notes: ['Year 2 science: "identify and compare the suitability of a variety of everyday materials, including wood, metal, plastic, glass, brick, rock, paper and cardboard for particular uses" and "find out how the shapes of solid objects made from some materials can be changed by squashing, bending, twisting and stretching." The property tests cover both. Sources disagree on whether Parkesine dates from 1855 or 1862, so the sheets say "shown in 1862".'],
    sources: [S.ncSci, { name: 'Science Museum Group: Alexander Parkes', url: 'https://collection.sciencemuseumgroup.org.uk/people/ap26659' }, { name: 'Science Museum blog: Bakelite', url: 'https://blog.sciencemuseum.org.uk/bakelite-the-first-synthetic-plastic/' }, { name: 'Western Australian Museum: the Crystal Palace', url: 'https://museum.wa.gov.au/online-collections/node/86014' }],
  },

  'bathing-machine': {
    time: 'about an hour, plus the model',
    explore: [
      { page: 'bathing-machine.html', preview: 'explore-bathing.jpg', fig: 'Fig. 03', title: "Queen Victoria's bathing machine", desc: 'Modelled at its real size, 12 feet by 7, on the grooved stone rails it really ran on. Wind the winch to roll it down into the sea, go for a swim with the dipper, and cut it open to find the Queen\'s plumbed-in loo.' },
    ],
    intro: 'In Victorian times you could not just run into the sea in your costume. You climbed into a wooden hut on wheels, a bathing machine, and a horse pulled you into the water. Queen Victoria had her own. Now design yours.',
    steps: [
      'Read how a real bathing machine worked (sheet 3) and look at the pictures below: Queen Victoria\'s own machine from every side, and some old ones.',
      'Design yours on the <b>design studio</b> page: wheels, steps, a door at the sea end, a roof, a flag, and how it moves.',
      'Draw the <b>inside</b>: what does a swimmer need? What would you add?',
      'Give it a name and tick how it moves: horse, steam, sails, rockets, or your own idea.',
      'Make the <b>cut-out model</b> on card, colour it, and photograph it for the green book.',
    ],
    printables: [
      { sheet: 'bathing-machine-pictures.html', pdf: 'bathing-machine-pictures.pdf', preview: 'bathing-machine-pictures.jpg', title: 'Pictures of the real machine, and what each part did', desc: 'Queen Victoria\'s own machine photographed from every side, with things to count; then a picture with its parts numbered and a fact about each one, from the roof and the curly iron brackets down to the stone rails.', pages: '2 pages, A4' },
      { sheet: 'draw-bathing-machine.html', pdf: 'draw-bathing-machine.pdf', preview: 'draw-bathing-machine.jpg', title: 'Draw it like an architect: side view and plan', desc: 'The real Osborne machine drawn to scale on a lettered grid, with an empty grid to copy it into, square by square.', pages: '2 pages, A4' },
      { sheet: 'bathing-machine.html', pdf: 'bathing-machine.pdf', preview: 'bathing-machine.jpg', title: 'Design studio, inside view, how it worked, cut-out model, modern ideas', desc: 'A beach to draw your machine on, a cut-away inside view, a labelled diagram of how they worked, a net to cut and fold, the Margate sauna machine, and twenty modern ideas to borrow.', pages: '6 pages, A4' },
    ],
    facts: BM_FACTS,
    gallery: ['osborne-machine-side.jpg', 'osborne-machine-front.jpg', 'osborne-machine-corner.jpg', 'osborne-machine-2022.jpg', 'osborne-bathing-machine.jpg', 'bathing-machines.jpg', 'bathing-horse.jpg', 'bathing-costumes.jpg'],
    ideas: [
      '<b>Dazzle stripes:</b> paint black-and-white zigzags, like the camouflage ships of a hundred years ago, so it hides against the sea.',
      '<b>Solar roof:</b> panels on top that warm the shower water and light the inside.',
      '<b>Periscope:</b> spy on the beach from inside, like a submarine.',
      '<b>Caterpillar tracks or crab legs:</b> so it crawls or walks into the sea by itself. No horse needed.',
      '<b>Fold-out slide:</b> straight from the sea door into the waves, with a diving board on the roof.',
      '<b>Sauna stove:</b> a tiny wood stove and chimney, like the Margate one, to warm up after a cold dip.',
      '<b>Living roof:</b> grass, flowers and a bee hotel on top; a rain barrel for the shower and a little wind turbine.',
      '<b>Mirror walls:</b> shiny sides so it disappears into the sea and the sky.',
      '<b>Animal shape:</b> a whale whose mouth is the door, a crab, a seagull.',
      '<b>Glow:</b> colour-changing lights, glow-in-the-dark stars on the ceiling, and a glass floor to watch the fish.',
      '<b>Pedal power or sails:</b> bicycle pedals inside, or a mast and sail so the wind pushes it along the sand.',
      '<b>Fold-up or double-decker:</b> one that folds flat like a tent, or one with a bunk on top for a friend.',
      '<b>Name, number, flag:</b> a boat name, a number like the Shanklin machines, and a flag you design.',
      '<b>Secret drawer and a bell:</b> a hidden drawer for treasure and shells, and a bell to ring when you are ready to come back.',
      '<b>Victorian wallpaper inside:</b> paper the walls with a William Morris pattern of birds and flowers, like a real Victorian room.',
      '<b>For someone special:</b> design one for a dog, a whole class, or the Queen.',
    ],
    extra: { title: 'Bathing machines today', html: `
      <div class="twocol">
        <div class="note gold">
          <h3 style="margin:0 0 6px">The Margate sauna machine, 2019</h3>
          <p>Bathing machines never quite went away. In 2019 the seaside skincare company Haeckels put a brand-new one on the main sands at Margate: a wooden hut on big oak wheels with a steel frame, built the way the Victorian ones were, with a wood-burning <b>sauna</b> inside. You get hot, then sprint into the cold sea a few metres away.</p>
          <p>The steps fold up to become the door, and a waxed cloth awning rolls out over the front. Twenty people helped build it, including an architect, joiners, a sauna maker and a wheelwright. It was paid for by people chipping in, and their names are engraved on the side. Anyone can use it for free.</p>
          <p style="margin:0"><a href="https://www.dezeen.com/2019/12/23/haeckels-margate-bathing-machine-sauna/" target="_blank" rel="noopener">See the photos on Dezeen</a> (Natashah Hitti, 23 December 2019). The photos are Dezeen\'s, so they are not copied here.</p>
        </div>
        <div class="note">
          <h3 style="margin:0 0 6px">Other modern cousins</h3>
          <ul style="margin:0; padding-left:20px">
            <li><b>Beach huts.</b> When bathing machines stopped moving, many were left on the sand as beach huts. Southwold, Whitstable and Wells still have rows of painted ones.</li>
            <li><b>Shepherd\'s huts and tiny houses on wheels.</b> The same idea: a room you can tow to a nice view.</li>
            <li><b>Mobile saunas.</b> In Finland and Norway people tow saunas on trailers to lakes and fjords, then jump in the cold water.</li>
            <li><b>Changing-room tents and pop-up pods</b> that fold flat: the Victorian modesty hood, reinvented.</li>
          </ul>
          <p style="margin:10px 0 0"><a href="../sheets/bathing-machine.html">Sheet 5 of the printable</a> has the Margate machine drawn out and twenty modern ideas with pictures.</p>
        </div>
      </div>` },
    notes: ['The class story is Gloria Whelan\'s picture book Queen Victoria\'s Bathing Machine (illustrated by Nancy Carpenter, 2014): a playful story in which Albert dreams up a hut on wheels so the Queen can swim in private. The real machine was restored and stands on the beach at Osborne House, Isle of Wight, where English Heritage looks after it. The year it was built is not confirmed in any source we could read, so the sheets do not give one.'],
    sources: [S.osborne, { name: 'English Heritage blog: five ways to have beach fun like Queen Victoria', url: 'https://www.english-heritage.org.uk/visit/inspire-me/blog/blog-posts/five-ways-beach-fun-like-queen-victoria/' }, { name: 'Emsworth Museum: Bathing belles and bathing machines (PDF)', url: 'https://emsworthmuseum.org.uk/emcms/files/original/021849c92f68b6c062c471f2e3cf6335.pdf' }, { name: 'The Victorian Web: Queen Victoria and her bathing machine', url: 'https://www.victorianweb.org/victorian/history/victoria/7.html' }, { name: 'Margate Civic Society: Margate history', url: 'https://margatecivicsociety.org.uk/Margate_History.html' }, { name: 'Kirkus Reviews: Queen Victoria\'s Bathing Machine', url: 'https://www.kirkusreviews.com/book-reviews/gloria-whelan/queen-victorias-bathing-machine/' }],
  },

  'fact-file': {
    time: 'two or three sittings',
    intro: 'Queen Victoria was queen for 63 years, longer than anyone before her. She had nine children, loved her dog Dash, and was the first monarch to ride a train. Pick your five favourite facts and make a fact file.',
    steps: [
      'Read the <b>fact bank</b> with a grown-up and tick the facts you like best.',
      'Print the fact file sheet. Fill in her name, dates and children from the dates page.',
      'Write five facts in your own words. One sentence each is plenty.',
      'Draw her in the portrait box, or cut out a picture from the pictures page.',
      'Add the timeline strip and decorate the border. Stick it in the green book.',
    ],
    printables: [
      { sheet: 'fact-file.html', pdf: 'fact-file.pdf', preview: 'fact-file.jpg', title: 'Queen Victoria fact file', desc: 'A fact file template with portrait box and timeline, a fact bank of twenty-one facts to choose from, pictures to cut out and her dates.', pages: '3 pages, A4' },
      { sheet: 'timeline.html', pdf: 'timeline.pdf', preview: 'timeline.jpg', title: 'Timeline poster, 1837 to 1901', desc: 'Her whole reign on one landscape sheet, with fourteen events.', pages: '1 page, A4 landscape' },
    ],
    facts: VFACTS.slice(0, 9),
    gallery: ['victoria-young.jpg', 'victoria-family.jpg', 'victoria-1856.jpg', 'victoria-bassano.jpg', 'osborne-house.jpg', 'penny-black.jpg', 'jubilee.jpg', 'victoria-landseer.jpg'],
    ideas: [
      'Make it a passport: a small book with her photo, dates and "places visited".',
      'Write one fact as a riddle: "I was the first queen to ride on me. What am I?"',
      'Add a map showing places named after her: Victoria in Australia, Lake Victoria, Victoria Falls.',
      'Draw her family tree: nine children in a row.',
      'Make a top-trumps card: height 150 cm, children 9, years as queen 63.',
      'Record yourself reading the five facts and play it to the class.',
    ],
    notes: ['Victoria is named in the Key Stage 1 history curriculum as an example of a "significant individual" to compare with Elizabeth I. Dates follow Westminster Abbey, royal.uk and the Royal Collection Trust. Two things the research could not settle are left off: whether she was the first monarch photographed, and exactly how many diary volumes survive.'],
    sources: [S.royal, S.abbey, { name: 'Royal Collection Trust: Queen Victoria (1819 to 1901)', url: 'https://albert.rct.uk/queen-victoria-1819-1901' }, S.osborne, S.ncHist],
  },

  'model-school': {
    time: 'a weekend project',
    intro: 'Build a school you can hold: a Victorian one with a bell tower and tall windows, or a modern one with a pool on the roof. Print the cut-out models below, or use recycled boxes, LEGO, lolly sticks and card.',
    explore: [{ page: 'wrenbury-school.html', preview: 'explore-wrenbury.jpg', fig: 'Fig. 02', title: 'Our school in 1879, and a new one', desc: 'Wrenbury School in 3D from the 1897 map and a 2006 photograph, beside a new X-shaped school on a plot just the same size. Press Watch it fold to see the paper pieces fold up into each school.' }],
    steps: [
      'Decide: Victorian, modern, or your dream school. Tick it on the plan sheet.',
      'Draw the front and a view from above. Collect materials: boxes, tubes, card, bottle tops.',
      'Build the main box first, then the roof, then the small parts. Paint before you glue on windows.',
      'Tick at least five features from the checklist so people can tell which kind of school it is.',
      'Photograph it from the front and from above, stick the photos on the photo page and say what you are proud of.',
    ],
    printables: [
      { sheet: 'school-models.html', pdf: 'school-models.pdf', preview: 'school-models.jpg', title: 'Print, cut and stick: two model schools', desc: 'The 1852 school at Monks Horton with its bell and chimney, and a modern school with a roof garden, big glass windows and outside steps. Print on thin card.', pages: '4 pages, A4' },
      { sheet: 'model-school.html', pdf: 'model-school.pdf', preview: 'model-school.jpg', title: 'Plan sheet, photo page and features checklist', desc: 'Drawing frames and a materials list, two photo frames with captions, and Victorian or modern feature checklists.', pages: '3 pages, A4' },
    ],
    facts: [
      { kid: 'Wrenbury\'s own Victorian school building, dated 1879, is red brick with a little bell tower and a weathervane, so a cereal box and a kitchen-roll tube are perfect.', src: S.wrenSchool.url, srcName: 'Historic England listing' },
      { kid: 'A big Victorian board school in Wellingborough had separate buildings for juniors and infants, and the word BOYS carved over one door.', src: 'https://britishlistedbuildings.co.uk/101392597', srcName: 'Historic England listing' },
      { kid: 'The headteacher often lived in a house joined onto the school or right next door.', src: 'https://britishlistedbuildings.co.uk/101392597', srcName: 'Historic England listing' },
      { kid: 'Inside, a Victorian classroom held up to 80 children in rows of desks, all facing the front.', src: S.durham.url, srcName: 'Durham University' },
      { kid: 'A modern school has lots of classrooms, a hall, a library and a playground. A dream school might add a pool, an aquarium or a running track on the roof.' },
      { kid: 'Models do not fit in the green book, so the photo page matters: one photo from the front, one from above, and a sentence.' },
    ],
    gallery: ['board-school.jpg', 'classroom.jpg', 'architect.jpg'],
    ideas: [
      'Build both cut-out schools and put them side by side: what changed in 170 years?',
      'Make the roof lift off so you can see the classroom inside, with desks made of matchboxes.',
      'Cling film or clear packaging makes good window glass.',
      'Put BOYS and GIRLS signs over two doors.',
      'Use a kitchen-roll tube for a bell tower and a bottle top for the bell.',
      'Build the dream school from Astra Architect for real, block by block.',
      'Add a playground with a wall down the middle, or a running track made of a ribbon.',
    ],
    notes: ['Nothing 3D fits in the green homework book, so the photo page matters: a front photo, a top photo and a sentence. Your teacher collects points from the book.'],
    sources: [S.wrenSchool, { name: 'Historic England listing (via British Listed Buildings): Victoria Schools, Wellingborough', url: 'https://britishlistedbuildings.co.uk/101392597' }, S.durham],
  },

  'interview': {
    time: 'an hour with someone older',
    intro: 'Grandparents and parents went to school in a world without tablets and whiteboards, but after slates and ink wells. Ask them what it was like, write it down, and compare it with your own school.',
    steps: [
      'Choose someone older: a grandparent, a parent, an aunt, a neighbour. Ask when you can interview them.',
      'Print the interview sheets. Ask the twelve questions and write their answers, or record them on a phone.',
      'Fill in the <b>Then and now</b> table: their side and your side.',
      'Circle "same" or "different" on each row.',
      'Write your findings: the biggest difference, something that was the same, and what you would have liked to try.',
    ],
    printables: [
      { sheet: 'interview.html', pdf: 'interview.pdf', preview: 'interview.jpg', title: 'School days interview', desc: 'Twelve questions with answer lines, a then-and-now table, and a findings page with a drawing box.', pages: '4 pages, A4' },
    ],
    facts: [
      { kid: 'From 1946 every child at school got free milk. In 1971 it stopped for children aged 7 to 11, so ask whether they remember the little bottles.', src: 'https://www.westminster.ac.uk/news/regina-keith-for-the-conversation-on-the-history-of-free-school-meals-in-the-uk', srcName: 'University of Westminster' },
      { kid: 'Dip pens and ink wells were still used in schools in the 1950s and 1960s. Ask about ink blots!', src: 'https://en.wikipedia.org/wiki/Dip_pen', srcName: 'Wikipedia' },
      { kid: 'The first school television programmes were shown in 1957, so some grandparents watched lessons on a TV wheeled into the classroom.', src: 'https://en.wikipedia.org/wiki/Timeline_of_schools_broadcasts_in_the_UK', srcName: 'Wikipedia' },
      { kid: 'Teachers in state schools in England were banned from using the cane in the late 1980s. Some grandparents will remember it.', src: 'https://schoolsweek.co.uk/when-did-schools-ban-corporal-punishment/', srcName: 'Schools Week' },
      { kid: 'The BBC Micro computer came out in 1981, and more than four out of five UK schools had at least one: usually one for the whole school.', src: 'https://www.computerhistory.org/?p=3768', srcName: 'Computer History Museum' },
      { kid: 'The national curriculum, the list of what every school must teach, began with a law in 1988. Key Stage 1 tests started in 1991.', src: 'https://www.legislation.gov.uk/ukpga/1988/40/contents', srcName: 'legislation.gov.uk' },
      { kid: 'Interactive whiteboards arrived in primary schools in the 2000s. In 2003 the government paid for boards in 21 council areas to start with.', src: 'https://dera.ioe.ac.uk/id/eprint/21564/1/whiteboards_expansion.pdf', srcName: 'DCSF evaluation, 2007' },
    ],
    gallery: ['copybook.jpg', 'steel-pens.jpg'],
    ideas: [
      'Ask for a school photo of them and stick a copy next to your school photo.',
      'Ask them to teach you a playground game they played, then play it at school.',
      'Ask what they got in trouble for. (Keep it kind.)',
      'Make a Venn diagram: things only they had, things only you have, things you both had.',
      'Interview two people from different ages and compare all three schools.',
      'Record the interview and play the best answer to the class.',
    ],
    notes: ['This covers "changes within living memory" in the Key Stage 1 history curriculum. Let the older person ramble: the best material comes from the stories, not the questions. The twelve questions on the sheet are a starting set; the research brief has twenty-five if you want more.'],
    sources: [S.ncHist, { name: 'University of Westminster: the history of free school meals', url: 'https://www.westminster.ac.uk/news/regina-keith-for-the-conversation-on-the-history-of-free-school-meals-in-the-uk' }, { name: 'Schools Week: when did schools ban corporal punishment?', url: 'https://schoolsweek.co.uk/when-did-schools-ban-corporal-punishment/' }, { name: 'Computer History Museum: BBC Micro', url: 'https://www.computerhistory.org/?p=3768' }],
  },

  'victorian-day': {
    time: 'two sittings',
    intro: 'A Victorian child\'s day started early with chores, had school in the middle, and ended by candlelight. Make a tiny eight-page booklet from one sheet of paper that tells the whole day.',
    steps: [
      'Read the two example days (poorer child, richer child) on sheet 3 and the facts below.',
      'Print the booklet sheet: the guided one has sentence starters, the blank one is all yours.',
      'Fold and cut it into an eight-page booklet (the instructions are on sheet 3).',
      'On each page draw the picture and finish the sentence: wake up, chores, school, dinner, afternoon, tea and play, bedtime.',
      'Write your name on the cover and read your booklet aloud to someone.',
    ],
    printables: [
      { sheet: 'booklet.html', pdf: 'booklet.pdf', preview: 'booklet.jpg', title: 'A Victorian child\'s day: fold-up booklet', desc: 'A blank booklet, a guided booklet with sentence starters, and folding instructions with two example days.', pages: '3 pages, A4 landscape' },
    ],
    facts: DAY_FACTS,
    gallery: ['hoop.jpg', 'zoetrope.jpg', 'kitchen-range.jpg', 'classroom.jpg'],
    ideas: [
      'Make two booklets: a poorer child and a richer child, and compare them.',
      'Draw a clock face on every page showing the time.',
      'Write the booklet as "a day in my life in 1880".',
      'Eat a Victorian breakfast (porridge) and a Victorian tea (bread and jam) on the day you make it.',
      'Play a Victorian game: a hoop and stick, a spinning top, or marbles.',
      'Light a (grown-up supervised) candle at bedtime for one night, and no screens.',
    ],
    notes: ['Keep the harder side of Victorian childhood gentle: say that some children had to work and that the school laws changed it, without describing injuries. The example days are typical rather than exact: the school hours (9 to 5) and the afternoon lessons are sourced; wake-up and bedtimes varied by family, town and country and are our best estimate.'],
    sources: [S.durham, { name: 'V&A: wallpapers for children (nurseries and governesses)', url: 'https://www.vam.ac.uk/articles/wallpapers-for-children' }, { name: 'V&A: rocking horse', url: 'https://collections.vam.ac.uk/item/O181064/rocking-horse-unknown/' }, { name: 'North East Museums: Victorian toys box', url: 'https://www.northeastmuseums.org.uk/learn/boxes-of-delight/victorian-toys' }, { name: 'Holst Victorian House: the kitchen range', url: 'https://holstvictorianhouse.org.uk/the-kitchen-range/' }, S.ascl],
  },

  'landmark': {
    time: 'a day out',
    intro: 'Anything built between 1837 and 1901 is Victorian, and Cheshire is full of it: a railway station and a school in Wrenbury, a giant boat lift at Anderton, a clock in Chester, a salt works, a pretend castle. Visit one, and take notes, sketches or photos.',
    steps: [
      'Pick a place from the list (sheet 3), check its website for opening times, and go.',
      'At the place, look for a date stone, old bricks, iron railings, a clock, a bell or the name of the builder.',
      'Sketch it on the notes sheet, or take photos for the photo page.',
      'Write three things you discovered and the year it was built.',
      'Work out how old Victoria was when it was built: she was born in 1819.',
    ],
    printables: [
      { sheet: 'landmark.html', pdf: 'landmark.pdf', preview: 'landmark.jpg', title: 'Landmark visit notes and the places list', desc: 'A notes-and-sketch sheet, a four-photo page, and a list of Victorian places near Wrenbury sorted by drive time.', pages: '3 pages, A4' },
    ],
    facts: [
      { kid: 'The easiest Victorian landmark is a short walk away: Wrenbury\'s railway station opened in September 1858.', src: 'https://en.wikipedia.org/wiki/Wrenbury_railway_station', srcName: 'Wikipedia' },
      { kid: 'The Anderton Boat Lift near Northwich opened in 1875. It lifts whole boats 50 feet between the river and the canal: about three and a half double-decker buses high.', src: 'https://en.wikipedia.org/wiki/Anderton_Boat_Lift', srcName: 'Wikipedia' },
      { kid: 'Chester\'s Eastgate Clock was opened in 1899 to celebrate Victoria\'s Diamond Jubilee. Its clockwork was made in Whitchurch, just down the road from Wrenbury.', src: 'https://en.wikipedia.org/wiki/Eastgate,_Chester', srcName: 'Wikipedia' },
      { kid: 'Crewe was just a few farms until the railway works moved there in 1843. Then it grew into a whole town.', src: 'https://www.crewehc.co.uk/news/crewe-works-180-announcment', srcName: 'Crewe Heritage Centre' },
      { kid: 'Queen\'s Park in Crewe was a present to the town from the railway company for the Golden Jubilee, with a clock tower from 1888.', src: 'https://www.cheshireeast.gov.uk/leisure,_culture_and_tourism/parks_and_gardens/crewe_area_parks_and_gardens/queens_park_crewe/history-of-queens-park.aspx', srcName: 'Cheshire East Council' },
      { kid: 'Peckforton Castle looks medieval but was built from 1844 to 1850 for a Victorian lord who wanted a castle of his own.', src: 'https://en.wikipedia.org/wiki/Peckforton_Castle', srcName: 'Wikipedia' },
      { kid: 'The Lion Salt Works at Marston was built in 1894 and made salt until 1986. Now you can walk round it.', src: 'https://en.wikipedia.org/wiki/Lion_Salt_Works', srcName: 'Wikipedia' },
      { kid: 'At Blists Hill near Ironbridge you can walk round a whole Victorian town, with shops, a school and people in costume.', src: 'https://www.artfund.org/explore/museums-and-galleries/blists-hill-victorian-town', srcName: 'Art Fund' },
    ],
    gallery: ['anderton.jpg', 'eastgate-clock.jpg', 'peckforton.jpg', 'crewe-clock.jpg', 'crewe-heritage.jpg', 'wrenbury-station.jpg'],
    ideas: [
      'Take a rubbing of a date carved in stone or iron.',
      'Photograph a detail (a hinge, a tile, a letter) and a wide view.',
      'Find the oldest and newest thing you can see from the same spot.',
      'Ask a guide one question and write down the answer.',
      'Time how long a train takes to pass through Wrenbury station, then imagine a steam engine.',
      'Draw the building from a bench, then compare with a photo at home.',
    ],
    notes: ['Opening days and prices change, so check each website before setting off. Drive times on the sheet are rough. The Anderton lift itself is closed for repairs until the 2027 season, but the visitor centre and play area open in spring and summer. The bonus points are for the visit record: photos, sketches or notes in the green book.'],
    sources: [{ name: 'Canal & River Trust: Anderton Boat Lift visitor centre', url: 'https://canalrivertrust.org.uk/places-to-visit/anderton-boat-lift-visitor-centre/boat-trips' }, { name: 'Cheshire East: history of Queen\'s Park, Crewe', url: 'https://www.cheshireeast.gov.uk/leisure,_culture_and_tourism/parks_and_gardens/crewe_area_parks_and_gardens/queens_park_crewe/history-of-queens-park.aspx' }, { name: 'Crewe Heritage Centre', url: 'https://www.crewehc.co.uk/about-us' }, { name: 'Art Fund: Blists Hill Victorian Town', url: 'https://www.artfund.org/explore/museums-and-galleries/blists-hill-victorian-town' }, { name: 'Llangollen Railway timetable', url: 'https://llangollen-railway.co.uk/timetable/' }],
  },
};
