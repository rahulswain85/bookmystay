require("dotenv").config();
var api_key = process.env.GEOAPIFY_API;



let geocode = async function (cityname) {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${cityname}&format=json&apiKey=${api_key}`;

  const response = await fetch(url);
  const data = await response.json();

  const lon = data.results[0].lon;
  const lat = data.results[0].lat;

  return { lat, lon }; // this is the actual value
};


module.exports = { geocode };