export const QUESTIONS = [
  { category:'NFL', question:'Which team won Super Bowl XLVIII?', options:['Seattle Seahawks','Denver Broncos','New England Patriots','Baltimore Ravens'], answer:0 },
  { category:'NFL', question:'How many yards is the penalty for offensive holding in the NFL?', options:['5','10','15','20'], answer:1 },
  { category:'NFL', question:'Which quarterback was the first to throw for 5,000 yards in a single NFL season?', options:['Dan Marino','Drew Brees','Peyton Manning','Tom Brady'], answer:0 },
  { category:'NFL', question:'Which franchise drafted Brett Favre in 1991?', options:['Green Bay Packers','Atlanta Falcons','New York Jets','Minnesota Vikings'], answer:1 },
  { category:'NFL', question:'How many feet must an NFL receiver get in bounds for a completed catch?', options:['One','Two','Three','Both feet plus a knee'], answer:1 },
  { category:'NFL', question:'Who holds the NFL single-season rushing record with 2,105 yards?', options:['Barry Sanders','Adrian Peterson','Eric Dickerson','O.J. Simpson'], answer:2 },
  { category:'NFL', question:'Which defensive formation name refers to five defensive backs?', options:['Nickel','Dime','Goal line','46'], answer:0 },
  { category:'NFL', question:'Which team completed the only perfect season in the Super Bowl era?', options:['1972 Dolphins','1985 Bears','2007 Patriots','1991 Redskins'], answer:0 },
  { category:'NFL', question:'A defensive player intercepts a two-point conversion attempt and returns it to the opposite end zone. How many points is that worth?', options:['1','2','3','6'], answer:1 },
  { category:'NFL', question:'Which NFL position is most commonly responsible for calling pass protections before the snap?', options:['Center','Wide receiver','Free safety','Punter'], answer:0 },

  { category:'NBA', question:'Who was the first unanimous NBA MVP?', options:['LeBron James','Stephen Curry','Shaquille O’Neal','Michael Jordan'], answer:1 },
  { category:'NBA', question:'How long is an NBA regulation game before overtime?', options:['40 minutes','44 minutes','48 minutes','60 minutes'], answer:2 },
  { category:'MLB', question:'How far is the pitcher’s mound from home plate in Major League Baseball?', options:['55 ft 6 in','60 ft 6 in','62 ft','66 ft 6 in'], answer:1 },
  { category:'MLB', question:'What does a pitcher record when they retire three batters on nine total pitches in one inning?', options:['Perfect frame','Immaculate inning','Clean inning','Golden inning'], answer:1 },
  { category:'NHL', question:'How many players, including the goalie, does one NHL team normally have on the ice at even strength?', options:['5','6','7','8'], answer:1 },
  { category:'Soccer', question:'Which country has won the most men’s FIFA World Cups?', options:['Germany','Argentina','Italy','Brazil'], answer:3 },
  { category:'Golf', question:'What is three strokes under par on a single hole called?', options:['Eagle','Albatross','Birdie','Condor'], answer:1 },
  { category:'Olympics', question:'Which city hosted the 2016 Summer Olympics?', options:['Tokyo','Rio de Janeiro','London','Beijing'], answer:1 },

  { category:'Movies', question:'In The Godfather, what is the Corleone family business commonly described as?', options:['Import-export','Olive oil','Construction','Shipping'], answer:1 },
  { category:'Movies', question:'Which actor played Maximus in Gladiator?', options:['Russell Crowe','Mel Gibson','Joaquin Phoenix','Christian Bale'], answer:0 },
  { category:'Movies', question:'Which film won Best Picture at the 2020 Academy Awards ceremony?', options:['1917','Joker','Parasite','Once Upon a Time in Hollywood'], answer:2 },
  { category:'Movies', question:'In Back to the Future, what speed must the DeLorean reach to time travel?', options:['77 mph','82 mph','88 mph','92 mph'], answer:2 },

  { category:'Music', question:'Which band released the album Rumours?', options:['Fleetwood Mac','Eagles','Journey','Queen'], answer:0 },
  { category:'Music', question:'Who released the album good kid, m.A.A.d city?', options:['Drake','J. Cole','Kendrick Lamar','Kanye West'], answer:2 },
  { category:'Music', question:'Which artist is nicknamed the “King of Pop”?', options:['Prince','Michael Jackson','Elvis Presley','Stevie Wonder'], answer:1 },
  { category:'Music', question:'Which rock band recorded “Hotel California”?', options:['Eagles','Aerosmith','Boston','Foreigner'], answer:0 },

  { category:'General', question:'Which element has atomic number 26?', options:['Iron','Copper','Zinc','Nickel'], answer:0 },
  { category:'General', question:'Which country has the largest population in South America?', options:['Argentina','Colombia','Brazil','Peru'], answer:2 },
  { category:'General', question:'What is the capital of Australia?', options:['Sydney','Melbourne','Canberra','Perth'], answer:2 },
  { category:'General', question:'Which U.S. state was the 50th admitted to the Union?', options:['Alaska','Hawaii','Arizona','New Mexico'], answer:1 },
  { category:'General', question:'What is the largest desert on Earth by total area?', options:['Sahara','Arabian','Gobi','Antarctic Desert'], answer:3 },
  { category:'General', question:'Which scientist formulated the three laws of motion?', options:['Albert Einstein','Isaac Newton','Galileo Galilei','Niels Bohr'], answer:1 },
  { category:'General', question:'What is the longest river in South America?', options:['Amazon','Paraná','Orinoco','Madeira'], answer:0 },
  { category:'General', question:'Which language has the most native speakers worldwide?', options:['English','Spanish','Mandarin Chinese','Hindi'], answer:2 },
  { category:'General', question:'Which planet has the shortest year in our solar system?', options:['Mercury','Venus','Mars','Jupiter'], answer:0 },
  { category:'General', question:'How many amendments are in the U.S. Bill of Rights?', options:['8','10','12','15'], answer:1 },
  { category:'General', question:'Which blood type is known as the universal red-cell donor?', options:['A positive','AB negative','O negative','O positive'], answer:2 },
  { category:'General', question:'Which ocean contains the Mariana Trench?', options:['Atlantic','Pacific','Indian','Southern'], answer:1 },
  { category:'General', question:'What is the Roman numeral for 50?', options:['L','C','D','V'], answer:0 },
  { category:'General', question:'Which continent contains the most countries?', options:['Asia','Europe','Africa','South America'], answer:2 }
];

export function questionForIndex(index) {
  if (!Number.isInteger(index) || index < 0 || QUESTIONS.length === 0) return null;
  return QUESTIONS[index % QUESTIONS.length];
}

export function publicQuestion(index) {
  const q = questionForIndex(index);
  if (!q) return null;
  return { index, category: q.category, question: q.question, options: q.options };
}
