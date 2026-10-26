// Bathing machine facts for sheets/bathing-machine.html and tasks/bathing-machine.html. Sources: research/03-bathing-machines.md
const EMS = 'https://emsworthmuseum.org.uk/emcms/files/original/021849c92f68b6c062c471f2e3cf6335.pdf';
const EHB = 'https://www.english-heritage.org.uk/visit/inspire-me/blog/blog-posts/five-ways-beach-fun-like-queen-victoria/';
export const BM_FACTS = [
  { kid: 'A bathing machine was a beach hut on wheels. Queen Victoria\'s was about 12 feet long, the length of a small car.', src: EMS, srcName: 'Emsworth Museum' },
  { kid: 'A horse pulled it into the sea. Then the driver unhitched the horse and went back up the beach to fetch the next machine.', src: EMS, srcName: 'Emsworth Museum' },
  { kid: 'Men and women bathed on different parts of the beach. In Margate a rule said they had to stay at least 60 feet apart: about four cars end to end.', src: 'https://margatecivicsociety.org.uk/Margate_History.html', srcName: 'Margate Civic Society' },
  { kid: 'Benjamin Beale, a glove maker from Margate, added a canvas hood that pulled down over the sea door so nobody could see the bather at all.', src: 'https://margatecivicsociety.org.uk/Margate_History.html', srcName: 'Margate Civic Society' },
  { kid: 'A strong helper called a dipper waited in the water to help you in, and sometimes to dunk you under the waves.', src: 'https://www.historyhit.com/what-was-a-victorian-bathing-machine/', srcName: 'History Hit' },
  { kid: 'A little flag on the roof could be raised to tell the driver you were ready to come back up the beach.', src: EMS, srcName: 'Emsworth Museum' },
  { kid: 'Queen Victoria\'s own machine at Osborne House had a changing room, a plumbed-in toilet and a curtained veranda.', src: EHB, srcName: 'English Heritage' },
  { kid: 'It ran on grooved stone rails down a slipway into the sea. A winch and a wire rope let it down and pulled it back up.', src: 'https://historicengland.org.uk/images-books/photos/item/IC076/002', srcName: 'Historic England Archive' },
  { kid: 'In July 1847 Victoria went into the sea for the first time. She wrote in her diary that it was delightful until she put her head under the water.', src: 'https://www.victorianweb.org/victorian/history/victoria/7.html', srcName: 'The Victorian Web' },
  { kid: 'After the Queen died her machine was used as a hen house. It was mended and now stands on the beach at Osborne, where you can see it.', src: 'https://en.wikipedia.org/wiki/Bathing_machine', srcName: 'Wikipedia' },
  { kid: 'At Clacton in 1873 a bathing machine cost sixpence for half an hour: six old pennies for about one TV programme\'s worth of swimming.', src: 'https://gazette-news.co.uk/news/18597409.nostalgia-back-days-bathing-machines-clacton/', srcName: 'Clacton Gazette' },
  { kid: 'By 1914 most bathing machines had gone. Many were left on the sand and turned into beach huts.', src: 'https://www.historyhit.com/what-was-a-victorian-bathing-machine/', srcName: 'History Hit' },
];
// the six on the printed sheet
export const BM_SHEET = BM_FACTS.filter((f, i) => [0, 1, 3, 5, 6, 10].includes(i));
