// The thirteen homework tasks from the Year 2 Victorians sheet (autumn term 2026), in sheet order.
export const TASKS = [
  { id: 'victorian-school', pts: 5, title: 'Draw and label a Victorian school', brief: 'Draw and label a Victorian school. What is similar and different to our school today?', img: 'classroom.jpg' },
  { id: 'poem', pts: 5, title: 'Copy a Victorian poem', brief: 'Practise your handwriting by copying a short Victorian poem or nursery rhyme as neatly as possible.', img: 'owl-pussycat.jpg' },
  { id: 'wrenbury-walk', pts: 5, title: 'A walk around Wrenbury', brief: 'Go on a walk around Wrenbury and spot three human features and three physical features. Draw or photograph them.', img: 'wrenbury-bridge.jpg' },
  { id: 'queen-victoria-picture', pts: 5, title: 'A picture of Queen Victoria', brief: 'Create a picture of Queen Victoria using any art materials you choose.', img: 'victoria-young.jpg' },
  { id: 'modern-school', pts: 10, title: 'Design a modern school', brief: 'Design and label your own modern school building. Think about what features would make it a great place to learn.', img: 'architect.jpg', app: 'https://philhandley.github.io/astra-architect/v2/' },
  { id: 'map', pts: 10, title: 'A map with a key', brief: 'Create a map of your home, garden or a familiar place using a key and simple symbols.', img: 'os-map.jpg' },
  { id: 'materials', pts: 10, title: 'Materials sorting chart', brief: 'Investigate everyday materials around your home. Create a sorting chart showing materials such as wood, metal, plastic and glass.', img: 'crystal-palace.jpg' },
  { id: 'bathing-machine', pts: 10, title: 'Design a bathing machine', brief: 'Design your own Victorian Bathing Machine.', img: 'bathing-machines.jpg' },
  { id: 'fact-file', pts: 15, title: 'Queen Victoria fact file', brief: 'Create a fact file about Queen Victoria. Include information, pictures and at least five interesting facts.', img: 'victoria-bassano.jpg' },
  { id: 'model-school', pts: 15, title: 'Build a model school', brief: 'Build a model of a school, either Victorian or modern, using recycled materials, construction kits or craft resources.', img: 'board-school.jpg' },
  { id: 'interview', pts: 15, title: 'Interview about school days', brief: 'Interview an older family member about their experiences at school. Compare their school life with your own and present your findings.', img: 'copybook.jpg' },
  { id: 'victorian-day', pts: 15, title: "A Victorian child's day booklet", brief: 'Create a "Victorian Child\'s Day" booklet showing what a typical day might have looked like, including school, home life and chores.', img: 'hoop.jpg' },
  { id: 'landmark', pts: 0, bonus: true, title: 'Visit a Victorian landmark', brief: 'Visit a Victorian landmark or building. Take photographs, create sketches or make notes about what you have discovered.', img: 'anderton.jpg' },
];
export const byId = id => TASKS.find(t => t.id === id);
