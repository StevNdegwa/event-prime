//event-prime\app\routes\events.js
const express = require("express");
const Events = require("../controllers/events.js");
const Tickets = require("../controllers/tickets.js");
const EventsValidation = require("../middleware/eventsvalidation.js");
const UserAuthorization = require("../middleware/userauthorization.js");
const TicketsValidation = require("../middleware/ticketsvalidation.js");

const app = express.Router();

app.put("/new", UserAuthorization.createEvent, EventsValidation.newEvent, Events.addNewEvent);
app.get("/user/:id", UserAuthorization.readUserEvents, Events.getUserEvents);
app.get("/all", Events.getAllEvents);

app.put("/tickets/create/:eventid", TicketsValidation.newTickets, Tickets.addNewTickets);

module.exports = app;