// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//timestamp API endpoint
app.get("/api/timestamp/:date_string?", function (req, res) {
  //First capture the supplied timestamp as an arg
  const suppliedTimeStamp = req.params.date_string;
  
  //Check to see if suppliedTimeStamp is blank
  const isSuppliedTimeStampBlank = (suppliedTimeStamp === null || suppliedTimeStamp === undefined) ? true : false;
  
  //Convert the supplied timestamp string into a Date object
  let convertedTimeStamp = new Date(suppliedTimeStamp);
  
  //if convertedTimeStamp is not a date, try parsing suppliedTimeStamp first and seeing if convertedTimeStamp becomes a date
  if(! (convertedTimeStamp instanceof Date && !isNaN(convertedTimeStamp.getTime())) ) {
    convertedTimeStamp = new Date(parseInt(suppliedTimeStamp));
  }
  
  let returnJson = "";
  
  //if no timestamp is supplied, return the current datetime
  if(isSuppliedTimeStampBlank) {
    const currentDate = new Date();
    returnJson = {"unix": currentDate, "utc" : currentDate.toUTCString() };
  } else { //if a timestamp arg was supplied,
    //check if string can be parsed by using...new Date(date_string). This condition checks if convertedTimeStamp is a valid date object as it is originally supplied
    if( convertedTimeStamp instanceof Date && !isNaN(convertedTimeStamp.getTime()) ) {
      returnJson = {"unix": convertedTimeStamp.getTime(), "utc" : convertedTimeStamp.toUTCString() };
    } else {
      //return invalid notice if supplied timestamp cannot be converted to a valid date object
      returnJson = {"unix": null, "utc" : "Invalid Date" };
    }
  }
  
  return res.json(returnJson);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});