// Queen Victoria facts, dates, looks and pictures. Sources: research/01-queen-victoria.md (every fact carries its src).
const ROYAL = 'https://www.royal.uk/queen-victoria';
const ABBEY = 'https://www.westminster-abbey.org/abbey-commemorations/royals/queen-victoria';
const WP = 'https://en.wikipedia.org/wiki/Queen_Victoria';

export const DATES = [
  { when: '24 May 1819', what: 'Born at Kensington Palace, London.', src: ABBEY },
  { when: '20 June 1837', what: 'Becomes queen at 18, when her uncle King William IV dies.', src: ROYAL },
  { when: '28 June 1838', what: 'Crowned at Westminster Abbey, aged 19.', src: ABBEY },
  { when: '10 Feb 1840', what: 'Marries Prince Albert at St James\'s Palace. Her white dress helps make white weddings popular.', src: ABBEY },
  { when: '6 May 1840', what: 'The Penny Black, the first postage stamp, goes on sale with her face on it.', src: 'https://en.wikipedia.org/wiki/Penny_Black' },
  { when: '1840 to 1857', what: 'Nine children are born.', src: ROYAL },
  { when: '14 Dec 1861', what: 'Prince Albert dies. Victoria wears black for the rest of her life.', src: ROYAL },
  { when: '1 Jan 1877', what: 'Proclaimed Empress of India.', src: WP },
  { when: '20 June 1887', what: 'Golden Jubilee: 50 years as queen.', src: 'https://www.royal.uk/history-jubilees' },
  { when: '22 June 1897', what: 'Diamond Jubilee: 60 years as queen.', src: 'https://www.royal.uk/history-jubilees' },
  { when: '22 Jan 1901', what: 'Dies at Osborne House, aged 81, after 63 years on the throne.', src: ABBEY },
];

export const FACTS = [
  { kid: 'Victoria became queen when she was only 18, which is three times as old as a Year 2 child.', src: ROYAL, srcName: 'royal.uk' },
  { kid: 'She was queen for 63 years. That is longer than many grandparents have been alive.', src: ROYAL, srcName: 'royal.uk' },
  { kid: 'She was small: about 4 feet 11 inches tall, which is 150 centimetres, about the height of a Year 6 child.', src: 'https://www.countryfile.com/people/royals/how-tall-was-queen-victoria', srcName: 'Countryfile' },
  { kid: 'She had nine children and 42 grandchildren. Imagine 42 cousins at one party!', src: 'https://www.historyhit.com/who-were-queen-victorias-9-children/', srcName: 'History Hit' },
  { kid: 'As a child she learned French, German, Italian and Latin: four languages, one for each season of the year.', src: WP, srcName: 'Wikipedia' },
  { kid: 'Her dog Dash, a King Charles spaniel, came to live with her when she was 13. On the day she was crowned, she ran upstairs afterwards to give Dash his bath.', src: 'https://en.wikipedia.org/wiki/Dash_(spaniel)', srcName: 'Wikipedia' },
  { kid: 'Late in her life she learned Hindustani, an Indian language, from her teacher Abdul Karim, who had started out serving at her table.', src: 'https://www.english-heritage.org.uk/about/search-news/queen-victorias-hindustani-diary-on-display-for-the-first-time-at-osborne/', srcName: 'English Heritage' },
  { kid: 'In 1842 she became the first British monarch to ride on a train, from Slough to London. The trip took about half an hour.', src: 'https://www.royal.uk/queen-celebrates-175th-anniversary-first-royal-train-journey', srcName: 'royal.uk' },
  { kid: 'She was the first king or queen to live at Buckingham Palace.', src: 'https://www.royal.uk/royal-residences-kensington-palace', srcName: 'royal.uk' },
  { kid: 'Her face was on the Penny Black, the first postage stamp in the world, in 1840. She was 21 in the picture.', src: 'https://en.wikipedia.org/wiki/Penny_Black', srcName: 'Wikipedia' },
  { kid: 'She wore a white satin wedding dress with lace. She was not the first bride in white, but her dress made white weddings popular.', src: 'https://en.wikipedia.org/wiki/Wedding_dress_of_Queen_Victoria', srcName: 'Wikipedia' },
  { kid: 'A picture of her family round a Christmas tree, printed in a newspaper in 1848, made Christmas trees popular all over Britain.', src: 'https://en.wikipedia.org/wiki/Christmas_tree', srcName: 'Wikipedia' },
  { kid: 'She and Albert built Osborne House on the Isle of Wight. It took six years, from 1845 to 1851.', src: 'https://en.wikipedia.org/wiki/Osborne_House', srcName: 'Wikipedia' },
  { kid: 'She had her own bathing machine on the beach at Osborne, a hut on wheels with a veranda and curtains, so she could swim in the sea in private.', src: 'https://en.wikipedia.org/wiki/Osborne_House', srcName: 'Wikipedia' },
  { kid: 'She wrote in her diary from the age of 13 until ten days before she died: 69 years of diaries.', src: 'https://en.wikipedia.org/wiki/Queen_Victoria%27s_journals', srcName: 'Wikipedia' },
  { kid: 'After Prince Albert died in 1861 she wore black clothes for the rest of her life, about 40 years.', src: ROYAL, srcName: 'royal.uk' },
  { kid: 'In 1877 she was also made Empress of India.', src: WP, srcName: 'Wikipedia' },
  { kid: 'The Victoria Cross, a medal for bravery, was her idea in 1856, and the Victoria sponge cake is said to be named after her too.', src: 'https://en.wikipedia.org/wiki/Victoria_Cross', srcName: 'Wikipedia' },
  { kid: 'Lake Victoria and Victoria Falls in Africa, the state of Victoria in Australia and the city of Victoria in Canada are all named after her.', src: 'https://en.wikipedia.org/wiki/Victoria_Falls', srcName: 'Wikipedia' },
  { kid: 'Her children and grandchildren married into royal families all over Europe, so people called her "the Grandmother of Europe".', src: WP, srcName: 'Wikipedia' },
  { kid: 'Her record as longest-reigning monarch lasted until 9 September 2015, when Queen Elizabeth II beat it.', src: ROYAL, srcName: 'royal.uk' },
];

