const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Availabilitys Models
const { Availability } = require('../../../../models/things');


//create-many
let item = { Availability: { Collection: Availability, router} }

// includes collections, true for all items, and then the associated attributes
let availability = new Brain.CRUD(item.Availability, true, 'owner')
availability.Run()

module.exports = router;
