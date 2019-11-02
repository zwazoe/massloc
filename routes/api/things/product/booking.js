const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Bookings Models
const { Booking } = require('../../../../models/things');


//create-many
let item = { Booking: { Collection: Booking, router} }

// includes collections, true for all items, and then the associated attributes
let booking = new Brain.CRUD(item.Booking, true, 'owner')
booking.Run()

module.exports = router;
