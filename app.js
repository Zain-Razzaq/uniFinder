
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'unifinder.curfrjxboxm1.eu-north-1.rds.amazonaws.com',
    user     : 'admin',
    password : 'ZainSumair123',
    database : 'uniFinder'

});

connection.connect(function(err) {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

  

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


app.get('/adminPage', function(req, res) {
    res.render('adminPage.ejs');
});

app.post('/signup', function(req, res) {
    var userData = {
        "name": req.body.userName,
        "email": req.body.userEmail,
        "password": req.body.userPassword,
        "cPassword": req.body.confirmUserPassword,
    }
    if(userData.password != userData.cPassword) {
        res.redirect('/signup');
    }
    else {
        connection.query('SELECT * FROM users WHERE email = ?',[userData.email], function (error, results, fields) {
            if (error) {
                console.log("error ocurred for query",error);
                res.redirect('/signup');
            } else {
                if(results.length >0){
                    console.log("User already exists");
                    res.redirect('/signup');
                }
                else{
                    connection.query('INSERT INTO users (username,password,email) values(?,?,?)',[userData.name,userData.password,userData.email], function (error, results, fields) {
                        if (error) {
                            console.log("error ocurred for query",error);
                            res.redirect('/signup');
                        } else {
                            res.redirect('/login');
                        }
                    });
                }
            }
        });
    }
});

app.post('/login', function(req, res) {
    var userData = {
        "email": req.body.userEmail,
        "password": req.body.userPassword,
    }
    connection.query('SELECT users.password FROM users WHERE email = ?',[userData.email], function (error, results, fields) {
        if (error) {
            console.log("error ocurred for query",error);
            res.redirect('/login');
        } else {
            if(results.length >0){
                if(results[0].password == userData.password){
                    res.redirect('/form');
                }
                else{
                    res.redirect('/login');
                }
            }
            else{
                res.redirect('/login');
            }
        }
    });
});




app.listen('3000', function(req, res) {
    console.log('Server is running on port 3000');
});