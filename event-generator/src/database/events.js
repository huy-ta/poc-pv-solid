const generateRandomEvents = require('../eventGenerator');

const events = generateRandomEvents(10000);

let filteredEvents = {
  noFilter: events
};

module.exports = filteredEvents;
