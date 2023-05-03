
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt= require('bcrypt');  // for hashing password

require('dotenv').config();

var mysql = require('mysql');
var uniNames = [];
var degree_names = [];
var city_names = [];
var display = [];
var firstTimeForUniNameFetch = true;

// var connection =require('./mySql.js').connection;

connection =mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
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



function getDegreeNames(){
    return new Promise((resolve, reject) => {
        connection.query('SELECT DISTINCT degree_name FROM degree ORDER BY degree_name', function (error, results, fields) {
            if (error) {
                console.log("error ocurred for query",error);
                reject(error);
            }
            degree_names = results;
            resolve();
        });
    });
}

function getCityNames(){
    return new Promise((resolve, reject) => {
        connection.query('SELECT DISTINCT city FROM university ORDER BY city', function (error, results, fields) {
            if (error) {
                console.log("error ocurred for query",error);
                reject(error);
            }
            city_names = results;
            resolve();
        });
    });
}
app.get('/form', function(req, res) {
    display = [];
    getDegreeNames().then(function(){
        getCityNames().then(function(){
            res.render('mainForm.ejs', {degree_names: degree_names, city_names: city_names, display: display});
        });
    });
});

function getData(requirments){
    return new Promise((resolve, reject) => {
        var first= true;

        var q = "SELECT DISTINCT university.name, university.city, university.type,university.website,university.times_ranking,university.world_ranking,university.hec_ranking,university.sector,degree.fee FROM university JOIN degree ON university.id = degree.university_id";
            q+=" WHERE ";
            if(requirments.degreeLevel != undefined) {
                first = false;
                q += "degree.degree_level like '%"+ requirments.degreeLevel+"%'";
            }
            if(requirments.degreeName != undefined) {
                if(!first){
                    q+=" AND ";
                }
                first = false;
                q += "degree.degree_name like '%"+ requirments.degreeName+"%'";
            }
            if(requirments.sector != undefined) {
                if(!first){
                    q+=" AND ";
                }
                first = false;
                q += "university.sector like '%"+ requirments.sector+"%'";
            }
            if(requirments.universityType != undefined) {
                if(!first){
                    q+=" AND ";
                }
                first = false;
                q += "university.type like '%"+ requirments.universityType+"%'";
            }
            if(requirments.city != undefined) {
                if(!first){
                    q+=" AND ";
                }
                first = false;
                q += "university.city like '%"+ requirments.city+"%'";
            }
            q+=" order by university.hec_ranking;";
            
        // console.log(q);
        connection.query(q, function (error, results, fields) {
            if (error) {
                console.log("error ocurred for query",error);
                // res.redirect('/form');
                reject(error);
            } else {
                // console.log(results);
                display = results;
                resolve();
                // console.log(display);
            }
        });
    });

}

app.post('/form', function(req, res) {
    display = [];
    requirments= {
        degreeLevel: req.body.degreeLevel,
        degreeName: req.body.degreeName,
        sector : req.body.sector,
        universityType: req.body.universityType,
        city: req.body.city,
    }
    
    getData(requirments).then(function(){
        res.render('mainForm.ejs', {degree_names: degree_names, city_names: city_names, display: display});
    });
});

function getUniversityNames(){
    return new Promise((resolve, reject) => {
        connection.query('SELECT  id, name FROM university ORDER BY name', function (error, results, fields) {
            if (error) {
                console.log("error ocurred for query",error);
                reject(error);
            }
            uniNames = results;
            resolve();
        });
    });
}

app.get('/adminPage', function(req, res) {
    if(firstTimeForUniNameFetch){
        getUniversityNames().then(function(){
            res.render('adminPage.ejs',{universities : uniNames});
        });
        firstTimeForUniNameFetch = false;
    }
    else{
        res.render ('adminPage.ejs',{universities : uniNames});
    }

});

app.post('/addUniForm', function(req, res) {
    var uniData = {
        "name": req.body.uniName,
        "city": req.body.uniCity,
        "website": req.body.uniWebsite,
        "type": req.body.uniType,
        "times_ranking": req.body.uniTimesRanking,
        "world_ranking": req.body.uniWorldRanking,
        "hec_ranking": req.body.uniHecRanking,
        "sector": req.body.uniSector,
    }
    connection.query('INSERT INTO university SET ?', uniData, function (error, results, fields) {
        if (error) {
            console.log("error ocurred for query",error);
            res.redirect('/adminPage',{universities : uniNames});
        }
    });
    getUniversityNames().then(function(){
        res.render('adminPage.ejs',{universities : uniNames});
    });
});


app.post('/addDegreeForm', function(req, res) {
    var degreeData = {
        "degree_name": req.body.degreeName,
        "degree_level": req.body.degreeLevel,
        "duration": req.body.degreeDuration,
        "fee": req.body.degreeFee,
        "uniId": req.body.uni_id,
    }
    console.log(degreeData);

    q="INSERT INTO degree (degree_name, degree_level, duration, fee, university_id) values ('"+ degreeData.degree_name+"','"+ degreeData.degree_level+"','"+degreeData.duration+"','"+degreeData.fee+"','"+ degreeData.uniId+"');";

    connection.query(q, degreeData, function (error, results, fields) {
        if (error) {
            console.log("error ocurred for query",error);
            res.redirect('/adminPage',{universities : uniNames});
        }
    });
    res.render('adminPage.ejs',{universities : uniNames});
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
                    bcrypt.hash(userData.password, 10 , function(err, hash) {
                        userData.password = hash;
                        connection.query('INSERT INTO users (username,password,email) values(?,?,?)',[userData.name,userData.password,userData.email], function (error, results, fields) {
                            if (error) {
                                console.log("error ocurred for query",error);
                                res.redirect('/signup');
                            } else {
                                res.redirect('/login');
                            }
                        });
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
                bcrypt.compare(userData.password, results[0].password, function(err, result) {
                    if(result) {
                        res.redirect('/adminPage');
                    }
                    else {
                        res.redirect('/login');
                    }
                });
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