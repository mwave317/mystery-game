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
let counter = 0;
let letters ="";
let storedWord =[];
let storedGuess =[];
let triesLeft= 6;
let unveiledWord;
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
app.get('/mystery', function (req, res, sg) {
  let random = Math.floor(Math.random()* words.length);
  unveiledWord = words[random];

  //Loops though the string and adds each letter from the random guessed word  into an array
  for (i=0; i<unveiledWord.length; i++) {
  storedWord.push(unveiledWord.charAt(i));
  }

console.log(storedWord);
  // console.log(typeof unveiledWord);
  // console.log(unveiledWord);
  res.render('hangman', {users: req.session.user, storedWord});
});

app.get('/signup', function( req, res) {

  res.render("signup");
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

app.post('/guess', function (req, res) {
letters = req.body.guess;
storedGuess.push(letters);
console.log(storedGuess);
for (j=0; j <storedWord.length; j++) {
      if (storedWord[j] === req.body.guess){
        console.log("That is correct");
        counter = 0;
} else if (storedWord[j] !== req.body.guess) {
  console.log("That is an incorrect guess");
}
// console.log(counter);
}
console.log(triesLeft);
res.render('hangman', {users: req.session.user, storedGuess});
});

app.post('/signup', function(req, res){
  if (req.body.username !== undefined && req.body.name !== undefined && req.body.password === req.body.reenter){
let newuser = {username: req.body.username,password: req.body.password, name: req.body.name};
users.push(newuser);
}
res.redirect('/login');
});
app.listen(4000, function (){
  console.log("The server is running.");

});
