
var express = require('express');
var bodyParser = require('body-parser');
var books = require('./routes/books.js');
var authors = require('./routes/authors.js');
const userComponent = require('./components/users');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
var app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// You can store key-value pairs in express, here we store the port setting
app.set('port', (process.env.PORT || 80));

passport.use(new BasicStrategy(
    function(username, password, done) {
      const user = users.getUserByName(username);
      if(user == undefined) {
        console.log("HTTP Basic username not found");
        return done(null, false, {message: "HTTP Basic username not found"});
      }
      if(bcrypt.compareSync(password, user.password) == false) {
        console.log("HTTP Basic password not matching username");
        return done(null, false, {message: "HTTP Basic password not found"});
      }
      return done(null, user);
    }
  ))

  app.get('/protected',
  passport.authenticate('basic', {session: false}),
  (req, res) => {res.json({yourProtectedResource: "profit"});
});


// bodyParser needs to be configured for parsing JSON from HTTP body
app.use(bodyParser.json());

// Mount our routes behind /api/ prefix
app.use('/api', books);
app.use('/api', authors);
app.use('/users', userComponent );

// Simple hello world route
app.get('/', function(req, res) {
    res.send("Hello class, this is automatic deploy demo");
});

app.get('/test', function(req, res) {
    res.send("Hi");
});



// start listening for incoming HTTP connections
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
