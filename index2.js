const { nextISSTimesForMyLocation } = require('./iss_promised');

//if there is a response, .then do this, and log body to the console

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
.then((passTimes) => {
    printPassTimes(passTimes);
  }).catch((error) => {
    console.log("It didn't work: ", error.message);
  });