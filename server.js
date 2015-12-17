'use strict';

let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');

let weather = require('./routes/weather');

let port = process.env.PORT || 3000;

let app = express();
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('bower_components'));


app.use('/api/weather', weather);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

process.on('exit', (code) => {
  mongoose.disconnect();
  console.log('About to exit with code:', code);
});

let listener = app.listen(port);

console.log('express in listening on port: ' + port);

module.exports = app;
