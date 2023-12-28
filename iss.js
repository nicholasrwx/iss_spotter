const request = require("request");

//GET i.p. address
const fetchMyIP = function (callback) {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    if (body) {
      const data = JSON.parse(body);
      callback(null, data.ip);
      return;
    }
  });
};

//GET latitude and longitude
const fetchCoordsByIP = function (ip, callback) {
  console.log(ip);
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      return callback(
        Error(
          `Status Code ${response.statusCode} when fetching coordinates for IP: ${body}`
        ),
        null
      );
    }
    if (body) {
      const geoData = JSON.parse(body);
      const latLong = {
        latitude: geoData.latitude,
        longitude: geoData.longitude,
      };
      return callback(null, latLong);
    }
  });
};

//GET International Space Stations Next 5 Flyovers based on geographical position
const fetchISSFlyOverTimes = function (coords, callback) {
  let lat = coords.latitude;
  let lon = coords.longitude;
  request(
    `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`,
    (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (response.statusCode !== 200) {
        callback(
          Error(
            `Status Code ${response.statusCode} when fetching coordinates for IP: ${body}`
          ),
          null
        );
        return;
      }
      const passes = JSON.parse(body).response;
      if (response) {
        callback(null, passes);
        return;
      }
      if (body) {
        callback(Error(`Error! Incorrect Data`), null);
        return;
      }
    }
  );
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      //because this function call is inside the previous function
      if (error) {
        // It can use the data returned in ip
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = {
  nextISSTimesForMyLocation,
};
