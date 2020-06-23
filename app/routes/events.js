//event-prime\app\routes\events.js
const express = require("express");
const Events = require("../controllers/events.js");
const EventsValidation = require("../middleware/eventsvalidation.js");

const app = express.Router();

app.put("/new", EventsValidation.newEvent, Events.addNewEvent);
app.get("/user", Events.getUserEvents);
app.get("/all", Events.getAllEvents);

module.exports = app;