const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

var whitelist = ['https://tylim88.github.io', 'http://example2.com'];
//allow which website can access
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
//control access, this is an important package
app.use(helmet());
//intercepting http request,shield/modify vulnerable information
//this is an important package
app.use(bodyParser.json());
//app.use(morgan('combined')); //more info
//app.use(morgan('tiny'));//less info
//applying middleware

app.get('/', (req, res) => {
  res.cookie('session', '1', { httpOnly: true }); //create cookie,session 1
  //set httpOnly to true to prevent cookie from being accessed by client side scripting(javascript)
  res.cookie('session', '1', { secure: true }); //set secure to true to ensure cookie send ove https connection
  //cannot set both at one command
  res.set({
    'Content-Security-Policy': "script-src'self''https//apis.google.com'"
  }); //set what website you can trust to accept the script
  //helmet automatically do this for us
  res.send('Hello World!');
});

app.post('/secret', (req, res) => {
  const { userInput } = req.body;
  console.log(userInput);
  if (userInput) {
    winston.log('info', 'user input: ' + userInput);
    res.status(200).json('success');
  } else {
    winston.error('This guy is messing with us:' + userInput);
    res.status(400).json('incorrect submission');
  }
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