export const STORY = [
  'Queen Victoria was born on 24 May 1819 in a palace in London called Kensington Palace.',
  'When she was 18, her uncle King William IV died, and she became queen.',
  'She was crowned in Westminster Abbey when she was 19.',
  'In 1840 she married her cousin, Prince Albert, and they had nine children.',
  'Victoria wrote a diary nearly every day for 69 years, from when she was a teenager until just before she died.',
  'When Albert died in 1861 she was very sad, and she wore black clothes for the rest of her life.',
  'She was queen for 63 years, until Queen Elizabeth II passed her record in 2015.',
  'She died at Osborne House on the Isle of Wight in 1901, aged 81.',
];

export const LOOKS = [
  { title: 'Young queen, 1837 to 1840s', text: 'Dark hair parted in the middle, braided and looped over her ears, a small sparkling tiara set towards the back of her head, a white silk dress with lace, and a serious expression. In some pictures, a blue sash.' },
  { title: 'Mother, 1846 to 1850s', text: 'Hair smoothed back, a rich dress with a wide skirt, a small crown and pearls, often with Albert and the children around her.' },
  { title: 'Old queen, 1880s to 1901', text: 'A black dress, a white veil, a small diamond crown on top of her head, a round face and a very serious look. She is often shown sitting.' },
];

export const PICTURES = [
  { file: 'victoria-young.jpg', alt: 'Painting of the young Queen Victoria', cap: 'Young Victoria, painted by Winterhalter in 1842' },
  { file: 'victoria-bassano.jpg', alt: 'Photograph of Queen Victoria in old age', cap: 'Photograph by Alexander Bassano, 1882' },
  { file: 'penny-black.jpg', alt: 'The Penny Black stamp', cap: 'The Penny Black, 1840' },
  { file: 'victoria-family.jpg', alt: 'Painting of Victoria, Albert and five children', cap: 'The royal family in 1846, by Winterhalter' },
];
