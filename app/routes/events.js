//event-prime\app\routes\events.js
const express = require("express");
const Events = require("../controllers/events.js");
const EventsValidation = require("../middleware/eventsvalidation.js");

const app = express();

app.put("/new", EventsValidation.newEvent, Events.addNewEvent);

module.exports = app;