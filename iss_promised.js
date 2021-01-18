const request = require("request-promise-native");

//return the promise of a response

const fetchMyIP = function () {
  return request(`https://api.ipify.org?format=json`);
};

const fetchCoordsByIP = function (body) {
  const ip = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${ip}`);
};

const fetchISSFlyOverTimes = function (body) {
  const lat = JSON.parse(body).latitude;
  const lon = JSON.parse(body).longitude;
  return request(
    `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`
  );
};

const nextISSTimesForMyLocation = function () {
  return fetchMyIP() 
    .then(fetchCoordsByIP) 
    .then(fetchISSFlyOverTimes) 
    .then((data) => {
      const { response } = JSON.parse(data); //parsing data using the response key
      return response;  //return data.response values
    });
};

module.exports = { nextISSTimesForMyLocation };
