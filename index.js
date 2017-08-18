const fs = require("fs");
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('session');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const app = express();
app.engine = ('mustache', mustache());
app.set = ('view engine', 'mustache');
app.use(bodyparser.urlencoded({extended: false}));
app.use = (express.static(__dirname + '/css/styles.css'));
app.session(sesion({
  secret: 'i85bky57iolmhy6thiu87',
  resave: false,
  saveUninitialized: true
})
app.get ('/login', function (req, res) {

});

let users = [{username: "chris", password: "abc"},
{username: "ericka", password: 123 },
{username: "chad", password: "jkl"},
];

app.post ('/login', function (req, res){
  let user = null;
  for (let i=0; i<users.length; i++) {
  if (res.body.username == users[i].username && res.body.password === users[i].password) {
   users=users[i];
  }
});
if (user !== null) {
  res.session.user = user;
  res.redirect('hangman');
}
if (user === null) {
  res.redirect('index');
}

app.listen(4000, function (){
  console.log("The server is running.");
});
