const express = require('express');
const app = express();

// will be used in the future for
// controlling who can access our API
const cors = require('cors');

// doesnt help yet but will hold project
// specific env vars in the future
require('dotenv').config();

const PORT = process.env.PORT || 4000;

// currently anyone can access our API
app.use(cors());

app.get('/location', (request, response) => {
  var locationData = '';
  try {
  // get location data from geo.json file
    locationData = searchToLatLong(request.query.data);
  } catch (error) {
    response.status(500).send('Sorry, something went wrong');
    //response.send(error);
    // response.status(500).json({ error: error.toString() });
  }
  response.send(locationData);
});

app.get('/weather', (request, response) => {
  // get weather data from darksky.json file
  const weatherData = searchWeather(request.query.data);
  response.send(weatherData);
});

function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  location.search_query = query;
  return location;
}

function Location(data) {
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

function searchWeather(query) {
  const weatherData = require('./data/darksky.json');
  var weather = [];
  weatherData.daily.data.forEach(dataElement => {
    weather.push(new Weather(dataElement));
  } );
  // const weather = new Weather(weatherData.daily.data[0]);
  //weather.search_query = query;
  return weather;
}

function Weather(data) {
  this.forecast = data.summary;
  this.time = data.time;

}

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
