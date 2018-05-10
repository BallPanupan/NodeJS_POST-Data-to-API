var express = require('express');
//var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');

var express = require('express')
  , http = require('http')
  , app = express()
  , server = http.createServer(app)


app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var csrfProtection = csrf({cookie:true});
app.use(cookieParser());
var unirest = require('unirest');

function main(req, res){
  unirest.post('http://172.16.4.150:3000/api/user')
  .send({"prefix" : "1","first_name" : "2","last_name" : "3","email" : "4","username" : "5","password" : "6"})
  .end(function (response) {
    console.log(response.body);
  });

  console.log("\n\n\n");
  unirest.get('http://172.16.4.150:3000/api/user',function(req,res){
    console.log("\n"+req.raw_body);
  });
}

app.get('/',function(req,res){
  res.render('Index')
  console.log("Index Page");

  // unirest.get('http://172.16.4.150:3000/api/user',function(req,res){
  //   console.log("\n"+req.raw_body);
  // });
});

app.get('/insert',function(req,res){
  res.render('Insert')
  console.log("Register Page");
});


app.post('/insert',function(req,res){
  var users = [
    {"sex" : req.body.sex},
    {"fname" : req.body.fname},
    {"lname" : req.body.lname},
    {"email" : req.body.email},
    {"username" : req.body.username},
    {"password" : req.body.password}
  ]
  console.log(users);

  unirest.post('http://172.16.4.150:3000/api/user')
  .send({"prefix" : req.body.sex,"first_name" : req.body.fname,"last_name" : req.body.lname,
        "email" : req.body.email,"username" : req.body.username,"password" : req.body.password})
  .end(function (response) {
    console.log(response.body);
  });

  // users.save();
  res.redirect('/')
});

app.get('/user/:id',function(req,res){
  var id = req.params.id;
  var dataX;
  unirest.get('http://172.16.4.150:3000/api/user/'+id,function(req,res){
    dataX= req.raw_body;
    //dataX.push(req.raw_body);

  });
  setTimeout(function(){
    console.log(dataX);
    console.log("View Page");
    res.render('view',{data:dataX})
  },1000);
  return;
});

////////////////////////////////////////////////////////////////
//Login
app.get('/login',function(req,res){
  // unirest.post('http://172.16.4.150:3000/api/user/auth')
  // .send({"username" : req.body.username,"password" : req.body.password})
  // .end(function (response) {
  //   console.log(response.body);
  // });
  res.render('login')
});

app.post('/login',function(req,res){
  var dataX_login;
  unirest.post('http://172.16.4.150:3000/api/user/auth')
  .send({"username" : req.body.username,"password" : req.body.password})
  .end(function (response) {
    console.log(response.body);
    console.log("________________________________");
    dataX_login = response.body;
  });

  setTimeout(function(){
    console.log(dataX_login);
    console.log("Login OK\n\n");
    var users = [
      {"first_name" : dataX_login.first_name},
      {"last_name" : dataX_login.last_name},
      {"email" : dataX_login.email},
      {"id" : dataX_login.id}
    ]
    console.log(users);
    res.render('view',{data:users})
  },1000);
});



//RUN SERVER
app.listen(3000,function(){
  console.log('\n Server Started on localhost:3000...\n');
});
