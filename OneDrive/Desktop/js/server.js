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
const port = 8080;

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
  console.log("Server started at post: " + port);
});

/*
to deploy image:
  docker build . -t test
  docker tag test us-central1-docker.pkg.dev/trailblazer-403720/test/test
  docker push us-central1-docker.pkg.dev/trailblazer-403720/test/test

  then open google cloud run
  click on service
  edit & deploy new revision
  select latest image from artifact repository
  try to access new URL
*/