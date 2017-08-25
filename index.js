const fs = require("fs");
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const app = express();
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'i85bky57iolmhy6thiu87',
  resave: false,
  saveUninitialized: true
}))

const users = [
    {username: "chris", password: "abc", name: "Chris"},
    {username: "ericka", password: "123",  name: "Ericka"},
    {username: "chad", password: "jkl",  name: "Chad"},
    {username: "ken", password: "asd", name: "Ken"},
];

app.get ('/login', function (req, res) {
  console.log("index");
  res.render('index');
});
app.post ('/login', function (req, res){
  console.log(req.body.username);
  req.session.difficulty = 'easy';

  let user = null;
  for (let i=0; i<users.length; i++) {
    if (req.body.username === users[i].username && req.body.password === users[i].password) {
        user = users[i];
        console.log(user);
    }
  } //End of Loop
  if (user !== null) {
    req.session.user = user;
    req.session.easy = req.body.easy,
    req.session.normal = req.body.normal,
    req.session.hard = req.body.hard,
    res.redirect('/mystery');
  } else {
    res.render('index');
  }
});
//The random genertor needs to be inside the get if it's placed
//inside the post it picks a new word after each guess of a letter.
app.get('/mystery', function (req, res) {
  req.session.counter = 0;
  req.session.incorrectGuessCount = 0;
  req.session.letters ="";
  req.session.storedWord =[];
  req.session.storedGuess =[];
  req.session.triesLeft = 6;

  if (req.session.easy) {
    req.session.easy = words.filter((easy) => easy.length >=4 && easy.length <=6);
    let random = Math.floor(Math.random()* req.session.easy.length);
    let selection = req.session.easy[random];
    req.session.unveiledWord = selection;
    console.log("I am the console log of selection " + selection);
    loopStored(selection);
} else if(req.session.normal){
    req.session.normal = words.filter((normal) => normal.length >=7 && normal.length <=11);
    random = Math.floor(Math.random()* req.session.normal.length);
    selection = req.session.normal[random];
    req.session.unveiledWord = selection;
    console.log("I am the console log of" + selection);
    loopStored(selection);
} else if (req.session.hard){
    req.session.hard = words.filter((hard) => hard.length >=12 && hard.length <=18 );
    random = Math.floor(Math.random()* req.session.hard.length);
    selection = req.session.hard[random];
    req.session.unveiledWord = selection;
    console.log("I am the console log of" + selection);
    loopStored(selection);
}
  function loopStored(mode) {
    for (i=0; i<req.session.unveiledWord.length; i++) {
      req.session.storedWord.push({
        letter: req.session.unveiledWord.charAt(i),
        visible: false
      });
    };
    return req.session.storedWord;
  }
  res.render('hangman', {
    users: req.session.user,
    storedWord: req.session.storedWord,
    triesLeft: req.session.triesLeft,
    easy: req.session.easy,
  });

});



app.post('/guess', function (req, res) {
  // check if a user is in session
  // if no information is in session, start a new game.
  req.session.counter = 0;
  req.session.multiple = false;
  req.session.incorrectGuessCount = 0;
  req.session.letters = req.body.guess.toLowerCase();
  req.session.storedGuess.push(req.session.letters);

  for (j=0; j <req.session.storedWord.length; j++) {
    if (req.session.storedWord[j].letter === req.body.guess) {
        req.session.storedWord[j].visible = true;
        req.session.counter +=1;
        console.log(req.session.storedWord);
    } else if (req.session.storedWord[j].letter !== req.body.guess) {
        req.session.incorrectGuessCount ++;
      } if (req.session.triesLeft === 1) {
        req.session.storedWord[j].visible = true;

    }
  }
  if (req.session.triesLeft === 0) {
      res.redirect('/mystery')
  }
  if (req.session.incorrectGuessCount >= 1 && req.session.counter === 0) {
      req.session.triesLeft --;
  }
  req.session.counter = 0;
  req.session.incorrectGuessCount = 0;
  res.render('hangman', {
    users: req.session.user,
    storedGuess: req.session.storedGuess,
    storedWord: req.session.storedWord,
    triesLeft: req.session.triesLeft,
    error: req.session.multiple,
  })
});
app.get('/signup', function(req, res) {
  res.render("signup");
});
app.post('/signup', function(req, res){
    if (req.body.username !== undefined && req.body.name !== undefined && req.body.password === req.body.reenter){
    let newuser = {username: req.body.username,password: req.body.password, name: req.body.name};
users.push(newuser);
    }
res.redirect('/login');
})
app.listen(4000, function () {
  console.log("The server is running.");
});
