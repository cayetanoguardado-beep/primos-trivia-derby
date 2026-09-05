const Q=(category,difficulty,question,options,answer)=>({category,difficulty,question,options,answer});

export const QUESTIONS = [
  Q('NFL','easy','How many points is a safety worth?',['1','2','3','6'],1),
  Q('NFL','easy','How many downs does an offense normally get to gain 10 yards?',['3','4','5','6'],1),
  Q('NFL','easy','How many players from one team are on the field at a time?',['10','11','12','13'],1),
  Q('NFL','easy','What trophy is awarded to the Super Bowl champion?',['Heisman Trophy','Lombardi Trophy','Halás Trophy','Rozelle Trophy'],1),
  Q('NFL','easy','Which position normally snaps the ball to begin an offensive play?',['Center','Guard','Tight end','Fullback'],0),
  Q('NFL','normal','Which team won Super Bowl XLVIII?',['Seattle Seahawks','Denver Broncos','New England Patriots','Baltimore Ravens'],0),
  Q('NFL','normal','How many yards is the penalty for offensive holding in the NFL?',['5','10','15','20'],1),
  Q('NFL','normal','Which quarterback was the first to throw for 5,000 yards in a single NFL season?',['Dan Marino','Drew Brees','Peyton Manning','Tom Brady'],0),
  Q('NFL','normal','Which franchise drafted Brett Favre in 1991?',['Green Bay Packers','Atlanta Falcons','New York Jets','Minnesota Vikings'],1),
  Q('NFL','normal','How many feet must an NFL receiver get in bounds for a completed catch?',['One','Two','Three','Both feet plus a knee'],1),
  Q('NFL','normal','Who holds the NFL single-season rushing record with 2,105 yards?',['Barry Sanders','Adrian Peterson','Eric Dickerson','O.J. Simpson'],2),
  Q('NFL','normal','Which defensive package name refers to five defensive backs?',['Nickel','Dime','Goal line','46'],0),
  Q('NFL','normal','Which team completed the only perfect season in the Super Bowl era?',['1972 Dolphins','1985 Bears','2007 Patriots','1991 Redskins'],0),
  Q('NFL','normal','A defender returns a failed two-point conversion attempt to the opposite end zone. How many points is that worth?',['1','2','3','6'],1),
  Q('NFL','normal','Which NFL position most commonly calls pass protections before the snap?',['Center','Wide receiver','Free safety','Punter'],0),
  Q('NFL','hard','Who was the first player selected in the 1998 NFL Draft?',['Peyton Manning','Ryan Leaf','Charles Woodson','Randy Moss'],0),
  Q('NFL','hard','Which team did the Raiders defeat in Super Bowl XVIII?',['Washington','Philadelphia','Minnesota','Miami'],0),
  Q('NFL','hard','Which quarterback threw the famous “Helmet Catch” pass in Super Bowl XLII?',['Eli Manning','Tom Brady','Ben Roethlisberger','Kurt Warner'],0),
  Q('NFL','hard','What is the maximum number of players allowed on an NFL active game-day roster under current standard rules?',['46','48','50','53'],1),
  Q('NFL','hard','Which coach led the 1985 Chicago Bears to a Super Bowl title?',['Mike Ditka','Buddy Ryan','George Halas','Mike Holmgren'],0),

  Q('NBA','easy','How many players from one team are on the court at one time?',['4','5','6','7'],1),
  Q('NBA','normal','Who was the first unanimous NBA MVP?',['LeBron James','Stephen Curry','Shaquille O’Neal','Michael Jordan'],1),
  Q('NBA','normal','How long is an NBA regulation game before overtime?',['40 minutes','44 minutes','48 minutes','60 minutes'],2),
  Q('NBA','normal','How many points did Kobe Bryant score in his 81-point game?',['72','78','81','84'],2),
  Q('NBA','hard','In what season did the NBA first use the three-point line league-wide?',['1976–77','1979–80','1982–83','1985–86'],1),

  Q('MLB','easy','How many strikes make an out?',['2','3','4','5'],1),
  Q('MLB','normal','How far is the pitcher’s rubber from home plate in Major League Baseball?',['55 ft 6 in','60 ft 6 in','62 ft','66 ft 6 in'],1),
  Q('MLB','normal','What does a pitcher record by striking out three batters on nine pitches in one inning?',['Perfect frame','Immaculate inning','Clean inning','Golden inning'],1),
  Q('MLB','normal','How far apart are the bases in Major League Baseball?',['80 feet','85 feet','90 feet','95 feet'],2),
  Q('MLB','hard','Which player broke Major League Baseball’s color barrier in 1947?',['Satchel Paige','Jackie Robinson','Larry Doby','Willie Mays'],1),

  Q('NHL','easy','What trophy is awarded to the NHL champion?',['Stanley Cup','Calder Cup','Presidents’ Cup','Hart Cup'],0),
  Q('NHL','normal','How many players, including the goalie, does one NHL team normally have on the ice at even strength?',['5','6','7','8'],1),
  Q('NHL','normal','A hockey hat trick means one player scores how many goals in a game?',['2','3','4','5'],1),
  Q('NHL','hard','How long is one regulation NHL period?',['15 minutes','18 minutes','20 minutes','25 minutes'],2),

  Q('College Football','easy','What trophy is awarded annually to college football’s most outstanding player?',['Heisman Trophy','Lombardi Trophy','Maxwell Cup','Rose Trophy'],0),
  Q('College Football','normal','Which bowl game is nicknamed “The Granddaddy of Them All”?',['Sugar Bowl','Orange Bowl','Rose Bowl','Cotton Bowl'],2),
  Q('College Football','normal','How many yards must an offense gain for a first down?',['5','8','10','12'],2),
  Q('College Football','hard','Which school’s stadium is commonly known as “The Big House”?',['Ohio State','Michigan','Penn State','Notre Dame'],1),

  Q('Soccer','easy','How many players does one soccer team normally have on the field including the goalkeeper?',['9','10','11','12'],2),
  Q('Soccer','normal','Which country has won the most men’s FIFA World Cups?',['Germany','Argentina','Italy','Brazil'],3),
  Q('Soccer','normal','How long is a regulation professional soccer match before stoppage time?',['80 minutes','90 minutes','100 minutes','120 minutes'],1),
  Q('Soccer','hard','Which card sends a soccer player off the field?',['Blue','Yellow','Red','Black'],2),

  Q('UFC / Boxing','easy','How many sides does the UFC Octagon have?',['6','7','8','10'],2),
  Q('UFC / Boxing','normal','How long is a standard UFC round?',['3 minutes','4 minutes','5 minutes','6 minutes'],2),
  Q('UFC / Boxing','normal','Muhammad Ali was born with what name?',['Cassius Clay','Joe Frazier','Sonny Liston','Archie Moore'],0),
  Q('UFC / Boxing','hard','In professional boxing, a fighter who cannot beat what count is normally knocked out?',['8','9','10','12'],2),

  Q('Olympics','easy','How many rings are on the Olympic symbol?',['4','5','6','7'],1),
  Q('Olympics','normal','Which city hosted the 2016 Summer Olympics?',['Tokyo','Rio de Janeiro','London','Beijing'],1),
  Q('Olympics','hard','The first modern Olympic Games were held in 1896 in which city?',['Paris','Athens','Rome','London'],1),

  Q('Movies','easy','Which movie franchise features Darth Vader?',['Star Trek','Star Wars','Dune','The Matrix'],1),
  Q('Movies','normal','Which actor played Maximus in Gladiator?',['Russell Crowe','Mel Gibson','Joaquin Phoenix','Christian Bale'],0),
  Q('Movies','normal','Which film won Best Picture at the 2020 Academy Awards ceremony?',['1917','Joker','Parasite','Once Upon a Time in Hollywood'],2),
  Q('Movies','normal','In Back to the Future, what speed must the DeLorean reach to time travel?',['77 mph','82 mph','88 mph','92 mph'],2),
  Q('Movies','hard','In The Godfather, what legitimate business is associated with the Corleone family?',['Olive oil','Construction','Shipping','Hotels'],0),

  Q('Music','easy','Which artist is nicknamed the “King of Pop”?',['Prince','Michael Jackson','Elvis Presley','Stevie Wonder'],1),
  Q('Music','normal','Which band released the album Rumours?',['Fleetwood Mac','Eagles','Journey','Queen'],0),
  Q('Music','normal','Who released the album good kid, m.A.A.d city?',['Drake','J. Cole','Kendrick Lamar','Kanye West'],2),
  Q('Music','normal','Which band recorded “Hotel California”?',['Eagles','Aerosmith','Boston','Foreigner'],0),
  Q('Music','hard','Which instrument typically has 88 keys?',['Piano','Organ','Harpsichord','Accordion'],0),

  Q('Geography','easy','What is the capital of Japan?',['Kyoto','Osaka','Tokyo','Nagoya'],2),
  Q('Geography','normal','What is the capital of Australia?',['Sydney','Melbourne','Canberra','Perth'],2),
  Q('Geography','normal','Which country has the largest population in South America?',['Argentina','Colombia','Brazil','Peru'],2),
  Q('Geography','normal','Which ocean contains the Mariana Trench?',['Atlantic','Pacific','Indian','Southern'],1),
  Q('Geography','hard','Which continent contains the most sovereign countries?',['Asia','Europe','Africa','South America'],2),

  Q('Food','easy','What ingredient is traditionally the base of guacamole?',['Tomato','Avocado','Cucumber','Lime'],1),
  Q('Food','normal','Saffron comes from what part of a flower?',['Root','Petal','Stigma','Stem'],2),
  Q('Food','normal','What cheese is traditionally used in a classic Greek salad?',['Brie','Feta','Gouda','Cheddar'],1),
  Q('Food','hard','Which nut is used to make traditional marzipan?',['Walnut','Almond','Pistachio','Cashew'],1),

  Q('History','easy','Which document begins with the words “We the People”?',['Declaration of Independence','U.S. Constitution','Bill of Rights','Federalist Papers'],1),
  Q('History','normal','Which U.S. state was the 50th admitted to the Union?',['Alaska','Hawaii','Arizona','New Mexico'],1),
  Q('History','normal','In what year did World War II end?',['1943','1944','1945','1946'],2),
  Q('History','hard','The Magna Carta was first issued in which century?',['11th','12th','13th','14th'],2),

  Q('Cars','easy','Ferrari originated in which country?',['Germany','Italy','France','United Kingdom'],1),
  Q('Cars','normal','How many characters are in a modern standard VIN?',['15','16','17','18'],2),
  Q('Cars','normal','What does ABS stand for in an automobile?',['Automatic Brake System','Anti-lock Braking System','Advanced Balance Steering','Active Brake Support'],1),
  Q('Cars','hard','In a four-stroke engine, which stroke comes immediately after compression?',['Intake','Power','Exhaust','Ignition'],1),

  Q('Military','easy','What is the Marine Corps motto?',['Semper Paratus','Semper Fidelis','This We’ll Defend','Aim High'],1),
  Q('Military','easy','The Marine Corps celebrates its birthday on what date?',['July 4','October 13','November 10','December 7'],2),
  Q('Military','normal','In the NATO phonetic alphabet, what word represents the letter M?',['Mike','Mango','Major','Metro'],0),
  Q('Military','normal','What U.S. military pay grade is a Marine Corps Sergeant?',['E-4','E-5','E-6','E-7'],1),
  Q('Military','hard','Tun Tavern, traditionally associated with the founding of the Marine Corps, was located in which city?',['Boston','Philadelphia','New York','Baltimore'],1),

  Q('General','easy','What is the largest planet in our solar system?',['Earth','Saturn','Jupiter','Neptune'],2),
  Q('General','normal','Which element has atomic number 26?',['Iron','Copper','Zinc','Nickel'],0),
  Q('General','normal','Which scientist formulated the three laws of motion?',['Albert Einstein','Isaac Newton','Galileo Galilei','Niels Bohr'],1),
  Q('General','normal','Which planet has the shortest year in our solar system?',['Mercury','Venus','Mars','Jupiter'],0),
  Q('General','hard','Which blood type is known as the universal red-cell donor?',['A positive','AB negative','O negative','O positive'],2),

  Q('Who Knows This Shit?','easy','How many hearts does an octopus have?',['1','2','3','4'],2),
  Q('Who Knows This Shit?','normal','Which animal has fingerprints so similar to humans that they can confuse investigators?',['Koala','Panda','Otter','Sloth'],0),
  Q('Who Knows This Shit?','normal','A group of flamingos is commonly called what?',['A parade','A flamboyance','A cloud','A chorus'],1),
  Q('Who Knows This Shit?','hard','Which common fruit is botanically classified as a berry?',['Strawberry','Raspberry','Banana','Cherry'],2)
];

export function questionPool(difficulty='normal') {
  const mode=['easy','normal','hard'].includes(difficulty)?difficulty:'normal';
  if(mode==='easy') return QUESTIONS.filter(q=>q.difficulty==='easy'||q.difficulty==='normal');
  if(mode==='hard') return QUESTIONS.filter(q=>q.difficulty==='normal'||q.difficulty==='hard');
  return QUESTIONS;
}

export function isDoubleQuestion(index) {
  return Number.isInteger(index) && index >= 9 && (index + 1) % 10 === 0;
}

export function questionForIndex(index,difficulty='normal') {
  if (!Number.isInteger(index) || index < 0) return null;
  const pool=questionPool(difficulty);
  if (!pool.length) return null;
  return pool[index % pool.length];
}

export function publicQuestion(index,difficulty='normal') {
  const q = questionForIndex(index,difficulty);
  if (!q) return null;
  return { index, category:q.category, difficulty:q.difficulty, question:q.question, options:q.options, doubleYards:isDoubleQuestion(index) };
}
