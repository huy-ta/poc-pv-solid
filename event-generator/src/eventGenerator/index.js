const randomName = require('random-name');
const randomColor = require('random-color');
const randomDate = require('random-date');
const uuidv4 = require('uuid/v4');
 
let calendar = generateRandomCalendar();

function generateRandomCalendar() {
  return {
    name: randomName(),
    color: randomColor().hexString(),
    id: `cal-${uuidv4()}`
  }
}

function generateRandomEvents(totalEvents) {
  let events = [];

  for (let i = 0; i < totalEvents; i++) {
    if (Math.random() < 0.3) calendar = generateRandomCalendar();

    const startDate = randomDate('5d');

    let event = {
      id: `ev-${uuidv4()}`,
      calendar,
      start: startDate,
      end: startDate + (3.6e+6 + Math.round(Math.random() * 7.2e+6)),
      title: `Event ${randomName()}`,
      // title: `An event that has ${randomName()} as attendee - hosted by ${calendar.name}`,
    }

    event.summary = event.title;

    events.push(event);
  }

  return events;
}

module.exports = generateRandomEvents;
