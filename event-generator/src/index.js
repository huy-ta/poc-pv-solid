const express = require('express');
const cors = require('cors');

const app = express();
const port = 20597;

const dbEvents = require('./database/events');

app.use(cors());

app.get('/events', (req, res) => {
  const { query = '', offset = 0, limit = 40 } = req.query;

  let events;

  if (query) {
    if (dbEvents.hasOwnProperty(query)) {
      events = dbEvents[query];
    } else {
      events = dbEvents.noFilter.filter(event => event.title.indexOf(query) > -1)
      dbEvents[query] = events;
    }
  } else {
    events = dbEvents.noFilter;
  }

  events = events.sort((eventA, eventB) => (eventA.start > eventB.start) ? 1 : ((eventB.start > eventA.start) ? -1 : 0)); 

  let count = 1;
  events = events.map(event => ({ ...event, count: count++ }));

  const start = +offset;
  const end = +offset + +limit;

  let eventResults = events.slice(start, end);

  res.json({
    events: eventResults,
    hasMore: end < events.length
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
