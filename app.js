
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', function(req, res) {
  res.render('index.ejs');
});


app.get('/login', function(req, res) {
    res.render('login.ejs');
});

app.get('/signup', function(req, res) {
    res.render('signup.ejs');
});

app.get('/form', function(req, res) {
    res.render('mainForm.ejs');
});








app.listen('3000', function(req, res) {
    console.log('Server is running on port 3000');
});