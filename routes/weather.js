'use strict';

let express = require('express');
let router = express.Router();
let request = require('request');
let cheerio = require('cheerio');

let checkError = (err, res, user) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(user);
  }
}

// get Yahoo weather
router.get('/yh/:state/:city', (req, res) => {
  let url = 'https://weather.yahoo.com/united-states/'+req.params.state+'/'+req.params.city+'/';
  console.log('Sending get request to:', url);

  request(url, function (err, response, body) {
    if (!err) {
      console.log (err);
      res.send(processYh(url, response));
    }
    else {
      console.log('Error retrieving Yahoo:', err);
      res.status(500).send(err);
    }
  })
});

// get YR weather
router.get('/yr/:state/:city', (req, res) => {
  let url = 'http://www.yr.no/place/United_States/'+req.params.state+'/'+req.params.city+'/';
  console.log('Sending get request to:', url);

  request(url, function (err, response) {
    if (!err) {
      res.send(processYr(url, response));
    }
    else {
      console.log('Error retrieving yr:', err);
      res.status(500).send(err);
    }
  })
});

// get Weather-Forecast weather
router.get('/wf/:state/:city', (req, res) => {
  let url = 'http://www.weather-forecast.com/locations/'+req.params.city.replace(' ', '-')+'/metars/latest';
  console.log('Sending get request to:', url);

  request(url, function (err, response) {
    if (!err) {
      res.send(processWf(url, response));
    }
    else {
      console.log('Error retrieving weather-forecast:', err);
      res.status(500).send(err);
    }
  })
});

function processYh(url, res) {
  let weather = {src: url};

  let $ = cheerio.load(res.body);

  weather.location = $('div#location-chooser span.name').text();
  weather.cond = $('div#lead-bd div.cond').text();
  weather.tCurC = $('div#lead-bd span.c>span.num').text();
  weather.tCurF = $('div#lead-bd span.f>span.num').text();
  weather.tTomC = $('div#mediaweather4dayforecastext ul.forecast li span.temperature span.hi-c').first().text() +
                  'C - ' +
                  $('div#mediaweather4dayforecastext ul.forecast li span.temperature span.lo-c').first().text() +
                  'C';
  weather.tTomF = $('div#mediaweather4dayforecastext ul.forecast li span.temperature span.hi-f').first().text() +
                  'F - ' +
                  $('div#mediaweather4dayforecastext ul.forecast li span.temperature span.lo-f').first().text() +
                  'F';

  return weather;
}

function processYr(url, res) {
  let weather = {src: url};

  let $ = cheerio.load(res.body);

  weather.location = $('div.yr-content-title>h1>span>strong').text();
  weather.cond = $('table.yr-table-overview2').eq(0).find('tr>td').eq(4).text();
  weather.tCurC = $('table.yr-table-overview2').eq(0).find('tr>td').eq(2).text();
  weather.tCurF = '-';
  weather.tTomC = $('table.yr-table-overview2').eq(1).find('tr>td').eq(2).text();
  weather.tTomF = '-';

  return weather;
}

function processWf(url, res) {
  let weather = {src: url};

  let $ = cheerio.load(res.body);

  weather.location = $('nav>h1').clone().children().remove().end().text();
  weather.cond = $('table.forecasts').eq(0).find('tr').eq(4).find('td').eq(0).text();
  weather.tCurC = $('table.forecasts').eq(0).find('tr').eq(7).find('td').eq(0).text();
  weather.tCurF = '-';
  weather.tTomC = $('table.forecasts').eq(0).find('tr').eq(7).find('td').eq(8).text();
  weather.tTomF = '-';

  return weather;
}

module.exports = router;

