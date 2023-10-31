// imports
const express = require('express');
const path = require('path');
const body_parser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

// declare routes
const achievements = require('./routes/achievements');
const authenticate = require('./routes/authentication');
const getinfo = require('./routes/getinfo');

// server to be used
const app = express();

// port to be used
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname,'public')));

app.use(body_parser.json());
app.use(require('express-session')({ 
  secret: 'Enter your secret key',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// register routes
app.use('/api/achievements',achievements);
app.use('/api/authenticate',authenticate);
app.use('/api/getinfo',getinfo); 

// default endpoint
app.get('/',(req,res)=>{
  res.send('Invalid Endpoint');
});

app.listen(port,()=>{
  console.log("Server started at post: "+port);
});
