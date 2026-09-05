export const QUESTIONS = [
  { category:'NFL', question:'How many points is a touchdown worth before the extra point?', options:['3','6','7','8'], answer:1 },
  { category:'NFL', question:'How many yards are in a standard NFL field from goal line to goal line?', options:['80','90','100','120'], answer:2 },
  { category:'NFL', question:'How many players from one team are on the field at a time?', options:['9','10','11','12'], answer:2 },
  { category:'NFL', question:'What is the trophy awarded to the Super Bowl champion called?', options:['Heisman Trophy','Lombardi Trophy','Halás Trophy','Rozelle Trophy'], answer:1 },
  { category:'NFL', question:'A safety is worth how many points?', options:['1','2','3','6'], answer:1 },
  { category:'NFL', question:'Which position usually snaps the football to begin an offensive play?', options:['Center','Guard','Tight end','Fullback'], answer:0 },
  { category:'NFL', question:'How many downs does an offense normally get to gain 10 yards?', options:['3','4','5','6'], answer:1 },
  { category:'NFL', question:'The NFL regular-season overtime coin toss determines what first?', options:['Which coach challenges first','Initial possession choice','Field goal distance','Number of timeouts'], answer:1 },
  { category:'Sports', question:'How many players are on the court for one basketball team at a time?', options:['4','5','6','7'], answer:1 },
  { category:'Sports', question:'How many strikes make an out in baseball?', options:['2','3','4','5'], answer:1 },
  { category:'Sports', question:'In golf, one stroke under par on a hole is called what?', options:['Birdie','Eagle','Bogey','Albatross'], answer:0 },
  { category:'Sports', question:'How many points is a free throw worth in basketball?', options:['1','2','3','4'], answer:0 },
  { category:'Sports', question:'What color jersey is worn by the Tour de France overall leader?', options:['Green','Yellow','Red','White'], answer:1 },
  { category:'Movies', question:'Which movie franchise features the character Darth Vader?', options:['Star Trek','Star Wars','The Matrix','Dune'], answer:1 },
  { category:'Movies', question:'In The Lion King, what is Simba’s father’s name?', options:['Scar','Mufasa','Rafiki','Zazu'], answer:1 },
  { category:'Movies', question:'Which film features the line concept of choosing a red pill or a blue pill?', options:['Inception','The Matrix','Blade Runner','Minority Report'], answer:1 },
  { category:'Music', question:'How many strings does a standard guitar usually have?', options:['4','5','6','8'], answer:2 },
  { category:'Music', question:'Which instrument typically has 88 keys?', options:['Piano','Violin','Trumpet','Saxophone'], answer:0 },
  { category:'General', question:'What is the largest planet in our solar system?', options:['Earth','Saturn','Jupiter','Neptune'], answer:2 },
  { category:'General', question:'What is the chemical symbol for gold?', options:['Ag','Au','Gd','Go'], answer:1 },
  { category:'General', question:'Which ocean is the largest?', options:['Atlantic','Indian','Arctic','Pacific'], answer:3 },
  { category:'General', question:'How many sides does a hexagon have?', options:['5','6','7','8'], answer:1 },
  { category:'General', question:'Which planet is known as the Red Planet?', options:['Mars','Venus','Mercury','Jupiter'], answer:0 },
  { category:'General', question:'What is the capital of Japan?', options:['Kyoto','Osaka','Tokyo','Nagoya'], answer:2 },
  { category:'General', question:'How many minutes are in two hours?', options:['100','110','120','140'], answer:2 },
  { category:'General', question:'What is H2O commonly called?', options:['Salt','Water','Oxygen','Hydrogen'], answer:1 },
  { category:'General', question:'Which continent is Egypt primarily located on?', options:['Asia','Africa','Europe','South America'], answer:1 },
  { category:'General', question:'How many days are in a leap year?', options:['364','365','366','367'], answer:2 },
  { category:'General', question:'What is the square root of 144?', options:['10','11','12','14'], answer:2 },
  { category:'General', question:'Which animal is the largest living land animal?', options:['Giraffe','Hippopotamus','African elephant','Rhinoceros'], answer:2 }
];

export function publicQuestion(index) {
  const q = QUESTIONS[index];
  if (!q) return null;
  return { index, category: q.category, question: q.question, options: q.options };
}
