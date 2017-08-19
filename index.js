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
app.use(express.static(__dirname + 'public'));
app.use(session({
  secret: 'i85bky57iolmhy6thiu87',
  resave: false,
  saveUninitialized: true
}))

let storedWord =[];
let letters ="";
let storedLetters =[];
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

//The random genertor needs to be inside the get if it's placed
//inside the post it picks a new word after each guess of a letter.
app.get('/mystery', function (req, res) {
  let random = Math.floor(Math.random()* words.length);
  let unveiledWord = words[random];

  //Loops though the string and adds each letter from the random guessed word  into an array
  for (i=0; i<unveiledWord.length; i++) {
  storedWord.push(unveiledWord.charAt(i));
  // for (j=0; j <storedWord.length; j++) {
  //   if (letters)
  // }
}
console.log(storedWord);
  console.log(typeof unveiledWord);
  console.log(unveiledWord);
  res.render('hangman', {users: req.session.user});
});

app.post ('/login', function (req, res){
  console.log(req.body.username);
  let user = null;
  for (let i=0; i<users.length; i++) {
  if (req.body.username === users[i].username && req.body.password === users[i].password) {
   user = users[i];
   console.log(user);
  }
} //End of Loop
if (user !== null) {
  req.session.user = user;
  console.log("I should be going to mystery");
  res.redirect('/mystery');
}
if (user === null) {
  console.log("I'm going to the index.");
  res.render('index');
}
});

app.post('/guess', function (req, res, a) {
letters = req.body.guess;
storedLetters.push(letters);
console.log(storedLetters);
res.render('hangman', {users: req.session.user, storedLetters});
});
app.listen(4000, function (){
  console.log("The server is running.");

});
